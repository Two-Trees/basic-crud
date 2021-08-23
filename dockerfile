 FROM node:slim

LABEL test app

WORKDIR /app

COPY index.js /app/index.js

COPY package.json /app/package.json

RUN npm install