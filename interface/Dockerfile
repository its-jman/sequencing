FROM node:8

RUN mkdir code
WORKDIR /code

COPY package.json /code/package.json
COPY yarn-lock.json /code/yarn-lock.json

RUN yarn install
