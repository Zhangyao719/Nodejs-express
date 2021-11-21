function errorHandler(err, req, res, next) {
  console.log(111, err, err.name);
  let code = 500;
  let message = 'Internal Server Error';
  if (err.name === 'UnauthorizedError') {
    code = 401
    message = 'no login'
  }
  res.statusCode = code;
  res.send({
    status: code,
    message,
  })
}

module.exports = errorHandler