const nodemailer = require('nodemailer');

const fromEmail = process.env.ADMINFROMEMAIL
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: fromEmail,
        pass: process.env.ADMINFROMEMAIL_PASSWORD
    }
});

const defaultMailOptions = {
    from: fromEmail,
    to: process.env.ADMINTOEMAIL
};

const sendEmail = (emailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            ...defaultMailOptions,
            ...emailOptions
        }, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(`Email sent: ${info.response}`);
                resolve(info);
            }
        })
    });
}

module.exports = {
    sendEmail
}