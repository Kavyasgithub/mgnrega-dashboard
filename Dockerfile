# MGNREGA Dashboard - Multi-stage Docker build

# Stage 1: Build React app
FROM node:18-alpine AS client-build
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./
RUN npm ci --only=production

# Copy client source
COPY client/ ./
RUN npm run build

# Stage 2: Build Node.js server
FROM node:18-alpine AS server-build
WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server source
COPY server/ ./

# Stage 3: Production runtime
FROM node:18-alpine AS production

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mgnrega -u 1001

# Set working directory
WORKDIR /app

# Copy built server
COPY --from=server-build --chown=mgnrega:nodejs /app/server ./server
COPY --from=client-build --chown=mgnrega:nodejs /app/client/build ./client/build

# Create logs directory
RUN mkdir -p /app/server/logs && \
    chown -R mgnrega:nodejs /app/server/logs

# Switch to non-root user
USER mgnrega

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
WORKDIR /app/server
CMD ["node", "index.js"]