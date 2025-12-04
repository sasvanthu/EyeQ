FROM node:18-alpine

# Install build deps
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
