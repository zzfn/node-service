# Build Stage
FROM node:lts-alpine AS build

WORKDIR /app

# Copy files and install dependencies
COPY . .
RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm i --frozen-lockfile && \
    pnpm run build

# Production Stage
FROM node:lts-alpine

WORKDIR /app

# Copy necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/bootstrap.js ./
COPY --from=build /app/package.json ./
COPY --from=build /app/.npmrc ./
COPY --from=build /app/pnpm-lock.yaml ./

# Install necessary packages and prepare environment
RUN apk add --no-cache tzdata && \
    corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile --production

ENV TZ="Asia/Shanghai"

# If you change the port, update this value
EXPOSE 7001

CMD ["npm", "run", "start"]
