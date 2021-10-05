const Anuncio = require('../models/AnuncioSchema');
const { Readable } = require('stream');
const readline = require('readline');
const { firestore } = require('firebase-admin');

module.exports = {

  //função para ler o arquivo csv e salvar no Banco
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
          nomeFabricante: anuncioLineSplit[0],
          veiculoMarca: anuncioLineSplit[1],
          descricaoVeiculo: anuncioLineSplit[2],
          anoFabricacao: Number(anuncioLineSplit[3]),
          anoModelo: Number(anuncioLineSplit[4]),
          veiculoValor: anuncioLineSplit[5],

        });
      };

      for await (let {
        nomeFabricante,
        veiculoMarca,
        descricaoVeiculo,
        anoFabricacao,
        anoModelo,
        veiculoValor,
      } of anuncioArray) {

        await Anuncio.create({
          nomeFabricante,
          veiculoMarca,
          descricaoVeiculo,
          anoFabricacao,
          anoModelo,
          veiculoValor,
          userId: request.userId,
          statusAnuncio: 1,
          numVisitas: 0,
          numContatos: 0,
          dataPublicacao: Date.now(),
          dataAlteracao: Date.now(),
          urlImage:'',
        });
      };
      return response.send({ message: 'Anúncio(s) cadastrado(s) com sucesso!' })
    } catch (e) {
      return response.send({ message: e.message })
    }
  },

  async update(request, response) {
    let chavesProibidas = ["dataPublicacao", "dataAlteracao", "userId"]
    for (let index = 0; index < chavesProibidas.length; index++) {
      if (chavesProibidas[index] in request.body)
        return response.json({ message: "Você não possui autorização para alterar esses dados" });
    }

    request.body.dataAlteracao = Date.now();
    const { anuncioId } = request.params;
    const {urlImage} = request.file ? request.file : '';
    request.body.urlImage = urlImage;
    if ("statusAnuncio" in request.body) {
      let dados = {
        statusAnuncio: request.body.statusAnuncio,
        dataAlteracao: request.body.dataAlteracao
      }
      await Anuncio.findByIdAndUpdate(anuncioId, dados)
        .then(() => {
          return response.json({ message: `O anúncio foi ${(dados.statusAnuncio) ? "republicado" : "pausado"}!` });
        })
        .catch(e => {
          return response.json({ message: e.message });
        })
    } else {
      await Anuncio.findByIdAndUpdate(anuncioId, request.body)
        .then(() => {
          return response.json({ message: `Alterações salvas com sucesso!` });
        })
        .catch(e => {
          return response.json({ message: e.message });
        })
    }
  },

  async registrarContatos(request, response) {
    const { anuncioId } = request.params;
    if (request.body.contagem) {
      request.body.numContatos = request.body.contagem
      await Anuncio.findByIdAndUpdate(anuncioId, request.body)
        .then(() => {
          return response.json({ message: `Visita registrada com sucesso!` });
        })
        .catch(e => {
          return response.json({ message: e.message });
        })
    } else {
      return response.json({ message: "Você não possui autorização para alterar esses dados" });
    }
  },

  async registrarVisitas(request, response) {
    const { anuncioId } = request.params;
    if (request.body.contagem) {
      request.body.numVisitas = request.body.contagem
      await Anuncio.findByIdAndUpdate(anuncioId, request.body)
        .then(() => {
          return response.json({ message: `Visita registrada com sucesso!` });
        })
        .catch(e => {
          return response.json({ message: e.message });
        })
    } else {
      return response.json({ message: "Você não possui autorização para alterar esses dados" });
    }
  },

  async delete(request, response) {
    const { anuncioId } = request.params;
    await Anuncio.deleteOne({ _id: anuncioId })
      .then((anuncio) => {
        return response.json({ message: `Anúncio deletado com sucesso!` });
      })
      .catch(e => {
        return response.json({ message: e.message });
      })
  }

}