# Dockerfile simple pour Next.js avec Infisical
FROM node:20-alpine

# Install Infisical CLI
RUN npm install -g @infisical/cli

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build:infisical

# Expose port
EXPOSE 3000

# Start with Infisical for environment variables
CMD ["infisical", "run", "--env=dev", "--path=/front", "--", "npm", "start"]
