FROM node:18-alpine

WORKDIR /app/product-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4003

CMD ["npm", "start"]
