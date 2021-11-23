const Anuncio = require('../models/AnuncioSchema');
const { Readable } = require('stream');
const readline = require('readline');
const { firestore } = require('firebase-admin');

module.exports = {

  /**
   * registra dados de anúncios a partir de um arquivo csv
   */
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
          veiculoValor: Number(anuncioLineSplit[5].replace(".", "").replace(",", ".").replace(/[^\d.-]/g, "")),

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
          urlImage: '',
        });
      };
      return response.send({ message: 'Anúncio(s) cadastrado(s) com sucesso!' })
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  /**
   * atualiza dados do anúncio
   */
  async update(request, response) {
    let chavesPermitidas = ["nomeFabricante", "veiculoMarca", "descricaoVeiculo", "anoFabricacao",
      "anoModelo", "veiculoValor", "statusAnuncio", "urlImage", "deletarFoto"]
    for (let property in request.body) {
      if (!chavesPermitidas.includes(property)) {
        console.log("Você não possui autorização para alterar esses dados")
        return response.json({ message: "Você não possui autorização para alterar esses dados" });
      }
    }

    // let chavesProibidas = ["dataPublicacao", "dataAlteracao", "userId"]
    // for (let index = 0; index < chavesProibidas.length; index++) {
    //   if (chavesProibidas[index] in request.body) {
    //     console.log("Você não possui autorização para alterar esses dados")
    //     return response.json({ message: "Você não possui autorização para alterar esses dados" });
    //   }
    // }

    request.body.dataAlteracao = Date.now();
    const { anuncioId } = request.params;
    const { urlImage } = request.file ? request.file : '';
    request.body.urlImage = urlImage;
    if (request.body.deletarFoto) {
      let dados = {
        dataAlteracao: request.body.dataAlteracao
      }
      await Anuncio.updateOne({ _id: anuncioId }, { dados, $unset: { urlImage: 1 } })
        .then(() => {
          return response.json({ message: `A foto foi deletada com sucesso!` });
        })
        .catch(e => {
          console.log(e.message)
          return response.json({ message: e.message });
        })
    }
    else if ("statusAnuncio" in request.body) {
      let dados = {
        statusAnuncio: request.body.statusAnuncio,
        dataAlteracao: request.body.dataAlteracao
      }
      await Anuncio.findByIdAndUpdate(anuncioId, dados)
        .then(() => {
          return response.json({ message: `O anúncio foi ${(dados.statusAnuncio) ? "republicado" : "pausado"}!` });
        })
        .catch(e => {
          console.log(e.message)
          return response.json({ message: e.message });
        })
    } else {
      await Anuncio.findByIdAndUpdate(anuncioId, request.body)
        .then(() => {
          return response.json({ message: `Alterações salvas com sucesso!` });
        })
        .catch(e => {
          console.log(e.message)
          return response.json({ message: e.message });
        })
    }
  },


  /**
   * registra contato com anunciante
   */
  async registrarContatos(request, response) {
    const { anuncioId } = request.params;
    if (request.body.contagem) {
      await Anuncio.findById(anuncioId)
        .then(anuncio => {
          anuncio.numContatos = request.body.contagem
          anuncio.save()
          return response.json({ message: `Visita registrada com sucesso!` });
        })
        .catch(e => {
          console.log(e.message)
          return response.json({ message: e.message });
        })
    } else {
      console.log("Você não possui autorização para alterar esses dados")
      return response.json({ message: "Você não possui autorização para alterar esses dados" });
    }
  },

  /**
   * registra visualizações do anúncio
   */
  async registrarVisitas(request, response) {
    const { anuncioId } = request.params;
    if (request.body.contagem) {
      await Anuncio.findById(anuncioId)
        .then(anuncio => {
          if (anuncio.numVisitas === 0) {
            anuncio.primeiraVisita = Date.now()
          }
          anuncio.numVisitas = request.body.contagem
          anuncio.save()
          return response.json({ message: `Visita registrada com sucesso!` });
        })
        .catch(e => {
          console.log(e.message)
          return response.json({ message: e.message });
        })
    } else {
      console.log("Você não possui autorização para alterar esses dados")
      return response.json({ message: "Você não possui autorização para alterar esses dados" });
    }
  },

  /**
   * exclui o anúncio
   */
  async delete(request, response) {
    const { anuncioId } = request.params;
    await Anuncio.deleteOne({ _id: anuncioId })
      .then(() => {
        return response.json({ message: `Anúncio deletado com sucesso!` });
      })
      .catch(e => {
        console.log(e.message)
        return response.json({ message: e.message });
      })
  }

}