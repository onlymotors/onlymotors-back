require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnection = require('./database/connection');
const routes = require('./routes');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../src/swagger.json');
const ChatService = require('./services/ChatService');

//Express usando JSON como comunicação 
app.use(express.json());

//Configuração para aceitar aninhados de objetos JSON
app.use(express.urlencoded({ extended: true }));

//Configuração de troca de recursos
app.use(cors({
  origin: "*"
}));

//Usando o arquivo de rotas
app.use(routes);

//Conectar ao banco de Dados
dbConnection;

//Configuração específicas para o chat
const server = require('http').createServer(app);
ChatService(server);

//Doc swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Retorna imagens armazenadas
app.use('/images', express.static('./src/assets/images'));

//Retornas download armazenados
app.use('/download', express.static('./src/assets/download'));

//Servidor ouvindo a porta 3333 ->  http://localhost:3333
server.listen(3333, () => console.log('Servidor rodando na porta 3333'));