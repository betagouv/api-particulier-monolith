// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {Application} from 'src/domain/gateway/application.aggregate';
import {ApplicationNotSubscribedError} from 'src/domain/gateway/errors/application-not-subscribed.error';
import {DGFIPDataProvider} from 'src/domain/gateway/data-providers/dgfip/data-provider';
import {
  DGFIPInput,
  DGFIPOutput,
} from 'src/domain/gateway/data-providers/dgfip/dto';
import {UserEmail} from 'src/domain/gateway/user';
import {
  CNAFInput,
  CNAFOutput,
} from 'src/domain/gateway/data-providers/cnaf/dto';
import {CNAFDataProvider} from 'src/domain/gateway/data-providers/cnaf/data-provider';
import {Token} from 'src/domain/gateway/token';

describe('An application', () => {
  const uuidFactory = {
    generateUuid() {
      return 'yolo';
    },
  };
  const tokenFactory = {
    generateToken() {
      return 'croute' as Token;
    },
  };

  it('creates a token upon application creation', () => {
    const application = Application.create(
      'yolo',
      '4',
      [],
      [],
      ['georges@moustaki.fr' as UserEmail],
      uuidFactory,
      tokenFactory
    );

    expect(application.token).toBeDefined();
  });

  it('can subscribe new users', () => {
    const newUser = 'jean@moust.fr' as UserEmail;

    const application = Application.create(
      'yolo',
      '4',
      [],
      [],
      ['georges@moustaki.fr' as UserEmail],
      uuidFactory,
      tokenFactory
    );

    application.subscribeUser(newUser);

    expect(application.userEmails).toHaveLength(2);
    expect(application.userEmails[1]).toEqual(newUser);
  });

  describe('when called for DGFIP data', () => {
    it('throws an error if application is not subscribed to DGFIP data provider', async () => {
      const application = Application.create(
        'croute',
        'yolo',
        [],
        [],
        [],
        uuidFactory,
        tokenFactory
      );

      const useCase = async () =>
        await application.consumeDGFIP(
          mock<DGFIPInput>(),
          mock<DGFIPDataProvider>()
        );

      expect(useCase).rejects.toBeInstanceOf(ApplicationNotSubscribedError);
    });

    const application = Application.create(
      'croute',
      'yolo',
      ['DGFIP'],
      ['dgfip_avis_imposition'],
      [],
      uuidFactory,
      tokenFactory
    );

    it('calls the data provider and filters return data', async () => {
      const input: DGFIPInput = {
        taxNumber: '3',
        taxNoticeNumber: '4',
      };

      const unfilteredData = Symbol('unfiltered data');
      const dataProvider = mock<DGFIPDataProvider>();
      dataProvider.fetch.mockResolvedValue(
        unfilteredData as unknown as DGFIPOutput
      );

      const result = await application.consumeDGFIP(input, dataProvider);

      expect(result).toEqual({});
    });
  });

  describe('when called for CNAF data', () => {
    it('throws an error if application is not subscribed to CNAF data provider', async () => {
      const application = Application.create(
        'croute',
        'yolo',
        [],
        [],
        [],
        uuidFactory,
        tokenFactory
      );

      const useCase = async () =>
        await application.consumeCNAF(
          mock<CNAFInput>(),
          mock<CNAFDataProvider>()
        );

      expect(useCase).rejects.toBeInstanceOf(ApplicationNotSubscribedError);
    });

    const application = Application.create(
      'croute',
      'yolo',
      ['CNAF'],
      ['cnaf_adresse'],
      [],
      uuidFactory,
      tokenFactory
    );

    it('calls the data provider and filters return data', async () => {
      const input: CNAFInput = {
        codePostal: '3',
        numeroAllocataire: '4',
      };

      const unfilteredData = Symbol('unfiltered data');
      const dataProvider = mock<CNAFDataProvider>();
      dataProvider.fetch.mockResolvedValue(
        unfilteredData as unknown as CNAFOutput
      );

      const result = await application.consumeCNAF(input, dataProvider);

      expect(result).toEqual({});
    });
  });
});
