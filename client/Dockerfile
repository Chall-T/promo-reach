FROM node:17-alpine AS builder

WORKDIR /app

RUN npm install -g react-scripts

COPY package.json ./

RUN npm install --omit=dev

COPY . .

CMD ["npm", "run", "build"]

