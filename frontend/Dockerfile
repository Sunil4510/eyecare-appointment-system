# Stage 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies cleanly
COPY package*.json ./
RUN npm ci

# Copy application files and build
COPY . .
RUN npm run build

# Stage 2: Serve the compiled application with lightweight Nginx
FROM nginx:alpine

# Copy custom Nginx configuration with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production bundle from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose frontend port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
