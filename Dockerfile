# Utiliser l'image Node.js officielle
FROM node:20-alpine AS builder

# Installer Infisical CLI
RUN npm install -g @infisical/cli

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build de l'application avec Infisical (au moment du build)
ARG INFISICAL_TOKEN
ARG INFISICAL_ENV=dev
ARG INFISICAL_PATH=/front

# Build de l'application
RUN infisical run --env=$INFISICAL_ENV --path=$INFISICAL_PATH -- npm run build

# Image de production
FROM node:20-alpine AS runner

WORKDIR /app

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port
EXPOSE 3000

# Commande de démarrage (sans Infisical)
CMD ["npm", "start"]