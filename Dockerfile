# Builder pattern
FROM node:10.14.0-alpine AS builder
WORKDIR /app
ADD package.json package.json
ADD . .
RUN apk add git
RUN npm install
RUN npm run build:web

WORKDIR /app
FROM nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN ["nginx"]
