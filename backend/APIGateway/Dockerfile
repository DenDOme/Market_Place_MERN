FROM node:18-alpine

WORKDIR /app/api-gateway

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4003

CMD ["npm", "start"]
