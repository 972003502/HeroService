const express = require('express');
const router = express.Router();
const { drawPic } = require('../../util/util');

let captchaText = '';

router.get('/', function (req, res, next) {
  let width = +req.query.width;
  let height = +req.query.height;
  const captcha = drawPic(4, width, height);
  captchaText = captcha.text;
  console.log(captchaText);
  let timer = setTimeout(() => {
    captchaText = '';
    clearTimeout(timer);
  }, 60 * 1000);
  res.send(captcha.body);
});

router.get('/check', function (req, res, next) {
  let result = false;
  if (req.query.captcha.toLowerCase() == captchaText.toLowerCase()) {
    result = true;
  }
  captchaText = '';
  res.send(result);
});

module.exports = router;