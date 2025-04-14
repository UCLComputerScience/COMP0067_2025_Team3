# Build
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN cd src && npx prisma generate && cd ..
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["sh", "-c", "env | grep DATABASE && npm start"]
