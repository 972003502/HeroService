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
  res.body.status = 200;
  res.body.statusText = 'Success';
  res.body.message = 'Get captcha success';
  res.body.data = { captcha: captcha.body }
  res.send(captcha.body);
});

router.get('/check', function (req, res, next) {
  if (req.query.captcha.toLowerCase() == captchaText.toLowerCase()) {
    res.body.status = 200;
    res.body.statusText = 'Success';
    res.body.message = 'Verify Success';
  } else {
    res.body.status = 403;
    res.body.statusText = 'Failed';
    res.body.message = 'Captcha verification failed';
  }
  captchaText = '';
  res.send(res.body);
});

module.exports = router;