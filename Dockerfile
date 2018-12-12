FROM node:10.14.1-alpine
ADD package.json package.json
RUN apk add git
RUN npm install
ADD . .
RUN npm run build:web
ENTRYPOINT npm run serve:web
EXPOSE 8080