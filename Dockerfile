# Alpine based Nginx + Certbot + Cron combo:
FROM alpine:3

# Install Python
RUN apk add --no-cache python3

# Install PyYAML
RUN apk add --no-cache py3-yaml

# Install Jinja2
RUN apk add --no-cache py3-jinja2

# Install Nginx
RUN apk add --no-cache nginx

# Install Certbot
RUN apk add --no-cache certbot

# Choose the working directory
WORKDIR /app

# Copy over the needed files
COPY . .

# Make reload.py executable
RUN chmod +x ./reload.py

# Create /tmp/certbot-static
RUN mkdir /tmp/certbot-static

# Generate basic Nginx configuration
RUN ./reload.py

# Schedule a cron job to regenerate Nginx configuration and request new cartificates every day at midnight
# Certificates will not be replaced if they already exist and still have a long time until expiration
# (Alpine has cron installed by default)
RUN echo "0 0 * * * /app/reload.py" > /etc/crontabs/root

# Run cron daemon in the background and Nginx in the foreground
# ("daemon off;" was declared in ./nginx.conf)
CMD ["sh", "-c", "crond && nginx"]

