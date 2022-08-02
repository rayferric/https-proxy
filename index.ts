import 'dotenv/config';
import express from 'express';
import proxy from 'express-http-proxy';
import fs from 'fs';
import http from 'http';
import https from 'https';

if (!process.env.URL) throw Error('Target URL must be specified.');
if (!process.env.HTTP_PORT) throw Error('HTTP port must be specified.');
if (!process.env.HTTPS_PORT) throw Error('HTTPS port must be specified.');

// HTTP redirection/Certbot server

const httpApp = express();

// Serve Certbot
httpApp.use(
  express.static('public/', {
    fallthrough: true,
    index: false
  })
);

httpApp.use('/', (req, res) => {
  res.redirect(
    'https://' + req.hostname + ':' + process.env.HTTPS_PORT + req.originalUrl
  );
});

const httpServer = http.createServer(httpApp);
httpServer.listen(process.env.HTTP_PORT);
console.log('HTTP server listening on port: ' + process.env.HTTP_PORT);

// HTTPS proxy

const httpsApp = express();

httpsApp.use('/', proxy(process.env.URL));

var key = fs.readFileSync(
  `/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`,
  'utf8'
);
var cert = fs.readFileSync(
  `/etc/letsencrypt/live/${process.env.DOMAIN}/fullchain.pem`,
  'utf8'
);

const httpsServer = https.createServer({ key: key, cert: cert }, httpsApp);
httpsServer.listen(process.env.HTTPS_PORT);
console.log('HTTPS server listening on port: ' + process.env.HTTPS_PORT);
