FROM node:20-alpine AS base

FROM base AS deps
RUN corepack enable && corepack prepare pnpm@9.5.0
WORKDIR /app
COPY package.json pnpm-lock.yaml prisma .
RUN pnpm install --frozen-lockfile
ENV NODE_ENV=production

FROM base AS builder
RUN corepack enable && corepack prepare pnpm@9.5.0
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
RUN corepack enable && corepack prepare pnpm@9.5.0
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

ENV HOSTNAME="0.0.0.0"

EXPOSE 3000
CMD ["node", "/app/server.js"]