const {Router} = require('express');
const multer = require('multer');

const authMiddleware = require('./controllers/AuthController')

const AnuncioController = require('./controllers/AnuncioController');
const SearchControllers = require('./controllers/SearchControllers');
const UserController = require('./controllers/UserController');

const routes = Router();
const multerConfig = multer();

// Metodo GET - RETORNA TODOS OS ANUNCIOS
routes.get('/anuncios', AnuncioController.index); 
// Metodo GET - RETORNA ANUNCIO DE UM UNICO USER
routes.get('/anuncioByCod_user', authMiddleware, SearchControllers.anuncioByCod_user);
// Metodo GET - RETORNA ANUNCIO PELO SEU ID
routes.get('/anuncioById', SearchControllers.anuncioById);
//metodo POST - CRIAR ANUNCIO 
routes.post('/add_anuncio', multerConfig.single('file'),authMiddleware, AnuncioController.store);

routes.post('/addUser', UserController.store);

routes.post('/auth', UserController.auth);
 

module.exports = routes;