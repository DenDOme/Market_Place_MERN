FROM node:18-alpine

WORKDIR /app/order-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4002

CMD ["npm", "start"]
