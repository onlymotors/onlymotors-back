const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json');
const TokenService = require('../services/TokenService');
const User = require('../models/UserSchema');

module.exports = {

  async auth(request, response) {
    const { emailUser, senhaUser } = request.body;
    const user = await User.findOne({ emailUser }).select('+senhaUser');
    if (!user) {
      console.log("Nenhum usuário encontrado")
      return response.status(401).send({ error: 'Nenhum usuário encontrado' })
    }
    if (senhaUser != user.senhaUser) {
      console.log("Senha invalida")
      return response.status(401).send({ error: 'Senha invalida' });
    }
    user.senha = undefined;

    response.send({
      statusCadastro: user.statusCadastro,
      dataCadastro: user.dataCadastro.toLocaleString(),
      token: TokenService.generateToken({ userId: user.id })
    });
  }

};