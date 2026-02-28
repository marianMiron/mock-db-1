# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .

# IMPORTANT: The websocket connects to the SAME host serving the site (NGINX proxy), 
# so we use a relative path /ws which NGINX forwards to the backend container
ENV VITE_WS_URL=ws://${HOST:-localhost}:5173/ws
ENV VITE_API_URL=http://${HOST:-localhost}:5173/api

RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx mapping for the API
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
