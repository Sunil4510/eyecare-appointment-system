FROM node:22-alpine

WORKDIR /app

# Install dependencies cleanly
COPY package*.json ./
RUN npm ci

# Copy TypeScript configuration and source files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript into dist and bundle seed data
RUN npm run build

# Expose backend REST API port
EXPOSE 3001

# Start the compiled production server
CMD ["npm", "start"]
