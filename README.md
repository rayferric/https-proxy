# HTTPS Proxy

HTTPS server that forwards requests to a different IP address and port.
The server can optionally choose between different destinations based on the domain name used by the visitor.
Everything is grouped up as Docker Compose services - an Nginx instance and a Certbot certificate renewal cron job.

## Getting Started

### Deployment

First, clone the repository to a working directory of choice:

```sh
$ git clone https://github.com/rayferric/https-proxy.git
```

Then modify the [config.yml](./config.yml) file to suit your needs.

To deploy, use:

```bash
docker-compose up
```

### Reloading the configuration

`docker-compose.yml` is pre-configured to work with Certbot on Linux with `example.com` domain. Edit it however you like.

To deploy with docker, use:

```bash
docker-compose up  exec
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
