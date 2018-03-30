const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util'); // Part of node

// Set redis url 
const redisUrl = `redis://127.0.0.1:6379`;
// Create redis client
const client = redis.createClient(redisUrl);
// Make client use promises instead of cb 
client.get = util.promisify(client.get);
// Save original function 
const exec = mongoose.Query.prototype.exec;

// Overwrite exec method
mongoose.Query.prototype.exec = async function () {
  // Create object key with query and collection
  const key = JSON.stringify(Object.assign(
    {}, 
    this.getQuery(), 
    {
      collection: this.mongooseCollection.name
    }
  ));

  // Look for key in redis 
  const cacheValue = await client.get(key);
  
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
  client.set(key, JSON.stringify(result));

  // return db result   
  return result;
};
