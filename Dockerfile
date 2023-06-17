FROM node:18

WORKDIR /app

ENV TZ="Asia/Shanghai"
ENV NODE_ENV="production"

COPY . .
RUN corepack enable
RUN corepack prepare pnpm@latest-8 --activate
RUN pnpm config set store-dir .pnpm-store
RUN pnpm -v
RUN pnpm install

RUN midway-bin build -c

# 如果端口更换，这边可以更新一下
EXPOSE 7001

CMD ["npm", "run", "start"]
