FROM node:17.3.0-alpine3.13
WORKDIR /app
COPY package.json /app/package.json
RUN apk add yarn
RUN yarn install 
COPY . /app
CMD ["yarn", "start"]