const jwt = require('jsonwebtoken');

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

    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if (err) return response.status(401).send({ message: 'Token invalido' });

      require.userId = decoded.userId
      return next();
    })
  },

  generateToken(params = {}) {
    return jwt.sign(params, process.env.AUTH_SECRET, {
      expiresIn: 86400,
    })
  }

}