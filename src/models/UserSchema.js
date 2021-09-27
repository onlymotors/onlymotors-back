const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new mongoose.Schema({
   nome_user:{
       type:String,
       required:true,
   },
   apelido_user:{
    type:String,
    required:true,
   },
   cpf_user:{
    type:Number,
   },
   cnpj_user:{
    type:Number,
   },
   email_user:{
    type:String,
    required:true,
   },
   telefone_user:{
    type:Number,
    required:true,
   },
   endereco_user:{
    type:String,
    required:true,
   },
   senha:{
       type:String,
       required:true,
       select:false,
   }
});

module.exports = mongoose.model('User', UserSchema);