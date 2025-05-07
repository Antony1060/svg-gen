FROM node:jod-alpine

WORKDIR /app

RUN apk add font-jetbrains-mono-nerd

COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./tsconfig.json .

RUN npm install --global pnpm

# TODO: figure out why this doesn't work
#RUN pnpm install
RUN npm install

COPY ./src ./src

EXPOSE 8080

CMD [ "pnpm", "start" ]
