const Log = require('../models/LogSchema');

module.exports = {

  async registrarAcesso(request, response, next) {
    await Log.create({
      rotaAcesso: request.originalUrl,
      tipoAcesso: request.method,
      dataAcesso: Date.now(),
      ipOrigem: request.headers['x-forwarded-for'] || request.socket.remoteAddress,
      ipTipo: request.socket.address().family,
      userId: request.userId,
    })
      .then(() => {
        return next()
      })
  }

}