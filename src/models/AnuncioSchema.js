const mongoose = require('mongoose');

//Modelo Doc ANUNCIANTE
const AnuncioSchema = new mongoose.Schema({
  nomeFabricante: {
    type: String,
    required: true
  },
  veiculoMarca: {
    type: String,
    required: true
  },
  descricaoVeiculo: {
    type: String,
    required: true
  },
  anoFabricacao: {
    type: Number,
    required: true
  },
  anoModelo: {
    type: Number,
    required: true
  },
  veiculoValor: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  statusAnuncio: {
    type: Number,
    required: true
  },
  numVisitas: {
    type: Number,
    required: true
  },
  numContatos: {
    type: Number,
    required: true
  },
  dataPublicacao: {
    type: Date
  },
  dataAlteracao: {
    type: Date
  }
});
//Exportando Modulo
module.exports = mongoose.model('Anuncio', AnuncioSchema);