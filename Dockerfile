FROM node:alpine
WORKDIR /app

COPY package.json ./

COPY ./ ./
RUN npm install --force
CMD ["npm", "run", "start"]

