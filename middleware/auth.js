const jwt = require('jsonwebtoken');

exports.auth = function(req, res, next) {
  let token = req.header('Authorization');
  if (!token) {
    let err = new Error('Access denied. No token provided.');
    return next(err);
  }
  token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    next({
      status: 401,
      message: ex
    });
  }
};
