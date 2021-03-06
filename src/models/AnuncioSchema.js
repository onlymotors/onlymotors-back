const mongoose = require('mongoose');

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
    type: Number,
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
  primeiraVisita: {
    type: Date,
  },
  numContatos: {
    type: Number,
    required: true
  },
  primeiroContato: {
    type: Date,
  },
  urlImage: {
    type: String,
  },
  dataPublicacao: {
    type: Date
  },
  dataAlteracao: {
    type: Date
  }
});

module.exports = mongoose.model('Anuncio', AnuncioSchema);