FROM node:16
WORKDIR /app

COPY . .

RUN yarn install

ENV NODE_ENV=production

EXPOSE 80 443
CMD [ "yarn", "start" ]
