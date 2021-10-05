const Anuncio = require('../models/AnuncioSchema');
const CryptoService = require('../services/CryptoService');

module.exports = {
  //função para retonar todos os anuncios
  async getAnuncios(request, response) {
    const anuncio = await Anuncio.find({ statusAnuncio: 1 }).select('-userId');
    return response.json({ anuncio });
  },
  //Retorna todos os anuncios de UM USUARIO
  async getAnunciosByUserId(request, response) {
    const { userId } = request;
    const anuncio = await Anuncio.find({
      userId: {
        $in: userId
      }
    }).select('-userId').then((anuncio) => {
      if (anuncio === []) {
        return response.json({ message: "Usuário não existe ou não tem anuncios criados" })
      }
      return response.json({ anuncio });
    })
      .catch((err) => {
        return response.send(err)
      });
  },
  //Retorna anuncio pelo seu id
  async getAnuncioByAnuncioId(request, response) {
    const { anuncioId } = request.params;
    const anuncio = await Anuncio.find({
      _id: {
        $in: anuncioId
      }
    }).populate('userId', '-_id apelidoUser').then((anuncio) => {
      if (anuncio === []) {
        return response.json({ message: "Anúncio não existe ou não encontrado" })
      }
      anuncio[0].userId.apelidoUser = CryptoService.descriptografar(anuncio[0].userId.apelidoUser)
      return response.json(anuncio);
    })
      .catch((err) => {
        return response.send(err)
      });
  }
};