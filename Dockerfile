# Stage: install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage: build (if you have build steps, otherwise you can skip this stage)
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If you have a build step (like transpile), uncomment:
# RUN npm run build

# Final runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app . 
EXPOSE 4000
# Use environment PORT if set by the platform; fallback to 4000 in code
CMD ["node", "src/index.js"]
