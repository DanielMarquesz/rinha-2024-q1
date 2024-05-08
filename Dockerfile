FROM node:18

COPY ./rinha/package.json ./
WORKDIR /rinha

RUN npm install -g bun
RUN bun install 
RUN npm i ts-node-dev -g

COPY ./rinha /rinha

EXPOSE 3001

CMD [ "npm", "run", "start"]