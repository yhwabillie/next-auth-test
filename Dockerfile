FROM node:20-alpine AS base

FROM base AS deps
RUN corepack enable && corepack prepare pnpm@9.5.0
WORKDIR /app
COPY prisma ./
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
RUN corepack enable && corepack prepare pnpm@9.5.0
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.5.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
CMD ["node", "/app/server.js"]


