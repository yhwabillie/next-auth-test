FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* prisma ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . .

RUN corepack enable pnpm && pnpm build


ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
CMD ["node", "/app/server.js"]