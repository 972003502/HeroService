const express = require('express');
const router = express.Router();
const mongodb = require('../middleware/mongodb');
const crypto = require('crypto');
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

router.get('/register/salt', function (req, res, next) {
  console.log(res.body)
  staticSalt = rand(256, 16);
  res.send(staticSalt);
  // res.send({salt: rand(256, 16)});
});

/* POST hero listing. */
router.post('/register', function (req, res, next) {
  console.log(req.body);
  res.send(res.info);
});

module.exports = router;