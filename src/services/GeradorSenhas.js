const Crypto = require('crypto')

module.exports = {

  gerarSenha() {
    return Crypto
      .randomBytes(10)
      .toString('base64')
      .slice(0, 10)
  }

}