# Dockerfile pour Next.js avec Tailwind
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY packify-frontend/package.json packify-frontend/package-lock.json* ./
RUN npm ci

# Force install PostCSS dependencies
RUN npm install autoprefixer postcss tailwindcss

# Copy source code
COPY packify-frontend/ .

# Environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Install Tailwind if missing
RUN npm install -D tailwindcss postcss autoprefixer || true

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "dev"]