const { Router } = require('express');
const multer = require('multer');

const TokenService = require('./services/TokenService')

const AnuncioController = require('./controllers/AnuncioController');
const SearchControllers = require('./controllers/SearchControllers');
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const LogService = require('./services/LogService');

const routes = Router();
const multerConfig = multer();

// autenticar conta de um usuario
// api auth
routes.post('/login', LogService.registrarAcesso, AuthController.auth);

// ROTA DE TESTE
// cadastrar novo usuario
// api addUser
routes.get('/users', LogService.registrarAcesso, UserController.index);

// obter um usuario (usuarioid coletado pelo token)
// api obterUsuarioByUserId
// api obterNomeUsuarioByUserId
routes.get('/users/userid', TokenService.validateToken, LogService.registrarAcesso, UserController.getUserByUserId)

// cadastrar novo usuario
// api addUser
routes.post('/users', LogService.registrarAcesso, multerConfig.single('file'), UserController.store);

// excluir um usuario (usuarioid coletado pelo token)
// api deletarUsuario
routes.delete('/users/userid', TokenService.validateToken, LogService.registrarAcesso, UserController.delete)

// alterar todos os campos de um usuario (usuarioid coletado pelo token)
// api alterarUsuarrio
routes.patch('/users/userid', TokenService.validateToken, LogService.registrarAcesso, UserController.update)

// alterar a senha de um usuario (usuarioid coletado pelo token)
// alterar a senha de um usuario (usuarioid coletado pelo token)
// api alterarSenhaByUserId
// routes.patch('/users/userid/senhauser', authMiddleware)

// obter todos os anuncios
// api anuncios
routes.get('/anuncios', LogService.registrarAcesso, SearchControllers.getAnuncios);

// obter todos os anuncio de um usuario
// api anuncioByCod_user
routes.get('/anuncios/userid', TokenService.validateToken, LogService.registrarAcesso, SearchControllers.getAnunciosByUserId);

// obter um anuncio
// api anuncioById
routes.get('/anuncios/:anuncioId', LogService.registrarAcesso, SearchControllers.getAnuncioByAnuncioId);

// cadastrar novo anuncio
// api add_anuncio
routes.post('/anuncios', multerConfig.single('file'), TokenService.validateToken, LogService.registrarAcesso, AnuncioController.store);

// excluir um anuncio
// api excluirAnuncio
routes.delete('/anuncios/:anuncioId', TokenService.validateToken, LogService.registrarAcesso)

// alterar a visibilidade de um anuncio
// alterar a foto de um anuncio
// alterar o numero de visitas de um anuncio
// alterar o numero de contatos de um anuncio
// api pausarAnuncio
// api uploadFoto
// api registraVisita
// api registraContato
routes.patch('/anuncios/:anuncioId', TokenService.validateToken, LogService.registrarAcesso, AnuncioController.update)

module.exports = routes;