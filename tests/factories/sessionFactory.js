const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  // Create session object
  const sessionObject = {
    passport: {
      user: user._id.toString() // Convert _id object 
    }
  };
  
  // Create session string 
  const session = Buffer.from(
    JSON.stringify(sessionObject)
  ).toString('base64');

  // Create signature   
  const sig = keygrip.sign(`session=${session}`);

  // Return session and session signature
  return { session, sig };
};
