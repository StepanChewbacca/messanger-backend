FROM node:16

FROM postgres:12-alpine

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .