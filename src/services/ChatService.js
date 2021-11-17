const TokenService = require('./TokenService');

module.exports = (server) => {

  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });

  const chat = io.of("/chat");

  chat.use((socket, next) => {
    let res = {
    }
    let require = {
      headers: {
        authorization: socket.handshake.query.token
      }
    }
    TokenService.validateToken(require, res, next)
    socket.userId = require.userId
  });

  chat.on('connection', socket => {

    console.log(`Connected: ${socket.id}`);

    socket.on('disconnect', () =>
      console.log(`Disconnected: ${socket.id}`));

    socket.on('join', (room) => {
      console.log(`Socket ${socket.id} joining ${room}`);
      socket.join(room);
    });

    socket.on('chat', (data) => {
      const { mensagem, room } = data;
      console.log(`msg: ${mensagem}, room: ${room}`);
      chat.to(room).emit('chat', data);
    });

  });

}

