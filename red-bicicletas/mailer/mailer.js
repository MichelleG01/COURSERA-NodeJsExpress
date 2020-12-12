const nodemailer = require('nodemailer'); //lo instalo con npm install nodemailer --save , esta librería me ayuda a simular un servidor de correos SMTP

//configuracion para simular una cuenta SMTP de correo electronico ficticia
const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'laila36@ethereal.email',
        pass: 'P9Z2q3MgEaHqGS2QuK'
    }
};

module.exports = nodemailer.createTransport(mailConfig);