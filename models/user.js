const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    set: v => v.toLowerCase()
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  role: ''
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    next();
  }
  bcrypt
    .hash(this.password, 10)
    .then(hashed => {
      this.password = hashed;
      next();
    })
    .catch(err => next(err));
});

userSchema.methods.comparePassword = function(password, next) {
  const user = this;

  return bcrypt
    .compare(password, user.password)
    .then(compared => {
      return compared;
    })
    .catch(err => next(err));
};

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { data: { id: this.id, username: this.username, role: this.role } },
    process.env.SECRET_KEY,
    { expiresIn: '7d' }
  );

  return token;
};

// Enable uniqueValidator on this schema
userSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.'
});
const User = mongoose.model('User', userSchema);

module.exports = User;
