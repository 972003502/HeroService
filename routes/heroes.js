var express = require('express');
var router = express.Router();
var HEROES = require('../mockData/heroes');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.set({
  //   'Access-Control-Allow-Origin': 'http://localhost:4200'
  // }); // 设置响应头
  res.header("Access-Control-Allow-Origin", "*");
  res.type('json');  // 设置JSON格式传输
  res.status(200);   // 设置状态码
  res.send(HEROES);  // 发送数据
});

router.post('/post', function(req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Metods': 'POST, PUT, DELETE',
    'Content-Type':  'application/json'
  }); // 设置响应头
  // res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  res.send(HEROES);  // 发送数据
});

module.exports = router;