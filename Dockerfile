FROM node:9
ADD package.json package.json
ADD . .
RUN rm -rf node_modules
RUN npm install
RUN rm -f .env
RUN npm run build:web
ENTRYPOINT npm run serve:web
EXPOSE 8080
