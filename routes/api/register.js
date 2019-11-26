const express = require('express');
const router = express.Router();
const mongodb = require('../../middleware/mongodb');
const rand = require('csprng');

let salt = '';

/* GET listing. */
router.get('/salt', function (req, res, next) {
  salt = rand(256, 16);
  let timer = setTimeout(() => {
    salt = '';
    clearTimeout(timer);
  }, 60 * 1000);
  res.send(salt);
});

router.get('/hasUser',
  mongodb.findOne,
  function (req, res, next) {
    if (!res.dbOperate.data) {
      res.send(false);
    } else if (req.query._email == res.dbOperate.data.email) {
      res.send(true);
    } else {
      res.send(false);
    }
  });

/* POST listing. */
router.post('/', function (req, res, next) {
  req.body.salt = salt;
  salt = '';
  next();
},
  mongodb.add,
  function (req, res, next) {
    if (res.dbOperate.status) {
      res.info = {
        status: 1,
        statusText: 'Success',
        message: 'Registration success',
        date: Date.now()
      }
    } else {
      res.info = {
        status: 0,
        statusText: 'Failed',
        message: 'Registration failed',
        date: Date.now()
      }
    }
    res.send(res.info);
  });

module.exports = router;