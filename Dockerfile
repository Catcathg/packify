# Dockerfile pour Next.js (mode dev pour éviter build errors)
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY packify-frontend/package.json packify-frontend/package-lock.json* ./
RUN npm ci

# Copy source code
COPY packify-frontend/ .

# Environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use dev mode to avoid build issues
CMD ["npm", "run", "dev"]