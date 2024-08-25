# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* prisma ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules and source code from previous stages
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Define build arguments for secrets
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG RESET_PW_JWT
ARG DATABASE_URL
ARG DIRECT_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_PROJECT_DIR
ARG NEXT_PUBLIC_BASE_URL
ARG EMAIL_SERVER
ARG EMAIL_PORT
ARG EMAIL_USER
ARG EMAIL_PASSWORD
ARG NEXT_PUBLIC_SUPABASE_STORAGE_URL

# Set environment variables based on build arguments
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV RESET_PW_JWT=${RESET_PW_JWT}
ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_URL=${DIRECT_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXT_PUBLIC_PROJECT_DIR=${NEXT_PUBLIC_PROJECT_DIR}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV EMAIL_SERVER=${EMAIL_SERVER}
ENV EMAIL_PORT=${EMAIL_PORT}
ENV EMAIL_USER=${EMAIL_USER}
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD}
ENV NEXT_PUBLIC_SUPABASE_STORAGE_URL=${NEXT_PUBLIC_SUPABASE_STORAGE_URL}

# Build the Next.js project
RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy the built assets and static files
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

# Start the Next.js application
CMD ["node", "server.js"]