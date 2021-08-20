import {OperationObject, PathsObject, ResponseObject} from 'openapi3-ts';
import {
  internalServerError,
  mesriNotFoundError,
  networkError,
  unauthorizedResponse,
} from 'src/presentation/schema/errors';

export const mesriPaths: PathsObject = {
  '/v2/etudiants': {
    get: <OperationObject>{
      tags: ['Statut étudiant'],
      parameters: [
        {
          name: 'ine',
          in: 'query',
          schema: {
            type: 'string',
          },
          required: true,
        },
      ],
      summary: "Recherche du statut étudiant d'un particulier",
      description: `Le service permet de récupérer le statut étudiant d'un particulier, avec ses données d'inscriptions scolaires.

**Paramètres d'appel :** (mutuellement exclusifs, l'appel par INE est réservé aux acteurs de la sphère de l'enseignement)
 - INE, l'Identifiant National Étudiant
 - état civil, constitué du nom, prénom, date de naissance, sexe et lieu de naissance

**Jetons de bac à sable associés à cette route :**
 - Statut Étudiant : 1b8bea9a1df409af64c995e58014f642

**Données disponibles en bac à sable :** [liste](https://airtable.com/invite/l?inviteId=invaqM68okWdPDzc5&inviteToken=43864c010a85095fd8acc6770f6528ce3beff684f60e7aab58e248c29e6d0433&utm_source=email)`,
      responses: {
        '200': <ResponseObject>{
          description: "La situation d'un étudiant et ses inscriptions",
          content: {
            'application/json': {
              schema: {
                properties: {
                  ine: {
                    type: 'string',
                    description: "Identifiant unique de l'étudiant",
                    example: '1234567890G',
                  },
                  nom: {
                    type: 'string',
                    description: 'Le nom de naissance',
                    example: 'Moustaki',
                  },
                  prenom: {
                    type: 'string',
                    description: 'Le prénom',
                    example: 'Georges',
                  },
                  dateNaissance: {
                    type: 'string',
                    format: 'date',
                    description: 'La date de naissance',
                    example: '1992-11-29',
                  },
                  inscriptions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        dateDebutInscription: {
                          type: 'string',
                          format: 'date',
                          description:
                            "La date de début d'inscription à l'établissement",
                          example: '2019-09-01',
                        },
                        dateFinInscription: {
                          type: 'string',
                          format: 'date',
                          description:
                            "La date de fin d'inscription à l'établissement",
                          example: '2020-06-29',
                        },
                        statut: {
                          type: 'string',
                          description: "Le statut de l'inscription",
                          example: 'admis',
                          enum: ['admis', 'inscrit'],
                        },
                        regime: {
                          type: 'string',
                          description: 'Le régime de formation',
                          example: 'formation initiale',
                          enum: ['formation initiale', 'formation continue'],
                        },
                        codeCommune: {
                          type: 'string',
                          description: 'Le code commune',
                          example: '29085',
                        },
                        etablissement: {
                          type: 'object',
                          properties: {
                            uai: {
                              type: 'string',
                              description:
                                "Identifiant unique de l'établissement",
                              example: '0011402U',
                            },
                            nom: {
                              type: 'string',
                              description: "Nom de l'établissement",
                              example:
                                'EGC AIN BOURG EN BRESSE EC GESTION ET COMMERCE (01000)',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': unauthorizedResponse,
        '404': mesriNotFoundError,
        '503': networkError,
        '500': internalServerError,
      },
    },
  },
};
