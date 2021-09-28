const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')

module.exports = {

  validateToken(require, response, next) {
    const authHeader = require.headers.authorization;

    if (!authHeader)
      return response.status(401).send({ message: 'Sem token' });

    const parts = authHeader.split(' ');
    if (!parts.length === 2)
      return response.status(401).send({ message: 'Token invalido' });

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme))
      return response.status(401).send({ message: 'Token mal formado' });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) return response.status(401).send({ message: 'Token invalido' });

      require.userId = decoded.userId
      return next();
    })
  },

  generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
      expiresIn: 86400,
    })
  }

}