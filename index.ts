import 'dotenv/config';
import express from 'express';
import proxy from 'express-http-proxy';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { createHttpTerminator } from 'http-terminator';

if (!process.env.URL) throw Error('Target URL must be specified.');
if (!process.env.HTTP_PORT) throw Error('HTTP port must be specified.');
if (!process.env.HTTPS_PORT) throw Error('HTTPS port must be specified.');

// HTTP static/redirection server

const httpApp = express();

// Optionally serve static content like Certbot challenges
if (!process.env.STATIC_PATH)
  console.log(
    'No static content path was specified. Static content will not be served during this session.'
  );
else {
  httpApp.use(
    express.static(process.env.STATIC_PATH, {
      fallthrough: true,
      index: false
    })
  );
}

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

function runHttpsServer() {
  if (!process.env.KEY_PATH) throw Error('Private key path must be specified.');
  if (!process.env.CERT_PATH)
    throw Error('Public certificate path must be specified.');

  if (
    !fs.existsSync(process.env.KEY_PATH) ||
    !fs.existsSync(process.env.CERT_PATH)
  ) {
    console.log(
      'Private key and/or public certificate files are not present. HTTPS tunnel will attempt to start again in 60 seconds.'
    );
    setTimeout(runHttpsServer, 1000 * 60);
    return;
  }

  const key = fs.readFileSync(process.env.KEY_PATH, 'utf8');
  const cert = fs.readFileSync(process.env.CERT_PATH, 'utf8');

  const httpsServer = https.createServer({ key: key, cert: cert }, httpsApp);
  httpsServer.listen(process.env.HTTPS_PORT);
  console.log('HTTPS server listening on port: ' + process.env.HTTPS_PORT);
  const httpTerminator = createHttpTerminator({ server: httpsServer });

  // Kill server after 24 hours to reload the certificate
  setTimeout(async () => {
    await httpTerminator.terminate();
    runHttpsServer();
  }, 1000 * 60 * 60 * 24);
}

runHttpsServer();
