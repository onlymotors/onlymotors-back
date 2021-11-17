const User = require('../models/UserSchema');
const ChatRoom = require('../models/ChatRoomSchema');
const { Readable } = require('stream');
const readline = require('readline');
const MascararDados = require('../services/MascararDados');
const GeradorSenhas = require('../services/GeradorSenhas');
const Anuncio = require('../models/AnuncioSchema');
const MailerService = require('../services/MailerService');
const CryptoService = require('../services/CryptoService');
const { gerarString } = require('../services/GeradorSenhas');
const { getAnuncios } = require('./SearchControllers');

module.exports = {

  /**
   * cria uma nova sala de chat
   */
  async store(request, response) {
    try {
      const { userId } = request;

      let anuncio = await Anuncio.findOne({ _id: request.body.anuncioId })
      let anuncioUserId = anuncio.userId._id.toString()

      if (userId === anuncioUserId) {

        return response.status(400).json({ message: "Você não pode abrir um chat com você mesmo!" });
      } else {
        let res = await User.findById(userId).populate({
          path: 'chatRooms',
          populate: {
            path: 'anuncioId',
            select: 'urlImage'
          }
        });
        let found;
        if (res.chatRooms.length) {
          let lista = res.chatRooms
          found = lista.find(item => (item.anuncioId._id.toString() === request.body.anuncioId))
        }
        if (found) {
          return response.json({ chatRoomId: found._id })
        }
        else {
          let chatroom = await ChatRoom.create({
            nomeChatRoom: request.body.nomeChatRoom,
            anuncioId: request.body.anuncioId,
          })

          let usuarioCriador = await User.findOne({ _id: userId })
          usuarioCriador.chatRooms.push(chatroom._id);
          usuarioCriador.save();

          let usuarioAnuncio = await User.findOne({ _id: anuncioUserId })
          usuarioAnuncio.chatRooms.push(chatroom._id)
          usuarioAnuncio.save();

          anuncio.numContatos = anuncio.numContatos + 1
          anuncio.save();

          return response.json({
            message: "Sala de Chat criada com sucesso!",
            chatRoomId: chatroom._id
          });
        }
      }
    } catch (e) {
      console.log(e.message)
      return response.json({ message: e.message });
    }
  },

  /**
   * retorna todas as salas de chat que o usuário ingressou
   */
  async getChatRoomsByUserId(request, response) {
    try {
      const { userId } = request;
      let chatRooms = await User.findById(userId).populate({
        path: 'chatRooms',
        populate: {
          path: 'anuncioId',
          select: 'urlImage'
        }
      });
      for ([index, chatRoom] of chatRooms.chatRooms.entries()) {
        if (chatRoom.mensagens.length) {
          const lastItemIndex = chatRooms.chatRooms[index].mensagens.length - 1;
          chatRooms.chatRooms[index].mensagens = chatRooms.chatRooms[index].mensagens[lastItemIndex]
        }
      };
      return response.json(chatRooms.chatRooms);
    }
    catch (e) {
      console.log(e.message)
      return response.json({ message: e.message });
    }
  },

  /**
   * retorna dados de uma sala de chat pelo seu id
   */
  async getChatRoomByChatRoomId(request, response) {
    try {
      const { userId } = request;
      const { chatRoomId } = request.params;
      let user = await User.findById(userId)
      let chatRoom = await ChatRoom.findById(chatRoomId).populate({
        path: 'anuncioId',
        populate: {
          path: 'userId',
          select: 'nomeUser'
        }
      });
      chatRoom.anuncioId.userId.nomeUser = CryptoService.descriptografar(chatRoom.anuncioId.userId.nomeUser)
      return response.json({ chatRoom: chatRoom, nomeAnunciante: chatRoom.anuncioId.userId.nomeUser, emailUser: user.emailUser, nomeUser: CryptoService.descriptografar(user.nomeUser) });
    }
    catch (e) {
      console.log(e.message)
      return response.json({ message: e.message });
    }
  },

  /**
   * armazena mensagens de uma sala de chat
   */
  async storeMensagens(request, response) {
    try {
      const { chatRoomId } = request.params;
      let chatRoom = await ChatRoom.findOne({ _id: chatRoomId });
      chatRoom.mensagens.push(request.body);
      chatRoom.save();
      return response.json(chatRoom);
    }
    catch (e) {
      console.log(e.message)
      return response.json({ message: e.message });
    }
  },

}