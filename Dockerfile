FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY package*.json tsconfig*.json ./
RUN npm install --include=dev
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
