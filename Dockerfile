FROM node:16.11.1-alpine3.13
WORKDIR /app
COPY package.json /app/package.json
RUN apk add yarn
RUN yarn install 
COPY . /app
CMD ["yarn", "start"]