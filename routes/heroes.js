var express = require('express');
var router = express.Router();
var mongodb = require('../middleware/mongodb');

router.use('/api', mongodb.dbOperate);

const DB_URL = 'mongodb://localhost:27017/test';
mongodb.init(DB_URL);

/* GET hero listing. */
router.get('/api', function (req, res, next) {
  res.send(res.body);
});

/* POST hero listing. */
router.post('/api', function (req, res, next) {
  res.send(res.info);
});

router.post('/', function (req, res, next) {
  res.send({'接收数据': req.body});
});

/* DELETE hero listing. */
router.delete('/api', function (req, res, next) {
  res.send();
});

module.exports = router;