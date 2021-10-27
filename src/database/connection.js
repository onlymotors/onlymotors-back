const mongoose = require("mongoose");

//mongoDB connect

const dbConnection =
  mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
      console.log('Banco conectado com sucesso');
    })
    .catch(() => {
      console.log('Não foi possível conectar-se');
    })

module.exports = dbConnection;