FROM node:18-alpine

WORKDIR /app/auth-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000 

CMD ["npm", "start"]
