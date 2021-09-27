const Anuncio = require('../models/AnuncioSchema');


module.exports = {
  //Retorna todos os anuncios de UM USUARIO
  async anunciosByUserId(request, response) {
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
  async anunciosByAnuncioId(request, response) {
    const { anuncioId } = request.params;
    const anuncio = await Anuncio.find({
      _id: {
        $in: anuncioId
      }
    }).populate('userId').then((anuncio) => {
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