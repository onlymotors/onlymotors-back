const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  rotaAcesso: {
    type: String,
    required: true
  },
  tipoAcesso: {
    type: String,
    required: true
  },
  dataAcesso: {
    type: Date
  },
  ipOrigem: {
    type: String,
    required: true
  },
  ipTipo: {
    type: String,
    required: true
  },
  userId: {
    type: String
  },
});

module.exports = mongoose.model('Log', LogSchema);