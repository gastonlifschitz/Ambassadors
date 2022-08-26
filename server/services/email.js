const nodemailer = require('nodemailer');
const service = {};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const from = '"Embajadores" <Ambassadors@ibm.com>';

service.sendEmail = (subject, to, body) => {
  const mailOptions = {
    subject,
    to,
    from,
    html: body
  };

  return transporter.sendMail(mailOptions);
};

service.sendBccEmail = (subject, bcc, body) => {
  const mailOptions = {
    subject,
    bcc,
    from,
    html: body
  };

  return transporter.sendMail(mailOptions);
};

module.exports = service;
