const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new mongoose.Schema({
  nomeUser: {
    type: String,
    required: true,
  },
  apelidoUser: {
    type: String,
    required: true,
  },
  cpfUser: {
    type: Number,
    required: true,
  },
  cnpjUser: {
    type: Number,
    required: true,
  },
  telefoneUser: {
    type: Number,
    required: true,
  },
  enderecoUser: {
    type: String,
    required: false,
  },
  emailUser: {
    type: String,
    required: true,
  },
  senhaUser: {
    type: String,
    required: true,
    select: false,
  },
  dataCadastro: {
    type: Date
  },
  dataAlteracao: {
    type: Date
  },
  statusCadastro: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('User', UserSchema);