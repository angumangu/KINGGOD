FROM node:latest AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm install prom-client

EXPOSE 3000

FROM node:18-slim

WORKDIR /app

COPY --from=build /app /app

CMD ["node","server.js"]
