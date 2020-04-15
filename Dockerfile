FROM node:12.14.0-alpine

WORKDIR /app
ADD . /app
RUN yarn install --production

CMD yarn workspace @fastpoker/server start
