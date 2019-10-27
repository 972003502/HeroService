var express = require('express');
var router = express.Router();
var HEROES = require('../mockData/heroes');
var mongodb = require('../middleware/mongodb');

const DB_URL = 'mongodb://localhost:27017/test';

router.use('/api', mongodb.dbOperate);

mongodb.init(DB_URL);

/* GET users listing. */
router.get('/api', function (req, res, next) {
  res.send(res.body);
});

router.post('/api', function (req, res, next) {
  res.send(res.info);
});

router.delete('/delete', function (req, res, next) {
  res.send(HEROES);  // 发送数据
});

module.exports = router;