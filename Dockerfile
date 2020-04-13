FROM node:12.14.0-alpine

WORKDIR /app
ADD . /app
RUN yarn install --production
RUN yarn workspace @fastpoker/client build

CMD yarn workspace @fastpoker/server start
