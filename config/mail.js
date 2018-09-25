
var gmailConfig = {
    service: 'gmail',
    auth: {
      user: '', // EMAIL
      pass: '', // PASSWORD
    }
}

var officeConfig = {
  host: 'relay.konylabs.net', // Office 365 server
  port: 25,     // secure SMTP
  secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
//   auth: {
//       user: "",
//       pass: ""
//   },
  tls: {
      ciphers: 'SSLv3'
  }
}

module.exports = officeConfig;
