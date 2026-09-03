# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy compiled files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Variables are expected to be injected at runtime
ENV NODE_ENV=production

EXPOSE 3000

# Start the NestJS application
CMD ["node", "dist/main"]
