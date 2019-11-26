const express = require('express');
const router = express.Router();
const mongodb = require('../../middleware/mongodb');
const rand = require('csprng');
const util = require('../../util/util');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let dynamicSalt = '';

/* GET listing. */
router.get('/userSalt',
  mongodb.findOne,
  function (req, res, next) {
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

/* POST listing. */
router.post('/',
  function (req, res, next) {
    req.conditions = { email: req.body.email };
    next();
  },
  mongodb.findOne,
  function (req, res, next) {
    const password = res.dbOperate.data.password;
    const passwordSalt = util.encryptWithSalt(password, dynamicSalt, 'Hex');
    dynamicSalt = '';
    if (req.body.password == passwordSalt) {
      const payload = {
        user: req.body.email
      };
      const options = {
        algorithm: 'HS256',
        issuer: 'http://localhost:3000',
        expiresIn: '1d'
      };
      const secret = util.encryptWithSalt(req.ip, process.env.SECRET_SEED, 'Hex');
      const token = jwt.sign(payload, secret, options);
      res.info = {
        status: 1,
        statusText: 'Success',
        message: 'Login Success',
        date: Date.now(),
        token: token
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