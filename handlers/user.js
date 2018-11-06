const User = require('../models/user');

exports.user = function(req, res, next) {
  User.findById(req.user.data.id)
    .then(user => {
      // only grab props of user object that are needed for
      // client to have
      const { username, email, _id } = user;
      const userObj = {
        username,
        email,
        _id
      };
      res.status(200).json(userObj);
    })
    .catch(ex => next(ex));
};
