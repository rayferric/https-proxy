#!/usr/bin/env python3

import yaml
import jinja2
import os

# Read the config
# If it doesn't exist, use the defaults
# The defaults will be used when the Docker image is being build
# This will provide a basic Nginx configuration that will be able to serve Certbot challenges
try:
    with open("/mount/config.yml") as file:
        config = yaml.safe_load(file.read())
except:
    config = {"email": "", "domains": {}}

# Try to renew certificates

if config["email"] != "" and len(config["domains"]) > 0:
    certbot_cmd = "certbot certonly -m {} --agree-tos --non-interactive --webroot -w /tmp/certbot-static/".format(
        config["email"]
    )

    # Add a -d switch for each domain
    for domain in config["domains"]:
        certbot_cmd += " -d " + domain

    # Run the command
    res = os.system(certbot_cmd)
    if res != 0:
        exit(res)

# Generate the Nginx configuration file

# Load the Jinja2 template from file
with open("/app/nginx.conf.j2") as file:
    # Stripping removes extra newlines from the template
    nginx_template = jinja2.Template(file.read(), trim_blocks=True, lstrip_blocks=True)

# Render the configuration
nginx_config = nginx_template.render(domains=config["domains"])

# Save the rendered configuration to a file
with open("/etc/nginx/nginx.conf", "w") as f:
    f.write(nginx_config)

# Reload Nginx

res = os.system("nginx -s reload 2> /dev/null || true")
if res != 0:
    exit(res)
