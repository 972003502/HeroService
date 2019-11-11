const express = require('express');
const router = express.Router();
const mongodb = require('../middleware/mongodb');

router.use('/', mongodb.dbOperate);

// mongodb.connect('mongodb://localhost:27017/test');

router.get('/', function (req, res, next) {
  console.log(req)
  res.send('respond with a resource');
});

/* POST hero listing. */
router.post('/register', function (req, res, next) {
  console.log(req.body);
  res.send(res.info);
});

module.exports = router;