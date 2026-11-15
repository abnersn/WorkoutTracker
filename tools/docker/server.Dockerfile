# Runs one server (gateway, users-svc or workouts-svc) from its pruned build.
# Build the app first, then use its dist folder as the context:
#
#   npx nx run users-svc:prune
#   docker build -f tools/docker/server.Dockerfile dist/server/users-svc
#
# Configuration comes from the environment at run time (see the README's
# Environments section); nothing is baked into the image.
FROM node:26-slim

ENV NODE_ENV=production
WORKDIR /app

# Dependencies first, so a code-only change reuses this layer.
COPY package.json package-lock.json ./
COPY workspace_modules ./workspace_modules
RUN npm ci --omit=dev && npm cache clean --force

COPY main.js main.js.map ./
COPY protos ./protos

USER node
CMD ["node", "--enable-source-maps", "main.js"]
