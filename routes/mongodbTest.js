var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// 数据库配置
const DB_URL = 'mongodb://localhost:27017/test';
const dbOptions = {
  keepAlive: 120,
  reconnectTries: 10,
  reconnectInterval: 30,
  connectTimeoutMS: 10000
}
const schemaOptions = {
  strict: true,
  versionKey: false
}

var sendData;

// 连接数据库
mongoose.connect(DB_URL, dbOptions);
const db = mongoose.connection;

// 创建数据集合结构
const Schema = mongoose.Schema;
const heroesSchema = new Schema({
  id: String,
  name: String
}, schemaOptions)

// 创建数据集合模型
// 程序会自动加上's'来对应数据集
var heroesModel = mongoose.model('heroe', heroesSchema);

// 查询数据
heroesModel.find(null, (err, docs) => {
  if(err) console.log(err);
  sendData = docs[0];
  console.log('result: ', docs);
})

// 新增数据
// 方法一：
// var doc = ({
//   id: '2',
//   name: 'Batman'
// });

// heroesModel.create(doc, (err, docs) => {
//   if(err) console.log(err);
//   console.log('result: ', docs);
// });

// // 方法二：
// var heroesEntity = new heroesModel({
//   id: '3',
//   name: 'Thanos'
// })

// heroesEntity.save((err, docs) => {
//   if(err) console.log(err);
//   console.log('result: ', docs);  
// });


// 修改数据
// heroesModel.update({name: 'Thanos'}, {name: 'Captain'}, (err, docs) => {
//   if(err) console.log(err);
//   console.log('result: ', docs);
// })

db.on('error', (error) => {
  console.log('connect fail:', error);
})

db.on('connected', () => {
  console.log('connect seccess!');
})

db.on('disconnected', () => {
  console.log('connect disconnected');
})

// 断开数据库连接
// db.close();

// 中间件
// function find(req, res, next) {
//   heroesModel.find({name: 'SuperMan'}, (err, docs) => {
//     if(err) console.log(err);
//     sendData = docs[0];
//     console.log('result: ', docs[0].name);
//   })
//   next();
// }

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(sendData);
});

module.exports = router;
