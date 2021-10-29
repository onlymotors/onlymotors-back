const Anuncio = require('../models/AnuncioSchema');
const CryptoService = require('../services/CryptoService');

module.exports = {
  //função para retonar todos os anuncios
  async getAnuncios(request, response) {
    const anuncio = await Anuncio.find({ statusAnuncio: 1 }).select('-userId')
      .then((anuncio) => {
        return response.json({ anuncio });
      })
      .catch(e => {
        console.log(e.message)
        return response.send({ message: e.message })
      });
  },
  //Retorna todos os anuncios de UM USUARIO
  async getAnunciosByUserId(request, response) {
    const { userId } = request;
    const anuncio = await Anuncio.find({
      userId: {
        $in: userId
      }
    }).select('-userId').then((anuncio) => {
      if (anuncio === []) {
        console.log("Usuário não existe ou não tem anuncios criados")
        return response.json({ message: "Usuário não existe ou não tem anuncios criados" })
      }
      return response.json({ anuncio });
    })
      .catch(e => {
        console.log(e.message)
        return response.send({ message: e.message })
      });
  },
  //Retorna anuncio pelo seu id
  async getAnuncioByAnuncioId(request, response) {
    const { anuncioId } = request.params;
    const anuncio = await Anuncio.find({
      _id: {
        $in: anuncioId
      }
    }).populate('userId', '-_id apelidoUser').then((anuncio) => {
      if (anuncio === []) {
        console.log("Anúncio não existe ou não encontrado")
        return response.json({ message: "Anúncio não existe ou não encontrado" })
      }
      anuncio[0].userId.apelidoUser = CryptoService.descriptografar(anuncio[0].userId.apelidoUser)
      return response.json(anuncio);
    })
      .catch(e => {
        console.log(e.message)
        return response.send({ message: e.message })
      });
  },

  async getAnunciosCollections(request, response) {
    try {
      let string = "R$ 16.000,00"
      string = string.replace(".", "").replace(",", ".").replace(/[^\d.-]/g, "")
      console.log(Number(string))
      let marcas = await Anuncio.collection.distinct("veiculoMarca");
      let modelos = await Anuncio.collection.distinct("descricaoVeiculo");
      let colecao = await Anuncio.aggregate(
        [
          {
            "$group":
            {
              "_id":
              {
                veiculoMarca: "$veiculoMarca",
                descricaoVeiculo: "$descricaoVeiculo"
              }
            }
          }
        ]
      )
      let resCampoBusca = [].concat(marcas);
      for (let item of colecao) {
        let combinacao = item._id.veiculoMarca + " " + item._id.descricaoVeiculo
        resCampoBusca.push(combinacao)
      }
      return response.json({ marcas: marcas, modelos: modelos, resCampoBusca: resCampoBusca });
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  async getAnunciosByFiltros(request, response) {
    try {
      let { marca, modelo, ano, valorMinimo, valorMaximo } = request.body
      // ano = ano.toString()
      // console.log(typeof (ano))
      // var query = {
      //   $or: [{ veiculoMarca: { $regex: marca, $options: 'i' } },
      //   { descricaoVeiculo: { $regex: modelo, $options: 'i' } }]
      // }
      let query;
      let queryAno;
      if (valorMaximo > 0) {
        valorMaximo = valorMaximo
      } else {
        valorMaximo = 999999999999999
      }
      if (ano !== undefined && ano !== null) {
        queryAno = '/' + ano + '/.test(this.anoModelo)'
        query = {
          $and: [
            { veiculoMarca: { $regex: marca, $options: 'i' } },
            { descricaoVeiculo: { $regex: modelo, $options: 'i' } },
            { anoModelo: ano },
            { veiculoValor: { $gte: valorMinimo, $lte: valorMaximo } }
          ]
        }
      } else {
        query = {
          $and: [
            { veiculoMarca: { $regex: marca, $options: 'i' } },
            { descricaoVeiculo: { $regex: modelo, $options: 'i' } },
            { veiculoValor: { $gte: valorMinimo, $lte: valorMaximo } }
          ]
        }
      }
      // let anuncios = await Anuncio.find({ $text: { $search: "Volkswagen Gol" } })
      let anuncios = await Anuncio.find(query)
      return response.json(anuncios);
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  }
};