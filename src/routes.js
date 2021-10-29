const { Router } = require('express');
const multer = require('multer');

const TokenService = require('./services/TokenService')

const AnuncioController = require('./controllers/AnuncioController');
const SearchControllers = require('./controllers/SearchControllers');
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const LogService = require('./services/LogService');
const uploadImage = require('./services/CloudImageUpload');
const ChatRoomController = require('./controllers/ChatRoomController');

const routes = Router();
const multerConfig = multer();

routes.post('/login', LogService.registrarAcesso, AuthController.auth
  /* 
      #swagger.tags = ['Users']
      #swagger.description = 'Endpoint responsible to login the app.'
      #swagger.consumes = ['application/json']
      #swagger.required = 'true'
      #swagger.description = 'Json containing email and user from a user register in the database.'
  
  */
);

// ROTA DE TESTE
routes.get('/users', LogService.registrarAcesso, UserController.index
  /*
      #swagger.tags = ['Users']
      #swagger.description = "Endpoint responsible for searching all existing users in the users collection."
  */
);

routes.get('/users/userid', TokenService.validateToken, LogService.registrarAcesso, UserController.getUserByUserId
  /*
      #swagger.tags = ['Users']
      #swagger.description = "Endpoint responsible for searching a user by user_id in the users collection."
      #swagger.security = [{
          "ApiKeyAuth": []
      }]
  */
)

routes.post('/users', LogService.registrarAcesso, multerConfig.single('file'), UserController.store
  /* 
      #swagger.tags = ['Users']
      #swagger.description = 'Endpoint responsible for from a csv file, register one or multiple users in collection of users.'
      #swagger.responses[500] = 'descrption': 'Server error. Possible Cause: Incorrect CSV file template.'
      #swagger.consumes = ['multipart/form-data'] 
      #swagger.parameters['file'] = {
                in: 'formData',
                type: 'file',
                required: 'true',
                description: 'CSV file containing user data to be registered. The CSV file must be in the expected format.'
          }
  */
);

routes.delete('/users/userid', TokenService.validateToken, LogService.registrarAcesso, UserController.delete
  /*
      #swagger.tags = ['Users']
      #swagger.description = "Endpoint responsible for delete a user and your ads, searching by user_id in the users collection."
      #swagger.security = [{
          "ApiKeyAuth": []
      }]
  */
)

routes.patch('/users/userid', TokenService.validateToken, LogService.registrarAcesso, UserController.update
  /*
      #swagger.tags = ['Users']
      #swagger.description = "Endpoint responsible for update the register of a user in the database."
      #swagger.security = [{
          "ApiKeyAuth": []
      }]
  */
)

routes.get('/anuncios', LogService.registrarAcesso, SearchControllers.getAnuncios
  /*
      #swagger.tags = ['Sales']
      #swagger.description = "Endpoint responsible for searching all existing records in the ad collection."
      #swagger.responses[200] = 'descrption': 'OK'
  */
);

routes.get('/anuncios/userid', TokenService.validateToken, LogService.registrarAcesso, SearchControllers.getAnunciosByUserId
  /*
      #swagger.tags = ['Sales']
      #swagger.description = "Endpoint responsible for searching all existing ads from a one user, searching by user_id in the users collection."
      #swagger.responses[200] = 'descrption': 'OK'
      #swagger.security = [{
          "ApiKeyAuth": []
      }]
  */
);

routes.get('/anuncios/:anuncioId', LogService.registrarAcesso, SearchControllers.getAnuncioByAnuncioId
  /*
      #swagger.tags = ['Sales']
      #swagger.description = "Endpoint responsible for searching a ad by your respective anuncioID existing in the ad collection."
      #swagger.responses[200] = 'descrption': 'OK'
  */
);

routes.post('/anuncios', multerConfig.single('file'), TokenService.validateToken, LogService.registrarAcesso, AnuncioController.store
  /* 
      #swagger.tags = ['Sales']
      #swagger.description = 'Endpoint responsible for feeding a collection of ads, from a csv file.'
      #swagger.responses[500] = 'descrption': 'Server error. Possible Cause: Incorrect CSV file template.'
      #swagger.consumes = ['multipart/form-data'] 
      #swagger.parameters['file'] = {
                in: 'formData',
                type: 'file',
                required: 'true',
                description: 'CSV file containing vehicle ad data to be registered. The CSV file must be in the expected format.'
          }
      #swagger.security = [{
          "ApiKeyAuth": []
      }]
  */
);

routes.delete('/anuncios/:anuncioId', TokenService.validateToken, LogService.registrarAcesso, AnuncioController.delete
  /*
      #swagger.tags = ['Sales']
      #swagger.description = "Endpoint responsible for delete a ad from ad colletion, searching by your respective anuncioID existing in the ad collection."
      #swagger.security = [{
          "ApiKeyAuth": []
      }]
  */
);

routes.patch('/anuncios/:anuncioId', TokenService.validateToken, LogService.registrarAcesso, multerConfig.single('image'), uploadImage, AnuncioController.update
  /*
      #swagger.tags = ['Sales']
      #swagger.description = "Endpoint responsible for update the register of a ad in the ad collection."
      #swagger.consumes = ['multipart/form-data'] 
      #swagger.parameters['image'] = {
                in: 'formData',
                type: 'file',
                description: 'Advertised vehicle image.'
          }
      #swagger.security = [{
          "ApiKeyAuth": []
      }]
  */
);

routes.patch('/anuncios/:anuncioId/numvisitas', LogService.registrarAcesso, AnuncioController.registrarVisitas
  /*
      #swagger.tags = ['Sales']
      #swagger.description = "Endpoint responsible for update the register of a visit number in a ad in the ad collection."
  */
);

routes.patch('/anuncios/:anuncioId/numcontatos', LogService.registrarAcesso, AnuncioController.registrarContatos
  /*
      #swagger.tags = ['Sales']
      #swagger.description = "Endpoint responsible for update the register of a contat numbers for one ad in the ad collection."
  */
);

routes.get('/chatrooms/userid', TokenService.validateToken, LogService.registrarAcesso, ChatRoomController.getChatRoomsByUserId)
routes.get('/chatrooms/:chatRoomId', TokenService.validateToken, LogService.registrarAcesso, ChatRoomController.getChatRoomByChatRoomId)
routes.post('/chatrooms/:chatRoomId', TokenService.validateToken, LogService.registrarAcesso, ChatRoomController.storeMensagens)
routes.post('/chatrooms', TokenService.validateToken, LogService.registrarAcesso, ChatRoomController.store)
routes.get('/search/colecoes', LogService.registrarAcesso, SearchControllers.getAnunciosCollections)
routes.get('/search', LogService.registrarAcesso, SearchControllers.getAnunciosByFiltros)

module.exports = routes;