const User = require('../models/UserSchema');
const { Readable } = require('stream');
const readline = require('readline');
const MascararDados = require('../services/MascararDados');
const GeradorSenhas = require('../services/GeradorSenhas');
const Anuncio = require('../models/AnuncioSchema');
const MailerService = require('../services/MailerService');
const { gerarSenha } = require('../services/GeradorSenhas');

module.exports = {

  async store(request, response) {
    try {
      const { file } = request;
      const { buffer } = file;

      const readbleFile = new Readable();
      readbleFile.push(buffer);
      readbleFile.push(null);

      const anuncioLine = readline.createInterface({
        input: readbleFile
      });

      const anuncioArray = [];

      for await (let line of anuncioLine) {
        const anuncioLineSplit = line.split(';');
        anuncioArray.push({
          nomeUser: anuncioLineSplit[0],
          apelidoUser: anuncioLineSplit[1],
          cpfUser: Number(anuncioLineSplit[2]),
          cnpjUser: Number(anuncioLineSplit[3]),
          telefoneUser: Number(anuncioLineSplit[4]),
          emailUser: anuncioLineSplit[5]

        });
      };

      for await (let {
        nomeUser,
        apelidoUser,
        cpfUser,
        cnpjUser,
        telefoneUser,
        emailUser
      } of anuncioArray) {
        let senha = GeradorSenhas.gerarSenha()
        var user = await User.create({
          nomeUser,
          apelidoUser,
          cpfUser,
          cnpjUser,
          telefoneUser,
          emailUser,
          senhaUser: senha,
          statusCadastro: false,
          dataCadastro: Date.now(),
          dataAlteracao: Date.now()
        });
        MailerService.sendMail({ user: nomeUser, email: emailUser, senha: senha })
      };
      return response.send({ message: 'Senha enviada ao email cadastrado!' });
    } catch (e) {
      return response.send({ message: e.message })
    }
  },

  async update(request, response) {
    let chavesProibidas = ["_id", "nomeUser", "apelidoUser", "cpfUser", "cnpjUser",
      "dataCadastro", "dataAlteracao", "statusCadastro", "__v"]
    for (let index = 0; index < chavesProibidas.length; index++) {
      if (chavesProibidas[index] in request.body)
        return response.json({ message: "Você não possui autorização para alterar esses dados" });
    }
    request.body.dataAlteracao = Date.now();
    if (request.body.enderecoUser && request.body.senhaNova)
      request.body.statusCadastro = true
    const { userId } = request;
    if (request.body.senhaNova) {
      await User.findOne({ _id: userId, senhaUser: request.body.senhaAtual })
        .then(res => {
          request.body.senhaUser = request.body.senhaNova
          delete request.body.senhaNova
        })
        .catch(e => {
          return response.json({ message: e.message });
        })
    }
    await User.findByIdAndUpdate(userId, request.body)
      .then(res => {
        return response.json({ message: "Alterações salvas com sucesso!" });
      })
      .catch(e => {
        return response.json({ message: e.message });
      })
  },

  async getUserByUserId(request, response) {
    const { userId } = request;
    const user = await User.find({
      _id: {
        $in: userId
      }
    }).then((user) => {
      if (user === []) {
        return response.json({ message: "Usuário não existe ou não encontrado" })
      }
      let usuario = [
        {
          nomeUser: user[0].nomeUser,
          apelidoUser: user[0].apelidoUser,
          emailUser: user[0].emailUser,
          enderecoUser: user[0].enderecoUser,
          statusCadastro: user[0].statusCadastro,
        }
      ]
      usuario[0].cnpjUser = MascararDados.tratarCnpj(user[0].cnpjUser);
      usuario[0].cpfUser = MascararDados.tratarCpf(user[0].cpfUser);
      usuario[0].telefoneUser = MascararDados.tratarTelefone(user[0].telefoneUser);
      return response.json(usuario);
    })
      .catch((err) => {
        return response.send(err)
      });
  },

  async index(request, response) {
    await User.find().select('+senhaUser')
      .then((user) => {
        return response.json(user);
      })
  },

  async delete(request, response) {
    const { userId } = request;
    let anuncios;
    await Anuncio.deleteMany({ userId: userId })
      .then((anuncio) => {
        anuncios = anuncio
      })
    await User.deleteOne({ _id: userId })
      .then((user) => {
        return response.json({ message: `Usuário e ${anuncios.deletedCount} anúncio(s) deletado(s) com sucesso!` });
      })
      .catch(e => {
        return response.json({ message: e.message });
      })
  }

}