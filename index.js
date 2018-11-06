require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// all routes here

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/test', testRoutes);

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(process.env.PORT, function() {
  console.log(`Server is starting on port ${process.env.PORT}`);
});
