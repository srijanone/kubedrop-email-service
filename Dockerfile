FROM node:14.7.0-alpine

WORKDIR /app

COPY package*.json ./

# USER node

RUN npm install

COPY . ./
# COPY --chown=node:node . ./

ENV APP_PORT 3009

EXPOSE ${APP_PORT}

CMD ["node", "src/app.js"]
