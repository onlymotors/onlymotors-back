const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new mongoose.Schema({
   nomeUser:{
       type:String,
       required:true,
   },
   apelidoUser:{
    type:String,
    required:true,
   },
   cpfUser:{
    type:Number,
   },
   cnpjUser:{
    type:Number,
   },
   emailUser:{
    type:String,
    required:true,
   },
   telefoneUser:{
    type:Number,
    required:true,
   },
   enderecoUser:{
    type:String,
    required:true,
   },
   senhaUser:{
       type:String,
       required:true,
       select:false,
   }
});

module.exports = mongoose.model('User', UserSchema);