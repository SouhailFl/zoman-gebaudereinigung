# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install all dependencies (including dev)
RUN npm install

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy package files
COPY package*.json ./
# Copy source code
COPY . .
# Accept build arguments
ARG PUBLIC_HCAPTCHA_SITE_KEY
ARG PUBLIC_EMAIL_SERVICE_URL
# Set environment variables for build
ENV PUBLIC_HCAPTCHA_SITE_KEY=$PUBLIC_HCAPTCHA_SITE_KEY
ENV PUBLIC_EMAIL_SERVICE_URL=$PUBLIC_EMAIL_SERVICE_URL
# Build the static site
RUN npm run build

# Stage 3: Production - serve with nginx
FROM nginx:alpine
# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf
# Set proper permissions for nginx to run as non-root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chmod -R 755 /usr/share/nginx/html
EXPOSE 80
# Run as non-root user
USER nginx
CMD ["nginx", "-g", "daemon off;"]
