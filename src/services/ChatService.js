const TokenService = require('./TokenService');
// const jwt = require('jsonwebtoken');

// let clientSocketIds = [];
// let connectedUsers = [];

// const getSocketByUserId = (userId) => {
//   let socket = '';
//   for (let i = 0; i < clientSocketIds.length; i++) {
//     if (clientSocketIds[i].userId == userId) {
//       socket = clientSocketIds[i].socket;
//       break;
//     }
//   }
//   return socket;
// }


module.exports = (server) => {

  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });
  /* socket function starts */
  const chat = io.of("/chat");



  chat.use((socket, next) => {

    let res = {

    }
    // let require = {
    //   headers: {
    //     authorization: socket.handshake.headers.authorization
    //   }
    // }
    let require = {
      headers: {
        authorization: socket.handshake.query.token
      }
    }

    TokenService.validateToken(require, res, next)
    socket.userId = require.userId

    // next()
  });

  // io.of("/chat").adapter.on("join-room", (room, id) => {
  // console.log(`usuario: ${id} entrou na room: ${room}`);
  // });
  // io.of("/chat").adapter.on("leave-room", (room, id) => {
  // console.log(`usuario: ${id} deixou a room: ${room}`);
  // });


  chat.on('connection', socket => {
    // let socketRoom;

    console.log(`Connected: ${socket.id}`);
    socket.on('disconnect', () =>
      console.log(`Disconnected: ${socket.id}`));
    socket.on('join', (room) => {
      console.log(`Socket ${socket.id} joining ${room}`);
      socket.join(room);
      // socketRoom = room;
    });
    socket.on('chat', (data) => {
      // console.log(data)
      const { mensagem, room } = data;
      console.log(`msg: ${mensagem}, room: ${room}`);
      chat.to(room).emit('chat', data);
    });


  });

  /* socket function ends */
}

