const { ObjectId } = require('mongodb');
const Anuncio = require('../models/AnuncioSchema');
const CryptoService = require('../services/CryptoService');

module.exports = {

  // retona todos os anúncios
  async getAnuncios(request, response) {
    try {
      let { pular, limitar, contar } = request.query
      contar = (contar === "true")
      const anuncio = await Anuncio.find({ statusAnuncio: 1 }).select('-userId').limit(Number(limitar)).skip(Number(pular))
      if (!contar) {
        return response.json({ anuncio });
      } else {
        // const numAnuncios = await Anuncio.countDocuments({ statusAnuncio: 1 })
        // const numAnuncios = await Anuncio.aggregate(
        //   [
        //     { $match: { statusAnuncio: 1 } },
        //     { $count: "anunciosPublicadosCount" }
        //   ]
        // )
        const numAnuncios = await Anuncio.estimatedDocumentCount()
        return response.json({ anuncio, numAnuncios });
      }
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  // retorna todos os anúncios de um usuário
  async getAnunciosByUserId(request, response) {
    try {
      const { userId } = request;
      let { pular, limitar, contar } = request.query
      contar = (contar === "true")
      const anuncio = await Anuncio.find({
        userId: {
          $in: userId
        }
      }).select('-userId').limit(Number(limitar)).skip(Number(pular))
      if (anuncio === []) {
        console.log("Usuário não existe ou não tem anuncios criados")
        return response.json({ message: "Usuário não existe ou não tem anuncios criados" })
      } else if (!contar) {
        return response.json({ anuncio });
      } else {
        // const numAnuncios = await Anuncio.countDocuments({
        //   userId: {
        //     $in: userId
        //   }
        // })
        // const numAnuncios = await Anuncio.aggregate(
        //   [
        //     {
        //       $match: {
        //         userId: ObjectId(userId)
        //       }
        //     },
        //     { $count: "anunciosUserIdCount" }
        //   ]
        // )
        const numAnuncios = await Anuncio.estimatedDocumentCount()
        return response.json({ anuncio, numAnuncios });
      }
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  // retorna dados de um anúncio pelo seu id
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

  // retorna marcas e modelos existentes na base de dados
  async getAnunciosCollections(request, response) {
    try {
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

  // retorna todos os anúncios filtrados por marca, modelo, ano ou valor
  async getAnunciosByFiltros(request, response) {
    try {
      let { marca, modelo, ano, valorMinimo, valorMaximo, pular, limitar, contar } = request.query
      contar = (contar === "true")
      ano = Number(ano)
      valorMinimo = Number(valorMinimo.replace(/\D/g, ""))
      valorMaximo = Number(valorMaximo.replace(/\D/g, ""))
      if (valorMaximo > 0) {
        valorMaximo = valorMaximo
      } else {
        valorMaximo = 999999999999999
      }
      let query;
      let queryAno;
      if (ano !== 0) {
        queryAno = '/' + ano + '/.test(this.anoModelo)'
        query = {
          $and:
            [
              { veiculoMarca: { $regex: marca, $options: 'i' } },
              { descricaoVeiculo: { $regex: modelo, $options: 'i' } },
              { anoModelo: ano },
              { veiculoValor: { $gte: valorMinimo, $lte: valorMaximo } },
              { statusAnuncio: 1 }
            ]
        }
      } else {
        query = {
          $and:
            [
              { veiculoMarca: { $regex: marca, $options: 'i' } },
              { descricaoVeiculo: { $regex: modelo, $options: 'i' } },
              { veiculoValor: { $gte: valorMinimo, $lte: valorMaximo } },
              { statusAnuncio: 1 }
            ]
        }
      }
      // let anuncios = await Anuncio.find({ $text: { $search: "Volkswagen Gol" } })
      let anuncios = await Anuncio.find(query).limit(Number(limitar)).skip(Number(pular))
      if (!contar) {
        return response.json({ anuncio: anuncios });
      } else {
        // let numAnuncios = await Anuncio.countDocuments(query)
        let numAnuncios = await Anuncio.estimatedDocumentCount()
        return response.json({ anuncio: anuncios, numAnuncios });
      }
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  // retorna todos os anúncios filtrados por palavras
  async getAnunciosByPalavrasBuscadas(request, response) {
    try {
      let { palavras } = request.params
      let { pular, limitar, contar } = request.query
      contar = (contar === "true")
      let listaPalavras = palavras.split(" ")
      let regex
      let query
      if (listaPalavras.length > 1) {
        regex = listaPalavras.join("|")
        query = {
          $and: [
            { veiculoMarca: { $regex: regex, $options: 'i' } },
            { descricaoVeiculo: { $regex: regex, $options: 'i' } },
          ]
        }
      } else {
        query = {
          $or: [
            { veiculoMarca: { $regex: palavras, $options: 'i' } },
            { descricaoVeiculo: { $regex: palavras, $options: 'i' } },
          ]
        }
      }
      let anuncios = await Anuncio.find(query).limit(Number(limitar)).skip(Number(pular))
      if (!contar) {
        return response.json({ anuncio: anuncios });
      } else {
        // let numAnuncios = await Anuncio.countDocuments(query)
        let numAnuncios = await Anuncio.estimatedDocumentCount()
        return response.json({ anuncio: anuncios, numAnuncios });
      }
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

};