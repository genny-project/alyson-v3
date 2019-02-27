FROM node:9
ADD package.json package.json
RUN npm install
ADD . .
RUN rm -f .env
RUN npm run build:web
ENTRYPOINT npm run serve:web
EXPOSE 8080
