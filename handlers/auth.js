const db = require('../models/db');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signin = function(req, res, next) {
  User.findOne({
    email: req.body.email
  })
    .exec()
    .then(user => {
      if (user === undefined || user === null) {
        return next({
          status: 404,
          message: 'No record found'
        });
      }
      let { id, username } = user;
      user.comparePassword(req.body.password).then(isMatch => {
        if (isMatch) {
          const token = user.generateAuthToken();
          return res.status(200).json({
            id,
            username,
            token
          });
        } else {
          return next({
            status: 400,
            message: 'Invalid Email/Password.'
          });
        }
      });
    })
    .catch(err => next(err));
};
exports.signup = function(req, res, next) {
  req.body.role = req.role;
  User.create(req.body)
    .then(user => {
      let { id, username } = user;
      let token = user.generateAuthToken();
      return res.status(201).json({
        id,
        username,
        token
      });
    })
    .catch(err => {
      if (err.code === 11000) {
        err.message = 'Sorry, that username and / or email is taken';
      }
      return next({
        status: 400,
        message: err.message
      });
    });
};
