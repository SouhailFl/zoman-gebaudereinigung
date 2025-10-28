FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

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

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
