let mongoose = require('mongoose');
let schema = require('../schema/schema');

let modelStrCache = [null, null];
let model = null;
let schemas = new Map();
let models = new Map();

// 数据库配置
let dbOptions = {
  poolSize: 5,
  keepAlive: 120,
  reconnectTries: 10,
  reconnectInterval: 30,
  connectTimeoutMS: 10000
}
let schemaOptions = {
  strict: true,
  versionKey: false
}

function connect(connectUrl, options = dbOptions) {
  mongoose.connect(connectUrl, options);
  mongoose.connection.on('error', (error) => {
    console.log('connect fail:', error);
  })
  mongoose.connection.on('connected', () => {
    console.log('connect seccess!');
  })
  mongoose.connection.on('disconnected', () => {
    console.log('connect disconnected');
  })
}

function init(connectUrl, options = dbOptions) {
  connect(connectUrl, options)
  createSchemas();
  createModels();
}

function close() {
  mongoose.connection.close();
  model = null;
  modelStrCache = [null, null];
  schemas.clear();
  models.clear();
}

function createSchema(typeObj, options = schemaOptions) {
  return new mongoose.Schema(typeObj, options);
}

function createSchemas() {
  if (JSON.stringify(schema) == '{}') return;
  for (let key in schema) {
    let newSchema = new mongoose.Schema(schema[key], schemaOptions);
    schemas.set(key, newSchema);
  }
}

function createModel(modelStr) {
  if (JSON.stringify(schema) == '{}') {
    console.error(schema, 'is empty, Can’t create model!');
    return;
  }
  if (!modelStr in schema || models.has(modelStr)) return;
  let typeObj = schema[modelStr];
  let newModel = mongoose.model(modelStr, createSchema(typeObj));
  models.set(modelStr, newModel);
  return newModel;
}

function createModels() {
  if (!schemas.size) return;
  for (let entry of schemas) {
    let newModel = mongoose.model(entry[0], entry[1]);
    models.set(entry[0], newModel);
  }
}

function getModel(modelStr) {
  let str = modelStr;
  modelStrCache[0] = str;
  if (modelStrCache[0] != modelStrCache[1]) {
    model = models.get(str);
    modelStrCache[1] = str;
  }
}

function dbOperate(req, res, next) {
  switch (req.method) {
    case 'GET':
      find(req, res, next);
      break;
    case 'POST':
      add(req, res, next);
      break;
    default:
      console.log(`Received an unknown http method, method name: ${req.method}`);
      next();
  }
}

function find(req, res, next) {
  getModel(req.query.model);
  if (!model) next();
  model.find(null, function (err, docs) {
    if (err) {
      console.log(err);
      next();
    }
    res.body = docs;
    res.info = { message: 'POST sccessfull' };
    next();
  })
}

function add(req, res, next) {
  getModel(req.query.model);
  if (!model) next();
  model.create(req.body, function (err, docs) {
    if (err) {
      console.log(err);
      next();
    }
    res.body = docs;
    res.info = { message: 'POST sccessfull' };
    next();
  })
}

module.exports = mongodb = {
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
  add: add,
  close: close,
  schemas: schemas,
  models: models
};
