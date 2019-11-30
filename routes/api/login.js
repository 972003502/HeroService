const express = require('express');
const router = express.Router();
const mongodb = require('../../middleware/mongodb');
const rand = require('csprng');
const { encryptWithSalt } = require('../../util/util');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let dynamicSalt = '';
let saltTimer;

/* GET listing. */
router.get('/userSalt',
  mongodb.findOne,
  function (req, res, next) {
    if (res.dbOperate.data) {
      dynamicSalt = rand(256, 16);
      clearTimeout(saltTimer);
      saltTimer = setTimeout(() => {
        dynamicSalt = '';
        clearTimeout(saltTimer);
      }, 60 * 1000);
      const salt = {
        staticSalt: res.dbOperate.data.salt,
        dynamicSalt: dynamicSalt
      }
      res.body.status = 1;
      res.body.statusText = 'Success';
      res.body.message = 'Get user\'s salt success';
      res.body.data = { salt: salt };
    } else {
      res.body.status = 0;
      res.body.statusText = 'Failed';
      res.body.message = 'Get user\'s salt failed';
    }
    res.send(res.body);
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
    const passwordSalt = encryptWithSalt(password, dynamicSalt, 'Hex');
    dynamicSalt = '';
    if (req.body.password == passwordSalt) {
      const payload = {
        user: req.body.email
      };
      const options = {
        algorithm: 'HS256',
        issuer: 'http://localhost:3000',
        expiresIn: '30s'
      };
      const secret = encryptWithSalt(req.ip, process.env.SECRET_SEED, 'Hex');
      const token = jwt.sign(payload, secret, options);
      res.body.status = 1;
      res.body.statusText = 'Success';
      res.body.message = 'Login success';
      res.body.data = { token: token };
    } else {
      res.body.status = 0;
      res.body.statusText = 'Failed';
      res.body.message = 'Login failed';
    }
    res.send(res.body);
  });

module.exports = router;