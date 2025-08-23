# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Cache npm pour accélérer les builds (BuildKit)
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm i -g @infisical/cli

# Paramètres non sensibles
ARG INFISICAL_ENV=dev
ARG INFISICAL_PATH=/front
ENV INFISICAL_ENV=$INFISICAL_ENV \
    INFISICAL_PATH=$INFISICAL_PATH \
    NODE_ENV=production

# ✅ CI: lit le token via secret BuildKit  (/run/secrets/infisical_token)
# ✅ Render: lit le token via variable d'env INFISICAL_TOKEN
RUN --mount=type=secret,id=infisical_token \
    set -eu; \
    TOK="${INFISICAL_TOKEN:-}"; \
    if [ -z "$TOK" ] && [ -f /run/secrets/infisical_token ]; then TOK="$(cat /run/secrets/infisical_token)"; fi; \
    if [ -z "$TOK" ]; then echo "❌ INFISICAL_TOKEN manquant"; exit 1; fi; \
    INFISICAL_TOKEN="$TOK" infisical run --env="$INFISICAL_ENV" --path="$INFISICAL_PATH" -- npm run build

# (optionnel) Next.js 'standalone' => image plus légère (si activé dans next.config.js)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
# Assure-toi d'avoir:  "start": "next start -p $PORT"
CMD ["npm","start"]
