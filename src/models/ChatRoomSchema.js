const mongoose = require('mongoose');

const mensagens = new mongoose.Schema({
  nomeUser: String,
  emailUser: String,
  mensagem: String,
  mensagemData: String,
});

const ChatRoomSchema = new mongoose.Schema({
  nomeChatRoom: {
    type: String,
    required: true
  },
  anuncioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anuncio',
    required: true
  },
  mensagens: [mensagens]
});

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);