FROM node:16-alpine

WORKDIR /app

RUN apk add font-jetbrains-mono-nerd

COPY ./package.json .
COPY ./yarn.lock .
COPY ./tsconfig.json .

RUN yarn install --production

COPY ./src ./src

EXPOSE 8080

CMD [ "yarn", "start" ]