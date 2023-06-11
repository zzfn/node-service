FROM node:16-alpine AS build

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@latest-8 --activate;
RUN pnpm config set store-dir .pnpm-store 
RUN pnpm install && npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
# 把源代码复制过去， 以便报错能报对行
COPY --from=build /app/src ./src
COPY --from=build /app/bootstrap.js ./
COPY --from=build /app/package.json ./
COPY --from=build /app/.npmrc ./

ENV TZ="Asia/Shanghai"
ENV NODE_ENV="production"
RUN yarn global add pnpm && pnpm i --production;

# 如果端口更换，这边可以更新一下
EXPOSE 7001
CMD ["node", "bootstrap.js"]
