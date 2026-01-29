# ---------- Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first (better caching)
COPY package.json pnpm-lock.yaml* ./

# Install pnpm + dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy rest of source
COPY . .

# Build Vite app
RUN pnpm run build


# ---------- Production Stage ----------
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (socket.io proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
