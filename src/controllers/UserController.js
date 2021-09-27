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
        token:generateToken({id:user.id})
        });
    },

    async auth(request, response){
        const { email_user, senha} = request.body;
        const user = await User.findOne({ email_user }).select('+senha');
        if(!user) {
            console.log("Nenhum usuário encontrado")
            return response.status(401).send({error: 'Nenhum usuário encontrado'})
        }
        if(senha != user.senha) {
            console.log("Senha invalida")
            return response.status(401).send({error: 'Senha invalida'});
        }
        user.senha = undefined; 
        
        response.send({user, 
        token:generateToken({id:user.id})
    });
    } 
}