const nodemailer = require('nodemailer'); //lo instalo con npm install nodemailer --save , 
//esta librería me ayuda a simular un servidor de correos SMTP dentor de node

//configuracion para simular una cuenta SMTP de correo electronico ficticia
/*const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'laila36@ethereal.email',
        pass: 'P9Z2q3MgEaHqGS2QuK'
    }
};

module.exports = nodemailer.createTransport(mailConfig);*/


//usamos npm install nodemailer-sendgrid-transport para crear un ambiente productivo sobre los email
const sgTransport = require('nodemailer-sendgrid-transport'); //Para envio de correos en ambiente de produccion

let mailConfig;
//Acá evalúo si estamos trabajando en ambiente de desarrollo o de producción
if (process.env.NODE_ENV === 'production'){
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET
        }
    }
    mailConfig = sgTransport(options);
}else {
    if (process.env.NODE_ENV === 'staging'){
        console.log('XXXXXXXXXXXX');
        const options = {
            auth: {
                api_key: process.env.SENDGRID_API_SECRET
            }
        }
        mailConfig = sgTransport(options);

    }else {
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_EMAIL_USER_DEV,
                pass: process.env.ETHEREAL_EMAIL_PASS_DEV
            }

        };
    }
};

module.exports = nodemailer.createTransport(mailConfig);