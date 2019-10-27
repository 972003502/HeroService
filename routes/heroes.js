var express = require('express');
var router = express.Router();
var HEROES = require('../mockData/heroes');
var mongodb = require('../middleware/mongodb');

const DB_URL = 'mongodb://localhost:27017/test';

router.use('/api/get', mongodb.find);

mongodb.init(DB_URL);

/* GET users listing. */
router.get('/api/get', function (req, res, next) {
  res.send(res.body);
});

// router.post('/', function (req, res, next) {
//   heroesModel.create(req.body, (err, docs) => {
//     if (err) console.log(err);
//     console.log('POST sccessfull');
//     res.send({ message: 'add sccessfull' });  // 发送数据
//   });
// });

router.delete('/delete', function (req, res, next) {
  res.send(HEROES);  // 发送数据
});

module.exports = router;