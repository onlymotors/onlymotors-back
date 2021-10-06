const swaggerAutogen = require('swagger-autogen')()

const outputFile = './src/swagger.json'
const endpointsFiles = ['./src/routes.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "Only Motors",
        description: "Documentation from Only Motors API's"
    },
    host: "localhost:3333",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Users",
            "description": "Endpoints"
        },
        {
            "name": "Sales",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Bearer token authtentication'
        }
    },
    definitions: {
        Login: {
            $emailUser: "emailUser@email.com",
            $senhaUser: "any"
        },
        Update_User: {
            $userId: "615d96f20ba44e99c1b75aa7",
            Json:{
                dataAlteracao :"2022-10-06T12:53:54.139+00:00",
                enderecoUser :"teste",
                senhaNova :"teste",
                statusCadastro: "teste",
                senhaAtual :"Rn7naw7mcf",
                senhaUser :"Rn7naw7mcf",
                senhaNova_r : "teste"
            }
        },
        Anuncios: {
            $anuncioId: "615d96f20ba44e99c1b75aa7" 
        },
        Update_Anuncio: {
            $anuncioId: "615d96f20ba44e99c1b75aa7",
            Json:{
                $dataAlteracao: "2022-10-06T12:53:54.139+00:00",
                $statusAnuncio: "vendido",
                $dataAlteracao_r: "2022-10-06T12:53:54.139+00:00"
            }
        },

        Num_visitas_Anuncio: {
            $anuncioId: "615d96f20ba44e99c1b75aa7",
            Json:{
                contagem: "1",
                numVisitas: "2",
                contagem_r: "3"
            }
          },

        Num_contatos_Anuncio: {
            $anuncioId: "615d96f20ba44e99c1b75aa7",
            Json:{
                contagem: "1",
                numContatos: "2",
                contagem_r: "3"
            }
          }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../src/server.js')
})
