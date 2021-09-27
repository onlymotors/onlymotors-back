const User = require('../models/UserSchema');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json')

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400,       
    })
}

module.exports = {
    async store(request, response){
        const user = await User.create(request.body);
        response.send({user,
        token:generateToken({userId:user.id})
        });
    },

    async auth(request, response){
        const { emailUser, senhaUser} = request.body;
        const user = await User.findOne({ emailUser }).select('+senhaUser');
        if(!user) {
            console.log("Nenhum usuário encontrado")
            return response.status(401).send({error: 'Nenhum usuário encontrado'})
        }
        if(senhaUser != user.senhaUser) {
            console.log("Senha invalida")
            return response.status(401).send({error: 'Senha invalida'});
        }
        user.senha = undefined; 
        
        response.send({user, 
        token:generateToken({userId:user.id})
    });
    },

    async getUserByUserId(request, response) {
      const { userId } = request;
      console.log(userId)
      const user = await User.find({
        _id: {
          $in: userId
        }
      }).then((user) => {
        if (user === []) {
          return response.json({ message: "Usuário não existe ou não encontrado" })
        }
        return response.json(user);
      })
        .catch((err) => {
          return response.send(err)
        });
    }
}