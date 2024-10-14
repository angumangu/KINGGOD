FROM node:18 As build

WORKDIR /app

COPY package*.json /

RUN npm  install

COPY . .

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app .

CMD [ "node","server.js" ]