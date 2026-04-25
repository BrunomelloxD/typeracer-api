FROM node:lts-alpine3.20 AS deps
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci

FROM node:lts-alpine3.20 AS builder
WORKDIR /home/node/app
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY . .

RUN DATABASE_URL="" npx prisma generate

RUN npm run build \
 && test -f dist/app/main.js \
    || (echo "ERRO: dist/app/main.js nao foi gerado. Conteudo de dist:" \
        && find dist -maxdepth 4 -type f -name "*.js" | sort && exit 1)

FROM node:lts-alpine3.20 AS final
ENV NODE_ENV=production
WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/prisma ./prisma
COPY --from=builder /home/node/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /home/node/app/node_modules/@prisma ./node_modules/@prisma

USER node
EXPOSE 3000
CMD ["node", "dist/app/main.js"]
