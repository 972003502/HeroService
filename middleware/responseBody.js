class ResBodyModel {
  status = '';
  statusText = '';
  message = '';
  data = {};
}

function responseInfo(req, res, next) {
  res.body = new ResBodyModel();
  next();
}

module.exports = responseInfo;
