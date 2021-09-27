const Anuncio = require('../models/AnuncioSchema');
const { Readable } = require('stream');
const readline = require('readline');

module.exports = {
  //função para retonar todos os anuncios
  async index(request, response) {
    const anuncio = await Anuncio.find().populate('userId');
    return response.json({ anuncio });
  },
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
          cpfVeiculo: Number(anuncioLineSplit[5]),
          cnpjVeiculo: Number(anuncioLineSplit[6]),
          veiculoValor: anuncioLineSplit[7],

        });
      };

      for await (let {
        nomeFabricante,
        veiculoMarca,
        descricaoVeiculo,
        anoFabricacao,
        anoModelo,
        cpfVeiculo,
        cnpjVeiculo,
        veiculoValor,
      } of anuncioArray) {

        await Anuncio.create({
          nomeFabricante,
          veiculoMarca,
          descricaoVeiculo,
          anoFabricacao,
          anoModelo,
          cpfVeiculo,
          cnpjVeiculo,
          veiculoValor,
          userId: request.userId
        });
      };
      return response.send({ message: 'Anúncio(s) cadastrado(s) com sucesso!' })
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  }
}