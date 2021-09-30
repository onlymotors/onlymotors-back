const User = require('../models/UserSchema');
const { Readable } = require('stream');
const readline = require('readline');
const MascarDados = require('../services/MascararDados');
const GeradorSenhas = require('../services/GeradorSenhas');
const Anuncio = require('../models/AnuncioSchema');
const { sendPasswordEmail } = require('../services/mailer');
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
        let gerarSenhas = GeradorSenhas.gerarSenha()
        var user = await User.create({
          nomeUser,
          apelidoUser,
          cpfUser,
          cnpjUser,
          telefoneUser,
          emailUser,
          senhaUser: gerarSenhas,
          statusCadastro: 0,
          dataCadastro: Date.now(),
          dataAlteracao: Date.now()
        });
      };
      sendPasswordEmail({user: user.nomeUser, email: user.emailUser, senha: user.senhaUser})
      .then(()=>{
        return response.send({message:'Mensagem enviada ao email cadastrado !'});
      }).catch((err) => {
        return response.send({message:`Erro ao enviar o email ${err}`});
      })
      return console.log({message:'Usuário cadastrado(a) com sucesso !'});ws3
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  async update(request, response) {
    request.body.dataAlteracao = Date.now();
    const { userId } = request;
    const user = await User.findByIdAndUpdate(userId, request.body)
    return response.json({ user });
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
        }
      ]
      usuario[0].cnpjUser = MascarDados.tratarCnpj(user[0].cnpjUser);
      usuario[0].cpfUser = MascarDados.tratarCpf(user[0].cpfUser);
      usuario[0].telefoneUser = MascarDados.tratarTelefone(user[0].telefoneUser);
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
    await Anuncio.deleteMany({ userId: userId})
      .then((anuncio) => {
        anuncios = anuncio
      })
    await User.deleteOne({ _id: userId})
      .then((user) => {
        return response.json({ user, anuncios });
      })
  }

}