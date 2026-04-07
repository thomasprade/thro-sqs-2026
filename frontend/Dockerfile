# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy root config and workspace package files
COPY package.json package-lock.json* ./
COPY shared/package.json shared/
COPY frontend/package.json frontend/

# Install dependencies
RUN npm ci --workspace=shared --workspace=frontend --include-workspace-root

# Copy source code
COPY shared/ shared/
COPY frontend/ frontend/
COPY tsconfig.base.json ./

# Build shared, then frontend
RUN npm run build -w shared
RUN npm run build -w frontend

# Production stage — serve with nginx
FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
