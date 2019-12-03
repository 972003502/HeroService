const express = require('express');
const router = express.Router();
const util = require('../../util/util');
const jwt = require('express-jwt');
require('dotenv').config();

function secretCallback(req, payload, done) {
  const secret = util.encryptWithSalt(req.ip, process.env.SECRET_SEED, 'Hex');
  done(null, secret);
}

router.get('/',
  jwt({ secret: secretCallback }),
  function (req, res, next) {
    res.body.status = 200;
    res.body.statusText = 'Success';
    res.body.message = 'Verify Success';
    res.send(res.body);
  });

module.exports = router;