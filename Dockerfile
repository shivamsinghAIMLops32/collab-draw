FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/server/package*.json ./apps/server/
COPY packages/db/package*.json ./packages/db/
COPY packages/config/package*.json ./packages/config/

RUN npm install

COPY . .

RUN npx prisma generate --schema=./packages/db/prisma/schema.prisma

EXPOSE 3000 3001

CMD ["npm", "run", "dev"]
