const Anuncio = require('../models/AnuncioSchema');


module.exports = {
  //função para retonar todos os anuncios
  async getAnuncios(request, response) {
    const anuncio = await Anuncio.find().populate('userId','apelidoUser');
    return response.json({ anuncio });
  },
  //Retorna todos os anuncios de UM USUARIO
  async getAnunciosByUserId(request, response) {
    const { userId } = request;
    const anuncio = await Anuncio.find({
      userId: {
        $in: userId
      }
    }).then((anuncio) => {
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
    }).populate('userId','apelidoUser').then((anuncio) => {
      if (anuncio === []) {
        return response.json({ message: "Anúncio não existe ou não encontrado" })
      }
      return response.json(anuncio);
    })
      .catch((err) => {
        return response.send(err)
      });
  }
};