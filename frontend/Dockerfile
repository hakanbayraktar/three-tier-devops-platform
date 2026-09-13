# ==============================================================================
# Stage 1: Build the React Application
# ==============================================================================
FROM node:20-alpine AS build

WORKDIR /app

# Accept API base URL as build argument
ARG REACT_APP_API_BASE_URL=""
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Copy dependency manifests
COPY package*.json ./
RUN npm install

# Copy source and build static bundle
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Serve with High-Performance Nginx Alpine (Image size drops from 900MB to ~25MB!)
# ==============================================================================
FROM nginx:1.25-alpine

# Remove default nginx html files
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from Stage 1
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration supporting React Router SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
