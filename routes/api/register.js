const express = require('express');
const router = express.Router();
const mongodb = require('../../middleware/mongodb');
const rand = require('csprng');

//router.use('/', mongodb.dbOperate);

mongodb.connect('mongodb://localhost:27017/test');

let staticSalt = '';

// function getSalt(timeoutMS, flage) {
//   if (!flage) {
//     staticSalt = rand(256, 16);
//     flage = 1;
//     let timer = setTimeout(() => {
//       flage = 0;
//       clearTimeout(timer);
//     }, timeoutMS);
//   }
//   return staticSalt;
// }

/* POST listing. */
router.get('/salt', function (req, res, next) {
  staticSalt = rand(256, 16);
  res.send(staticSalt);
});

router.get('/user', function (req, res, next) {
  console.log(req.query);
  req.query.conditions = Object.fromEntries(
    Object.entries(req.query)
      .filter(item => item[0][0] == '_')
      .map(item => [item[0].slice(1), item[1]])
  );
  next();
}, mongodb.findOne, function (req, res, next) {
  res.send(res.dbOperate.data);
});


/* POST listing. */
router.post('/', function (req, res, next) {
  req.body.salt = staticSalt;
  next();
}, mongodb.add, function (req, res, next) {
  if (res.dbOperate.status) {
    res.info = {
      status: 1,
      statusText: 'success',
      message: 'registration success'
    }
    res.send(res.info);
  } else {
    res.info = {
      status: 0,
      statusText: 'Failed',
      message: 'registration failed'
    }
    res.send(res.info);
  }
});

module.exports = router;