FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/server/package*.json ./apps/server/
COPY packages/db/package*.json ./packages/db/


RUN rm package-lock.json
RUN npm install
COPY . .

RUN npx prisma generate --schema=./packages/db/prisma/schema.prisma
RUN cd packages/db && npx tsc
RUN cd apps/server && npx tsc src/index.ts --outDir dist --esModuleInterop --skipLibCheck
RUN ls -la apps/server/dist || echo "dist not found"

EXPOSE 3000 3001

CMD ["npm", "run", "dev"]
