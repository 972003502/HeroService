const mongoose = require('mongoose');
const schema = require('../schema/schema');

const nativeMongoose = mongoose;
let schemasCache = new Map();
let modelsCache = new Map();

// 数据库配置
let dbOptions = {
  poolSize: 5,
  keepAlive: 120,
  reconnectTries: 10,
  reconnectInterval: 30,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}
let schemaOptions = {
  strict: true,
  versionKey: false
}

// 连接数据库函数
function connect(connectUrl, options = dbOptions) {
  let retry = 0;
  let connected = false;
  let start = Date.now();
  mongoose.connect(connectUrl, options);
  mongoose.connection.on('error', (error) => {
    console.log('connect fail:', {
      database: db.name,
      error: error
    });
    let timer = setTimeout(() => {
      if (retry < 3 && !connected) {
        retry += 1;
        console.log(`第${retry}次尝试重新连接...`);
        mongoose.connect(connectUrl, options);
      } else {
        clearTimeout(timer);
      }
    }, 3000);
  })
  mongoose.connection.on('connected', () => {
    connected = true;
    // connectionsInfo();
    console.log('connect seccess!', {
      database: mongoose.connection.name,
      connectionTime: Date.now() - start
    });
  })
  mongoose.connection.on('disconnected', () => {
    console.log('connect disconnected', {
      database: mongoose.connection.name
    });
  })
}

// 打印当前连接数
function connectionsInfo() {
  mongoose.connection.db.admin().serverStatus()
    .then(
      res => console.log(res.connections)
    )
}

// 数据库初始化函数
function init() {
  createSchemas();
  createModels();
}

// 关闭数据库连接函数
function close() {
  mongoose.connection.close();
  schemasCache.clear();
  modelsCache.clear();
}

// 中间件工厂函数
function useMiddleware(schema, options) {
  switch (options.hook) {
    case 'pre':
      schema.pre(options.method, options.callBack);
      break;
    case 'post':
      schema.post(options.method, options.callBack);
      break;
    default:
      schema.pre(options.method, options.callBack);
  }
}

// 创建Schema
function createSchema(typeObj, options = schemaOptions, ...args) {
  let newSchema = new mongoose.Schema(typeObj, options);
  if (args) {
    for (let opt of args) {
      useMiddleware(newSchema, opt);
    }
  }
  return newSchema;
}

// 创建Schemas
function createSchemas(...args) {
  if (JSON.stringify(schema) == '{}') return;
  for (let key in schema) {
    let newSchema = new mongoose.Schema(schema[key], schemaOptions);
    if (args) {
      for (let opt of args) {
        useMiddleware(newSchema, opt);
      }
    }
    schemasCache.set(key, newSchema);
  }
}

// 创建Model
function createModel(modelStr) {
  if (JSON.stringify(schema) == '{}') {
    console.error(schema, 'is empty, Can’t create model!');
    return;
  }
  if (!modelStr in schema || modelsCache.has(modelStr)) return;
  let typeObj = schema[modelStr];
  let newModel = mongoose.model(modelStr, createSchema(typeObj));
  modelsCache.set(modelStr, newModel);
  return newModel;
}

// 创建Models
function createModels() {
  if (!schemasCache.size) return;
  for (let entry of schemasCache) {
    let newModel = mongoose.model(entry[0], entry[1]);
    modelsCache.set(entry[0], newModel);
  }
}

// 通过URL query参数获取Model
function getModel(modelStr) {
  let str = modelStr;
  modelStrCache[0] = str;
  if (modelStrCache[0] != modelStrCache[1]) {
    modelStrCache[1] = str;
    return modelsCache.get(str);
  }
  return;
}

// 数据库操作Express中间件
function dbOperate(req, res, next) {
  switch (req.method) {
    case 'GET':
      find(req, res, next);
      break;
    case 'POST':
      add(req, res, next);
      break;
    case 'DELETE':
      del(req, res, next);
      break;
    case 'UPDATE':
      update(req, res, next);
      break;
    case 'OPTIONS':
      next();
      break;
    default:
      console.log(`Received an unknown http method, method name: ${req.method}`);
      return next();
  }
}

// 数据库查询操作中间件
function find(req, res, next) {
  let model = modelsCache.get(req.query.collection);
  if (!model) return next();
  let conditions = req.conditions || conditionParser(req.query);
  model.find(conditions, function (err, docs) {
    if (err) {
      res.dbOperate = {
        method: 'find',
        status: 0,
        statusText: 'Failed',
        data: null
      }
      console.error(err);
      return next(err);
    }
    res.dbOperate = {
      method: 'find',
      status: 1,
      statusText: 'success',
      data: docs || null
    }
    next();
  })
}

function conditionParser(query) {
  return Object.fromEntries(
    Object.entries(query)
      .filter(item => item[0][0] == '_')
      .map(item => [item[0].slice(1), item[1]])
  );
}

// 数据库条件查询操作中间件
function findOne(req, res, next) {
  let model = modelsCache.get(req.query.collection);
  if (!model) return next();
  let conditions = req.conditions || conditionParser(req.query);
  model.findOne(conditions, function (err, docs) {
    if (err) {
      res.dbOperate = {
        method: 'find',
        status: 0,
        statusText: 'Failed',
        data: null
      }
      console.error(err);
      return next(err);
    }
    res.dbOperate = {
      method: 'find',
      status: 1,
      statusText: 'success',
      data: docs || null
    }
    next();
  })
}

// 数据库新增操作中间件
function add(req, res, next) {
  let model = modelsCache.get(req.query.collection);
  if (!model) return next();
  model.create(req.body, function (err, docs) {
    if (err) {
      res.dbOperate = {
        method: 'create',
        status: 0,
        statusText: 'Failed',
        data: null
      }
      console.error(err);
      return next(err);
    }
    res.dbOperate = {
      method: 'create',
      status: 1,
      statusText: 'success',
      data: docs || null
    }
    next();
  })
}

// 数据库删除操作中间件
function del(req, res, next) {
  // getModel(req.query.model);
  // if (!model) next();
  // model.create(req.body, function (err, docs) {
  //   if (err) {
  //     console.log(err);
  //     next();
  //   }
  //   res.body = docs;
  //   res.info = { message: 'POST sccessfull' };
  //   next();
  // })
  next();
}

// 数据库更新操作中间件
function update(req, res, next) {
  // getModel(req.query.model);
  // if (!model) next();
  // model.create(req.body, function (err, docs) {
  //   if (err) {
  //     console.log(err);
  //     next();
  //   }
  //   res.body = docs;
  //   res.info = { message: 'POST sccessfull' };
  //   next();
  // })
  next();
}

function errorHandler(err, req, res, next) {

}

module.exports = mongodb = {
  nativeMongoose: nativeMongoose,
  dbOptions: dbOptions,
  schemaOptions: schemaOptions,
  connect: connect,
  createSchema: createSchema,
  createSchemas: createSchemas,
  createModel: createModel,
  createModels: createModels,
  init: init,
  dbOperate: dbOperate,
  find: find,
  findOne: findOne,
  add: add,
  close: close,
  schemasCache: schemasCache,
  modelsCache: modelsCache
};
