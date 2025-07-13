FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 6092

ENTRYPOINT ["node", "--max-old-space-size=100", "index.js"]