exports.users = function(req, res, next) {
  // place holder to test a route with authentication
  return res.status(200).json({
    message: 'successfully reached users!',
    jwtInfo: req.user
  });

  res.status(403).end();
};
