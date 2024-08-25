FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies using secrets
COPY package.json pnpm-lock.yaml* prisma ./

# Use BuildKit to securely mount secrets during the build process
RUN --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_URL \
    --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_ANON_KEY \
    --mount=type=secret,id=RESET_PW_JWT \
    --mount=type=secret,id=DATABASE_URL \
    --mount=type=secret,id=DIRECT_URL \
    --mount=type=secret,id=NEXTAUTH_URL \
    --mount=type=secret,id=NEXTAUTH_SECRET \
    --mount=type=secret,id=NEXT_PUBLIC_PROJECT_DIR \
    --mount=type=secret,id=NEXT_PUBLIC_BASE_URL \
    --mount=type=secret,id=EMAIL_SERVER \
    --mount=type=secret,id=EMAIL_PORT \
    --mount=type=secret,id=EMAIL_USER \
    --mount=type=secret,id=EMAIL_PASSWORD \
    --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_STORAGE_URL \
    corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application using the built-in Next.js server
CMD ["node", "server.js"]
