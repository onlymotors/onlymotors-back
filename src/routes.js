const { Router } = require('express');
const multer = require('multer');

const authMiddleware = require('./controllers/AuthController')

const AnuncioController = require('./controllers/AnuncioController');
const SearchControllers = require('./controllers/SearchControllers');
const UserController = require('./controllers/UserController');

const routes = Router();
const multerConfig = multer();

// obter todos os anuncios
// api anuncios
routes.get('/anuncios', AnuncioController.index);

// obter todos os anuncio de um usuario
// api anuncioByCod_user
routes.get('/anuncios/userid', authMiddleware, SearchControllers.anunciosByUserId);

// obter um anuncio
// api anuncioById
routes.get('/anuncios/:anuncioId', SearchControllers.anunciosByAnuncioId);

// cadastrar novo anuncio
// api add_anuncio
routes.post('/anuncios', multerConfig.single('file'), authMiddleware, AnuncioController.store);

// cadastrar novo usuario
// api addUser
routes.post('/users', UserController.store);

// autenticar conta de um usuario
// api auth
routes.post('/login', UserController.auth);

// obter um usuario (usuarioid coletado pelo token)
// api obterUsuarioByUserId
routes.get('/users/userid', authMiddleware, UserController.getUserByUserId)

// obter nome de um usuario (usuarioid coletado pelo token)
// api obterNomeUsuarioByUserId
routes.get('users/userid/nomeuser', authMiddleware)

// excluir um usuario (usuarioid coletado pelo token)
// api deletarUsuario
routes.delete('users/userid', authMiddleware)

// alterar todos os campos de um usuario (usuarioid coletado pelo token)
// api alterarUsuarrio
routes.patch('users/userid', authMiddleware)

// alterar a senha de um usuario (usuarioid coletado pelo token)
// api alterarSenhaByUserId
routes.patch('users/userid/senhauser', authMiddleware)

// excluir um anuncio
// api excluirAnuncio
routes.delete('anuncios/:anuncioId', authMiddleware)

// alterar a visibilidade de um anuncio
// api pausarAnuncio
routes.patch('anuncios/:anuncioId/statusanuncio', authMiddleware)

// alterar a foto de um anuncio
// api uploadFoto 
routes.patch('anuncios/:anuncioId/fotoanuncio', authMiddleware)

// alterar o numero de visitas de um anuncio
// api registraVisita
routes.patch('anuncios/:anuncioId/numvisita')

// alterar o numero de contatos de um anuncio
// api registraContato
routes.patch('anuncios/:anuncioId/numcontato')

module.exports = routes;