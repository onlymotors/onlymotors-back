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
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*"
}));
//Usando o arquivo de rotas
app.use(routes);
//conectar ao banco de Dados
dbConnection;

//Configuração específicas para o chat
// const path = require('path');
const server = require('http').createServer(app);
// const io = require('socket.io')(server);
ChatService(server);

//doc swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Retorna imagens armazenadas
app.use('/images', express.static('./src/assets/images'));

//Retornas download armazenados
app.use('/download', express.static('./src/assets/download'));

//Estático do chat
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(__dirname, 'public'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

//View do chat
// app.use('/', (req, res) => {
//   res.render('index.html')
// });

//Servidor ouvindo a porta 3333 ->  http://localhost:3333
server.listen(3333, () => console.log('Servidor rodando na porta 3333'));