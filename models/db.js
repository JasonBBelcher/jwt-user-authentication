const mongoose = require('mongoose');
const config = require('config');
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect(config.get('Database.host'));
