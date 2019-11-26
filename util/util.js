const cryptoJS = require("crypto-js");

const util = {
  encryptWithSalt(str, salt, enc = 'Hex') {
    const hash = cryptoJS.SHA256(cryptoJS.SHA256(str) + salt);
    if (enc) {
      enc = enc.toLowerCase();
    }
    return hash.toString(cryptoJS.enc[enc]);
  }
}

module.exports = util;