FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS prod-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN npm run build:vinext

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 vinextuser

COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=vinextuser:nodejs /app/dist ./dist
COPY --from=prod-deps --chown=vinextuser:nodejs /app/node_modules ./node_modules

USER vinextuser

EXPOSE 3000

CMD ["node_modules/.bin/vinext", "start"]
