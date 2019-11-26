const mongodb = require('./middleware/mongodb');
require('dotenv').config();

function boot() {
  // 初始化数据库
  mongodb.init();
  // 连接数据库
  mongodb.connect(process.env.DB_CONNECT_URL);
}

module.exports = boot;