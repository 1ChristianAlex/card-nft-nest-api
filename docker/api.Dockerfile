FROM node:17-alpine

WORKDIR /usr/src/app

COPY ./package.json  ./
COPY ./.env ./
COPY ./yarn.lock  ./
COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./

COPY . ./

RUN yarn install

RUN yarn prebuild

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod" ]