FROM node:hydrogen-alpine

WORKDIR /app

RUN apk add font-jetbrains-mono-nerd

COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./tsconfig.json .

RUN npm install --global pnpm

RUN pnpm install

COPY ./src ./src

EXPOSE 8080

CMD [ "pnpm", "start" ]
