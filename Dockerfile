# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk update && apk upgrade --no-cache && apk add --no-cache openssl libc6-compat
WORKDIR /app
ENV HUSKY=0

FROM base AS builder

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci

COPY tsconfig*.json nest-cli.json prisma.config.ts ./
COPY src ./src

ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"
RUN npx prisma generate

RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
