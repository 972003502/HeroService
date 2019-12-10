const express = require('express');
const router = express.Router();
const mongodb = require('../../middleware/mongodb');
const rand = require('csprng');
const { drawPic } = require('../../util/util');

let salt = '';
let captchaText = '';
let captchaTimer;
let saltTimer;

/* GET listing. */
router.get('/salt', function (req, res, next) {
  salt = rand(256, 16);
  clearTimeout(saltTimer);
  saltTimer = setTimeout(() => {
    salt = '';
    clearTimeout(saltTimer);
  }, 60 * 1000);
  res.body.status = 200;
  res.body.statusText = 'Success';
  res.body.message = 'Get salt success';
  res.body.data = { salt: salt };
  res.send(res.body);
});

router.get('/hasUser',
  mongodb.findOne,
  function (req, res, next) {
    if (!res.dbOperate.data) {
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = 'User does not exist';
      res.body.data = { hasUser: false };
    } else if (req.query._email == res.dbOperate.data.email) {
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = 'User exists';
      res.body.data = { hasUser: true };
    } else {
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = 'User does not exist';
      res.body.data = { hasUser: false };
    }
    res.send(res.body);
  });

router.get('/captcha', function (req, res, next) {
  let width = +req.query.width;
  let height = +req.query.height;
  const captcha = drawPic(4, width, height);
  captchaText = captcha.text;
  clearTimeout(captchaTimer);
  captchaTimer = setTimeout(() => {
    captchaText = '';
    clearTimeout(captchaTimer);
  }, 300 * 1000);
  res.body.status = 200;
  res.body.statusText = 'Success';
  res.body.message = 'Get captcha success';
  res.body.data = { captcha: captcha.body };
  res.send(res.body);
});

/* POST listing. */
router.post('/', function (req, res, next) {
  if (req.body.captcha.toLowerCase() != captchaText.toLowerCase()) {
    captchaText = '';
    res.body.status = 403;
    res.body.statusText = 'Failed';
    res.body.message = 'Captcha verification failed';
    res.body.data = { captchaVerify: false };
    return res.send(res.body);
  }
  delete req.body.captcha;
  req.body.salt = salt;
  captchaText = '';
  salt = '';
  next();
},
  mongodb.add,
  function (req, res, next) {
    if (res.dbOperate.status) {
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = 'Registration success';
    } else {
      res.body.status = 500;
      res.body.statusText = 'Failed';
      res.body.message = 'Registration failed';
    }
    res.send(res.body);
  });

module.exports = router;