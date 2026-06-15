# Stage 1: Build and test
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/src/ ./src/
COPY --from=builder /app/docs/openapi.json ./docs/openapi.json
EXPOSE 3000
CMD ["node", "src/index.js"]
