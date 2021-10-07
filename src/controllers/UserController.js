const User = require('../models/UserSchema');
const { Readable } = require('stream');
const readline = require('readline');
const MascararDados = require('../services/MascararDados');
const GeradorSenhas = require('../services/GeradorSenhas');
const Anuncio = require('../models/AnuncioSchema');
const MailerService = require('../services/MailerService');
const CryptoService = require('../services/CryptoService');

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
          cpfUser: anuncioLineSplit[2],
          cnpjUser: anuncioLineSplit[3],
          telefoneUser: anuncioLineSplit[4],
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
          nomeUser: CryptoService.criptografar(nomeUser),
          apelidoUser: CryptoService.criptografar(apelidoUser),
          cpfUser: CryptoService.criptografar(cpfUser),
          cnpjUser: CryptoService.criptografar(cnpjUser),
          telefoneUser: CryptoService.criptografar(telefoneUser),
          emailUser: emailUser,
          senhaUser: CryptoService.criptografar(senha),
          statusCadastro: false,
          dataCadastro: Date.now(),
          dataAlteracao: Date.now()
        });
        MailerService.sendMail({ user: nomeUser, email: emailUser, senha: senha })
      };
      return response.send({ message: 'Senha(s) enviada(s) ao e-mail(s) cadastrado(s)!' });
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  async update(request, response) {
    let chavesPermitidas = ["telefoneUser", "enderecoUser", "senhaNova", "senhaAtual"]
    for (let property in request.body) {
      if (!chavesPermitidas.includes(property)) {
        console.log("Você não possui autorização para alterar esses dados")
        return response.json({ message: "Você não possui autorização para alterar esses dados" });
      }
    }

    // let chavesProibidas = ["_id", "nomeUser", "apelidoUser", "cpfUser", "cnpjUser",
    //   "dataCadastro", "dataAlteracao", "statusCadastro", "__v"]
    // for (let index = 0; index < chavesProibidas.length; index++) {
    //   if (chavesProibidas[index] in request.body) {
    //     console.log("Você não possui autorização para alterar esses dados")
    //     return response.json({ message: "Você não possui autorização para alterar esses dados" });
    //   }
    // }

    request.body.dataAlteracao = Date.now();
    if (request.body.enderecoUser && request.body.senhaNova)
      request.body.statusCadastro = true
    const { userId } = request;
    if (request.body.senhaNova) {
      await User.findOne({ _id: userId, senhaUser: CryptoService.criptografar(request.body.senhaAtual) })
        .then(() => {
          request.body.senhaUser = CryptoService.criptografar(request.body.senhaNova)
          delete request.body.senhaNova
        })
        .catch(e => {
          console.log(e.message)
          return response.json({ message: e.message });
        })
    }
    if (request.body.enderecoUser) {
      request.body.enderecoUser.logradouro = CryptoService.criptografar(request.body.enderecoUser.logradouro)
      request.body.enderecoUser.numero = CryptoService.criptografar(request.body.enderecoUser.numero)
      request.body.enderecoUser.complemento = CryptoService.criptografar(request.body.enderecoUser.complemento)
      request.body.enderecoUser.bairro = CryptoService.criptografar(request.body.enderecoUser.bairro)
      request.body.enderecoUser.cidade = CryptoService.criptografar(request.body.enderecoUser.cidade)
      request.body.enderecoUser.uf = CryptoService.criptografar(request.body.enderecoUser.uf)
      request.body.enderecoUser.cep = CryptoService.criptografar(request.body.enderecoUser.cep)
    }
    if (request.body.telefoneUser) {
      request.body.telefoneUser = CryptoService.criptografar(request.body.telefoneUser)
    }
    await User.findByIdAndUpdate(userId, request.body)
      .then(() => {
        return response.json({ message: "Alterações salvas com sucesso!" });
      })
      .catch(e => {
        console.log(e.message)
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
        console.log("Usuário não existe ou não encontrado")
        return response.json({ message: "Usuário não existe ou não encontrado" })
      }
      let endereco = {}
      if (!Object.values(user[0].enderecoUser).every(x => x === null || x === '' || x === undefined)) {
        endereco = {
          logradouro: CryptoService.descriptografar(user[0].enderecoUser.logradouro),
          numero: CryptoService.descriptografar(user[0].enderecoUser.numero),
          complemento: CryptoService.descriptografar(user[0].enderecoUser.complemento),
          bairro: CryptoService.descriptografar(user[0].enderecoUser.bairro),
          cidade: CryptoService.descriptografar(user[0].enderecoUser.cidade),
          uf: CryptoService.descriptografar(user[0].enderecoUser.uf),
          cep: CryptoService.descriptografar(user[0].enderecoUser.cep)
        }
      }
      let usuario = [
        {
          nomeUser: CryptoService.descriptografar(user[0].nomeUser),
          apelidoUser: CryptoService.descriptografar(user[0].apelidoUser),
          emailUser: user[0].emailUser,
          enderecoUser: endereco,
          statusCadastro: user[0].statusCadastro,
        }
      ]
      usuario[0].cnpjUser = MascararDados.tratarCnpj(CryptoService.descriptografar(user[0].cnpjUser));
      usuario[0].cpfUser = MascararDados.tratarCpf(CryptoService.descriptografar(user[0].cpfUser));
      usuario[0].telefoneUser = MascararDados.tratarTelefone(CryptoService.descriptografar(user[0].telefoneUser));
      return response.json(usuario);
    })
      .catch(e => {
        console.log(e.message)
        return response.send({ message: e.message })
      });
  },

  async index(request, response) {
    await User.find().select('+senhaUser')
      .then((user) => {
        return response.json(user);
      })
      .catch(e => {
        console.log(e.message)
        return response.json({ message: e.message });
      })
  },

  async delete(request, response) {
    const { userId } = request;
    const anuncios = await Anuncio.deleteMany({ userId: userId })
    await User.deleteOne({ _id: userId })
      .then(() => {
        return response.json({ message: `Usuário e ${anuncios.deletedCount} anúncio(s) deletado(s) com sucesso!` });
      })
      .catch(e => {
        console.log(e.message)
        return response.json({ message: e.message });
      })
  }

}