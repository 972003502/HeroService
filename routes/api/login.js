const express = require('express');
const router = express.Router();
const mongodb = require('../../middleware/mongodb');
const rand = require('csprng');
const cryptoJS = require("crypto-js");

let dynamicSalt = '';

function encryptWithSalt(str, salt, enc = 'Hex') {
  const hash = cryptoJS.SHA256(cryptoJS.SHA256(str) + salt);
  if (enc) {
    enc = enc.toLowerCase();
  }
  return hash.toString(cryptoJS.enc[enc]);
}

router.get('/', function (req, res, next) {
  res.send('Hello login');
});

router.get('/userSalt', mongodb.findOne, function (req, res, next) {
  if (res.dbOperate.data) {
    dynamicSalt = rand(256, 16);
    let timer = setTimeout(() => {
      dynamicSalt = '';
      clearTimeout(timer);
    }, 60 * 1000);
    const salt = {
      staticSalt: res.dbOperate.data.salt,
      dynamicSalt: dynamicSalt
    }
    res.send(salt);
  } else {
    res.send(null);
  }
});

router.post('/', function (req, res, next) {
  req.conditions = { email: req.body.email };
  next();
},
  mongodb.findOne,
  function (req, res, next) {
    const password = res.dbOperate.data.password;
    const passwordSalt = encryptWithSalt(password, dynamicSalt, 'Hex');
    dynamicSalt = '';
    if (req.body.password == passwordSalt) {
      res.info = {
        status: 1,
        statusText: 'Success',
        message: 'Login Success',
        date: Date.now()
      }
    } else {
      res.info = {
        status: 0,
        statusText: 'Failed',
        message: 'Login Failed',
        date: Date.now()
      }
    }
    res.send(res.info);
  });

module.exports = router;