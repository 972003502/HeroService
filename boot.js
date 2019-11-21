const mongodb = require('./middleware/mongodb');

function boot() {
  // 初始化数据库
  mongodb.init();
  // 连接数据库
  mongodb.connect('mongodb://localhost:27017/test');
}

module.exports = boot;