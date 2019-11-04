const express = require('express');
const router = express.Router();
const mongodb = require('../middleware/mongodb');
const multiparty = require('multiparty');

router.use('/api', mongodb.dbOperate);

const DB_URL = 'mongodb://localhost:27017/test';
mongodb.init(DB_URL);

/* GET hero listing. */
router.get('/api', function (req, res, next) {
  // let str = JSON.stringify(res.body);
  // let buf = new Buffer(str);
  // console.log(buf);
  // res.send(zlib.gzip(buf));
  res.send(res.body);
});

/* POST hero listing. */
router.post('/api', function (req, res, next) {
  res.send(res.info);
});

router.post('/', function (req, res, next) {
  let form = new multiparty.Form();
  form.parse(req, function (err, fields, file) {
    console.log(fields);
    res.send({ '服务端接收数据': fields });
  })
});

/* DELETE hero listing. */
router.delete('/api', function (req, res, next) {
  res.send();
});

module.exports = router;