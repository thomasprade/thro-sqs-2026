# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root config and workspace package files
COPY package.json package-lock.json* ./
COPY shared/package.json shared/
COPY backend/package.json backend/

# Install dependencies
RUN npm ci --workspace=shared --workspace=backend --include-workspace-root

# Copy source code
COPY shared/ shared/
COPY backend/ backend/
COPY tsconfig.base.json ./

# Build shared, then backend
RUN npm run build -w shared
RUN npm run build -w backend

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/shared/package.json shared/
COPY --from=builder /app/backend/package.json backend/
COPY --from=builder /app/node_modules/ node_modules/
COPY --from=builder /app/shared/dist/ shared/dist/
COPY --from=builder /app/backend/dist/ backend/dist/

# Create data directory for SQLite
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/database.sqlite

EXPOSE 3000

CMD ["node", "backend/dist/main.js"]
