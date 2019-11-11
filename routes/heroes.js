const express = require('express');
const router = express.Router();
const mongodb = require('../middleware/mongodb');
const multiparty = require('multiparty');

router.use('/api', mongodb.dbOperate);

mongodb.connect('mongodb://localhost:27017/test');

/* GET hero listing. */
router.get('/api', function (req, res, next) {
  res.send(res.body);
});

/* POST hero listing. */
router.post('/api', function (req, res, next) {
  res.send(res.info);
});

router.post('/', function (req, res, next) {
  let form = new multiparty.Form();
  form.parse(req, function (err, fields, file) {
    console.log('fields:', fields, 'file:', file);
    res.send({ '字段': fields, "文件": file});
  })
  console.log(form);
});

/* DELETE hero listing. */
router.delete('/api', function (req, res, next) {
  res.send();
});

module.exports = router;