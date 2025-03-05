FROM node:18-alpine

WORKDIR /app/product-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm", "start"]
