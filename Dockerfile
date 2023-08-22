FROM node:lts-alpine AS build

WORKDIR /app

COPY . .

RUN corepack enable && \
    corepack prepare pnpm@latest --activate \

RUN pnpm i --frozen-lockfile

RUN pnpm run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
# 把源代码复制过去， 以便报错能报对行
COPY --from=build /app/src ./src
COPY --from=build /app/bootstrap.js ./
COPY --from=build /app/package.json ./

RUN apk add --no-cache tzdata
RUN corepack enable && \
    corepack prepare pnpm@latest --activate \

ENV TZ="Asia/Shanghai"

RUN pnpm install --production

# 如果端口更换，这边可以更新一下
EXPOSE 7001

CMD ["npm", "run", "start"]
