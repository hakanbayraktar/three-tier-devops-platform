# Multi-stage / Optimized Node.js 20 LTS Alpine Image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies (utilizing Docker layer caching)
COPY package*.json ./
RUN npm ci --only=production || npm install --production

# Copy application source code
COPY . .

# Security Hardening: Use non-root 'node' user
USER node

# Expose backend API port
EXPOSE 3500

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3500/healthz || exit 1

# Start the application
CMD ["node", "server.js"]
