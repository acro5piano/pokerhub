FROM node:12.14.0-alpine

WORKDIR /app
ADD . /app
RUN yarn install --production
RUN ./docker-prebuild.sh

CMD yarn workspace @fastpoker/server start
