const mongoose = require('mongoose');

//Modelo Doc ANUNCIANTE
const AnuncioSchema = new mongoose.Schema({
    nome_fabricante: {
        type: String,
        required: true
    },
    veiculo_marca: {
        type: String,
        required: true
    },
    descricao_veiculo: {
        type: String,
        required: true
    },
    ano_fabricacao: {
        type: Number,
        required: true
    },
    ano_modelo: {
        type: Number,
        required: true
    },
    veiculo_valor: {
        type: String,
        required: true
    },
    data_publicacao: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
});
//Exportando Modulo
module.exports = mongoose.model('Anuncio', AnuncioSchema);