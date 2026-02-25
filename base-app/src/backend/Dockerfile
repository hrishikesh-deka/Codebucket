FROM node:24-alpine

WORKDIR /app

# CRITICAL: Install health check tools BEFORE copying code
RUN apk update && apk add --no-cache \
    netcat-openbsd \
    curl \
    bash

COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# CRITICAL: chmod MUST come AFTER COPY
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
