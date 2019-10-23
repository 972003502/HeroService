var express = require('express');
var router = express.Router();
var HEROES = require('../mockData/heroes');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.set({
    'Content-Type':  'application/json'
  });
  res.type('json');  // 设置JSON格式传输
  res.status(200);   // 设置状态码
  res.send(HEROES);  // 发送数据
});

router.post('/post', function(req, res, next) {
  res.set({
    'Content-Type':  'application/json'
  }); 
  res.send(HEROES);  // 发送数据
});

router.delete('/delete', function(req, res, next) {
  res.set({
    'Content-Type':  'application/json'
  });
  res.send(HEROES);  // 发送数据
});

module.exports = router;