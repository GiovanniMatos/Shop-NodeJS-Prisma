FROM node:20-alpine

RUN apk add --no-cache curl # Para o healthcheck

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY src/ ./src/
COPY prisma/ ./prisma/

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]