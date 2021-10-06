const Anuncio = require('../models/AnuncioSchema');
const CryptoService = require('../services/CryptoService');

module.exports = {
  //função para retonar todos os anuncios
  async getAnuncios(request, response) {
    const anuncio = await Anuncio.find({ statusAnuncio: 1 }).select('-userId')
      .then((anuncio) => {
        return response.json({ anuncio });
      })
      .catch(e => {
        console.log(e.message)
        return response.send({ message: e.message })
      });
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
        console.log("Usuário não existe ou não tem anuncios criados")
        return response.json({ message: "Usuário não existe ou não tem anuncios criados" })
      }
      return response.json({ anuncio });
    })
      .catch(e => {
        console.log(e.message)
        return response.send({ message: e.message })
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
        console.log("Anúncio não existe ou não encontrado")
        return response.json({ message: "Anúncio não existe ou não encontrado" })
      }
      anuncio[0].userId.apelidoUser = CryptoService.descriptografar(anuncio[0].userId.apelidoUser)
      return response.json(anuncio);
    })
      .catch(e => {
        console.log(e.message)
        return response.send({ message: e.message })
      });
  }
};