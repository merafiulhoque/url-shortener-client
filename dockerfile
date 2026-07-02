#Install dependencies
FROM node:22-alpine as ClientDependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci

#Build Application
FROM node:22-alpine as ClientBuilder

WORKDIR /app

COPY --from=ClientDependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build

#Production Image
FROM node:22-alpine as ClientRunner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=ClientBuilder /app/.next ./.next
COPY --from=ClientBuilder /app/public ./public
COPY --from=ClientBuilder /app/node_modules ./node_modules
COPY --from=ClientBuilder /app/package.json ./package.json

EXPOSE 3000

CMD [ "npm", "start" ]