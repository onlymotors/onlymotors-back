const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childSchema = new Schema({
  name: String
});

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
    type: String,
    required: true,
  },
  cnpjUser: {
    type: String,
    required: true,
  },
  telefoneUser: {
    type: String,
    required: true,
  },
  enderecoUser: {
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    uf: String,
    cep: String
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
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);