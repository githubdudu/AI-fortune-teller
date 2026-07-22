# Use Node.js as the base image
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build argument for API base URL (can be passed at build time)
ARG VITE_API_BASE_URL

# Build the app
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Create a script that will replace environment variables at runtime
RUN echo "#!/bin/sh" > /docker-entrypoint.d/40-replace-env-vars.sh && \
    echo "set -e" >> /docker-entrypoint.d/40-replace-env-vars.sh && \
    echo 'for file in /usr/share/nginx/html/assets/*.js; do' >> /docker-entrypoint.d/40-replace-env-vars.sh && \
    echo '  echo "Processing $file..."' >> /docker-entrypoint.d/40-replace-env-vars.sh && \
    echo '  sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=\"$VITE_API_BASE_URL\"|g" $file' >> /docker-entrypoint.d/40-replace-env-vars.sh && \
    echo 'done' >> /docker-entrypoint.d/40-replace-env-vars.sh && \
    chmod +x /docker-entrypoint.d/40-replace-env-vars.sh

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]