# HTTPS Proxy

📬 HTTPS server that forwards requests to a different IP address and port.
The server can optionally choose between different destinations based on the domain name used by the visitor.
Everything is grouped up as Docker Compose services - an Nginx instance and a Certbot certificate renewal cron job.

## Prerequisites

- 🐋 [Docker Compose](https://docs.docker.com/compose)
- 🐂 [GNU Make](https://www.gnu.org/software/make)
- 🖤 [Black](https://pypi.org/project/black) _(Optional)_
- 🌈 [Prettier](https://prettier.io) _(Optional)_

## Getting Started

### Cloning the Repository

First, clone the repository to a working directory of choice:

```sh
$ git clone https://github.com/rayferric/https-proxy.git
```

### Deployment

Then modify the [config.yml](./config.yml) file to suit your needs.

To deploy HTTPS Proxy in a Docker container, use:

```bash
$ make deploy
```

This command will start the Nginx server on your machine, but you can use it multiple times to instantly reload config.yml without interrupting the server.

### Updating the Configuration

You can freely modify [config.yml](./config.yml) while HTTPS Proxy is running.
As mentioned earlier, `$ make deploy` can be used to instantly trigger a configuration reload.

## About

### Tech Stack

- Docker
- Alpine Linux
- Nginx
- Cron
- Python
- Jinja2
- Certbot
- GNU Make
- YAML

### Authors

- Ray Ferric ([rayferric](https://github.com/rayferric))

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
