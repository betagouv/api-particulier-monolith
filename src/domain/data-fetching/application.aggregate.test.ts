import {DGFIPInput, DGFIPOutput} from '../administration/dgfip/dto';
import {Application} from './application.aggregate';
// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {DGFIPDataProvider} from '../administration/dgfip/data-provider';
import {ApplicationNotSubscribedError} from './errors/application-not-subscribed.error';
import {ApplicationId} from 'src/domain/application-id';

describe('The application aggregate', () => {
  describe('when called for DGFIP data', () => {
    it('throws an error if application is not subscribed to DGFIP data provider', async () => {
      const application = new Application('croute' as ApplicationId, [], []);

      const useCase = async () =>
        await application.consumeDGFIP(
          mock<DGFIPInput>(),
          mock<DGFIPDataProvider>()
        );

      expect(useCase).rejects.toBeInstanceOf(ApplicationNotSubscribedError);
    });

    const application = new Application(
      'croute' as ApplicationId,
      ['DGFIP'],
      ['dgfip_avis_imposition']
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
});
