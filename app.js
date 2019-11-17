const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongodb = require('./middleware/mongodb');
// var formidableMiddleware = require('express-formidable');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const heroesRouter = require('./routes/heroes');
const register = require('./routes/api/register');
//var mongodbTestRouter = require('./routes/mongodbTest');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
// app.use(formidableMiddleware());

// CORS options
// must setting it befor the Router
// 想要用ContentType:application/json发送跨域请求，
// 服务器端还必须设置一个名为Access-Control-Allow-Headers的Header， 
// 将它的值设置为 Content-Type，
// 表明服务器能够接收到前端发送的请求中的ContentType属性并使用它的值
app.use(function(req, res, next) {
  res.header('Content-Language', 'zh-cn');
  res.header('Cache-Control', 'no-cache');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Max-Age', '1000');
  // res.header('Content-Encoding', 'gzip');
  next();
});

// Router options
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/heroes', heroesRouter);
app.use('/api/register', register);
//app.use('/mongodb', mongodbTestRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.stack);
  // res.render('error');
});

// 初始化数据库
mongodb.init();

module.exports = app;
