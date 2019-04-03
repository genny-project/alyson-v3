FROM node:10.15.3
ADD . .
RUN rm -f .env
RUN npm install
RUN npm audit fix
RUN npm cache clear --force
RUN npm run build:web
ENTRYPOINT npm run serve:web
EXPOSE 8080
