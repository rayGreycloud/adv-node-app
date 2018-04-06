const { 
  accessKey, 
  accessKeyId, 
  googleClientId, 
  googleClientSecret, 
  mongoUri 
} = require('../secret/s3-blog-bucket.js');

module.exports = {
  googleClientID: googleClientId,
  googleClientSecret: googleClientSecret,
  mongoURI: mongoUri,
  cookieKey: '123123123',
  redisUrl: 'redis://127.0.0.1:6379',
  accessKeyId: accessKeyId,
  secretAccessKey: accessKey   
};
