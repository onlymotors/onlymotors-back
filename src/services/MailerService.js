const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_PASSWORD
  }
})


module.exports = {

  async sendMail({ user, email, senha }) {
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
    await transporter.sendMail(message)
  }

}