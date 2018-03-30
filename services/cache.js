const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util'); // Part of node

// Set redis url 
const redisUrl = `redis://127.0.0.1:6379`;
// Create redis client
const client = redis.createClient(redisUrl);
// Make client use promises instead of cb 
client.hget = util.promisify(client.hget);
// Save original function 
const exec = mongoose.Query.prototype.exec;

// Custom cache method with flag
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  
  // Make chainable 
  return this;
}

// Overwrite exec method
mongoose.Query.prototype.exec = async function () {
  // Check cache flag 
  if (!this.useCache) {
    // Skip cache logic is false 
    return exec.apply(this, arguments);
  }
  
  // Create object key with query and collection
  const key = JSON.stringify(Object.assign(
    {}, 
    this.getQuery(), 
    {
      collection: this.mongooseCollection.name
    }
  ));

  // Look for key in redis 
  const cacheValue = await client.hget(this.hashKey, key);
  
  // If found, return value
  if (cacheValue) {
    // Get cache and parse 
    const doc = JSON.parse(cacheValue);
    
    // Return mongoose model(s)
      // Check if array or single record
    return Array.isArray(doc) 
      // If array, iterate and return model for each doc 
      ?  doc.map(d => new this.model(d))
      // Otherwise, return model for single record
      : new this.model(doc);
  }
  
  // If not found, send query to db
  const result = await exec.apply(this, arguments);
  
  // Save query key and stringify'd result in redis 
  client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  // return db result   
  return result;
};
