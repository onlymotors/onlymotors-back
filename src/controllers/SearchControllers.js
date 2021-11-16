const Anuncio = require('../models/AnuncioSchema');
const CryptoService = require('../services/CryptoService');

module.exports = {
  //função para retonar todos os anuncios
  async getAnuncios(request, response) {
    try {
      const { pular, limitar, contar } = request.query
      console.log(request.query)
      const anuncio = await Anuncio.find({ statusAnuncio: 1 }).select('-userId').limit(Number(limitar)).skip(Number(pular))
      if (!contar) {
        return response.json({ anuncio });
      } else {
        const numAnuncios = await Anuncio.countDocuments({ statusAnuncio: 1 })
        return response.json({ anuncio, numAnuncios });
      }
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },
  //Retorna todos os anuncios de UM USUARIO
  async getAnunciosByUserId(request, response) {
    try {
      const { userId } = request;
      const { pular, limitar, contar } = request.query
      console.log(request.query)
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
        const numAnuncios = await Anuncio.countDocuments({
          userId: {
            $in: userId
          }
        })
        return response.json({ anuncio, numAnuncios });
      }
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
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
      let { marca, modelo, ano, valorMinimo, valorMaximo, pular, limitar, contar } = request.query
      console.log(request.query)
      contar = (contar === "true")
      ano = Number(ano)
      valorMinimo = Number(valorMinimo.replace(/\D/g, ""))
      valorMaximo = Number(valorMaximo.replace(/\D/g, ""))
      // console.log(valorMinimo)
      // console.log(valorMaximo)
      // let listaPalavras = palavras.split(" ")
      // let regex
      // let queryPalavras
      // if (listaPalavras.length > 1) {
      // regex = listaPalavras.join("|")
      // queryPalavras = {
      //   $and: [
      //     { veiculoMarca: { $regex: regex, $options: 'i' } },
      //     { descricaoVeiculo: { $regex: regex, $options: 'i' } },
      //   ]
      // }
      // } else {
      // queryPalavras = {
      //   $or: [
      //     { veiculoMarca: { $regex: palavras, $options: 'i' } },
      //     { descricaoVeiculo: { $regex: palavras, $options: 'i' } },
      //   ]
      // }
      // }
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
              // { queryPalavras }
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
              // { queryPalavras }
            ]
        }
      }
      // console.log(request.query)
      // console.log(query)
      // let anuncios = await Anuncio.find({ $text: { $search: "Volkswagen Gol" } })
      let anuncios = await Anuncio.find(query).limit(Number(limitar)).skip(Number(pular))
      // console.log("Res:", anuncios.length)
      if (!contar) {
        return response.json({ anuncio: anuncios });
      } else {
        let numAnuncios = await Anuncio.countDocuments(query)
        return response.json({ anuncio: anuncios, numAnuncios });
      }
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  async getAnunciosByPalavrasBuscadas(request, response) {
    try {
      let { palavras } = request.params
      let { pular, limitar, contar } = request.query
      console.log(request.query)
      contar = (contar === "true")
      console.log(contar)
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
      // console.log(request.params)
      // console.log(query)
      let anuncios = await Anuncio.find(query).limit(Number(limitar)).skip(Number(pular))
      // console.log("Res:", anuncios.length)
      if (!contar) {
        return response.json({ anuncio: anuncios });
      } else {
        let numAnuncios = await Anuncio.countDocuments(query)
        return response.json({ anuncio: anuncios, numAnuncios });
      }
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

};