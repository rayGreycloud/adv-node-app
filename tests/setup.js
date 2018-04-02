// Extend Jest to avoid timeout 
jest.setTimeout(30000);

// Mongo setup
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
