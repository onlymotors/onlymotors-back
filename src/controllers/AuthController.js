const TokenService = require('../services/TokenService');
const User = require('../models/UserSchema');
const CryptoService = require('../services/CryptoService');

module.exports = {

  /**
   * autentica usuário
   */
  async auth(request, response) {
    const { emailUser, senhaUser } = request.body;
    const user = await User.findOne({ emailUser }).select('+senhaUser');
    if (!user) {
      console.log("Nenhum usuário encontrado")
      return response.status(401).send({ error: 'Nenhum usuário encontrado' })
    }
    if (senhaUser != CryptoService.descriptografar(user.senhaUser)) {
      console.log("Senha invalida")
      return response.status(401).send({ error: 'Senha invalida' });
    }
    user.senha = undefined;

    const termo = process.env.TERMO
    const privacidade = process.env.PRIVACIDADE
    let termosAceitos;
    if (!user.termos.includes(termo) || !user.termos.includes(privacidade))
      termosAceitos = false
    else
      termosAceitos = true

    response.send({
      statusCadastro: user.statusCadastro,
      termosAceitos: termosAceitos,
      dataCadastro: user.dataCadastro.toLocaleString(),
      token: TokenService.generateToken({ userId: user.id })
    });
  }

};