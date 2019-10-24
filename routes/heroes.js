var express = require('express');
var router = express.Router();
var HEROES = require('../mockData/heroes');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.set({
    'Content-Type':  'application/json'
  });
  console.log(req.host, req.method, req.body);
  res.send(HEROES);  // 发送数据
});

router.post('/', function(req, res, next) {
  res.set({
    'Content-Type':  'application/json'
  }); 
  // console.log(req.body);
  // HEROES.push(req.body);
  console.log(req.host, req.method, req.body);
  res.send(req.body);  // 发送数据
});

router.delete('/delete', function(req, res, next) {
  res.set({
    'Content-Type':  'application/json'
  });
  res.send(HEROES);  // 发送数据
});

module.exports = router;