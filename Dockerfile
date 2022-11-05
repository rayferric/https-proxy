FROM node:16
WORKDIR /app

COPY . .

ENV NODE_ENV=production

RUN yarn install

EXPOSE 80 443
CMD [ "yarn", "start" ]
