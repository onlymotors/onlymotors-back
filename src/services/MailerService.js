const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2
const OAuth2_client = new OAuth2(process.env.GOOGLE_CLI_ID, process.env.GOOGLE_CLI_SECRET)
OAuth2_client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

module.exports = {

  async sendMail({ user, email, senha }) {

    const accessToken = OAuth2_client.getAccessToken()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLI_ID,
        clientSecret: process.env.GOOGLE_CLI_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken
      }
    })

    let message = {
      from: process.env.GOOGLE_USER,
      to: email,
      subject: 'Onlycars - Ative sua conta',
      html: `
        <h3>Olá ${user}</h3>
        <p>Seja bem-vindo, agora você poderá vender ou comprar veículos anunciando em nossa plataforma.</p>
        <p>Basta fazer seu login utilizando essa senha para o primeiro acesso</p>
        
        <h3>${senha}</h3>
        <p>Basta copiar e colar a sua senha</p>     
        
        <p>Bons Negócios,</p>
        <p>Equipe OnlyMotors</p>
      `
    }

    transporter.sendMail(message, function (error, result) {
      if (error) {
        console.log('Error: ', error)
      } else {
        console.log('Success: ', result)
      }
    })

    transporter.close()

  }

}