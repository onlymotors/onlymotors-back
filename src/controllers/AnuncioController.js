const Anuncio = require('../models/AnuncioSchema');
const { Readable } = require('stream');
const readline = require('readline');

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
          veiculoValor: anuncioLineSplit[6],

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
          dataAlteracao: Date.now()
        });
      };
      return response.send({ message: 'Anúncio(s) cadastrado(s) com sucesso!' })
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  async update(request, response) {
    request.body.dataAlteracao = Date.now();
    const { anuncioId } = request.params;
    const anuncio = await Anuncio.findByIdAndUpdate(anuncioId, request.body)
    return response.json({ anuncio });
  },

  async delete(request, response) {
    const { anuncioId } = request.params;
    const anuncio = await Anuncio.deleteOne(anuncioId)
    return response.json({ anuncio });
  }

}