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
    res.info = {
      status: 1,
      statusText: 'Success',
      message: 'Verify Success',
      date: Date.now()
    }
    res.status(200).send(res.info);
  });

module.exports = router;