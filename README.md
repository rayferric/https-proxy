# HTTPS Proxy

HTTPS server that forwards requests to a different URL.

Before attempting to deploy, you should [generate](#how-to-generate-certificate-with-certbot-on-linux) your certificate.

## Local deployment

Example `.env` file for local deployment with Certbot on Linux, configured to use `example.com` domain:

```
# Target URL to which the incoming requests should be tunneled
URL=http://localhost:8080/

# The port to host the redirection/Certbot server on
HTTP_PORT=80

# The port on which to host the proxy
HTTPS_PORT=433

# Where the HTTPS server should read the private key from
KEY_PATH=/etc/letsencrypt/live/example.com/privkey.pem

# Where the HTTPS server should read the certificate from
CERT_PATH=/etc/letsencrypt/live/example.com/fullchain.pem

# Where the HTTP server should serve static content from (optional - content will not be served if this value is omitted)
STATIC_PATH=/tmp/certbot-static/
```

To deploy locally, use:

```bash
NODE_ENV=production yarn install
NODE_ENV=production yarn start
```

## Docker deployment

`docker-compose.yml` is pre-configured to work with Certbot on Linux with `example.com` domain. Edit it however you like.

To deploy with docker, use:

```bash
docker-compose up
```

## How to generate certificate with Certbot on Linux

Ensure the HTTPS proxy is runnning.

Then run the following command:

```bash
certbot certonly --webroot -w /tmp/certbot-static/ -d example.com
```

Which produces these two files:

```bash
/etc/letsencrypt/live/example.com/privkey.pem # Private key
/etc/letsencrypt/live/example.com/fullchain.pem # Public certificate
```

You may see a bunch of messages about the HTTPS tunnel not starting if it was your first time running it.
The HTTPS tunnel restarts every minute if no certificate is present and switches to 24 hour restart cycle once it has picked up the certificate.
