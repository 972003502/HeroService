const express = require('express');
const router = express.Router();
const mailer = require('nodemailer');
require('dotenv').config();

let transporter = mailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

let mailOptions = {
  from: process.env.MAIL_USER,
  to: '972003502@qq.com',
  subject: 'Hello',
  text: 'Hello World',
  html: '<b>Hello World~</b>'
}

router.get('/', function (req, res, next) {
  console.log('send begin')
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log('send error', err);
      res.send(err);
    } else {
      console.log('send success', info);
      res.send(info);
    }
  });
});

module.exports = router;