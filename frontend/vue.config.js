const fs = require('fs');

let key;
let cert;
try {
  key = fs.readFileSync('../certs/_wildcard.barracaodigital.com+5-key.pem').toString(),
  cert = fs.readFileSync('../certs/_wildcard.barracaodigital.com+5.pem').toString(),
} catch (err) {
  console.error('Error loading HTTPS certificates', err);
}


module.exports = {
  devServer: {
    https: {
      key,
      cert,
      port: 443,
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
  lintOnSave: false,
};
