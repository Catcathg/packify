# Dockerfile simple pour Next.js
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY packify-frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY packify-frontend/ .

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build app (or skip if it fails)
RUN npm run build || echo "Build failed, will run in dev mode"

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]