FROM node:lts-alpine as base

ENV LANG=ja_JP.UTF-8
ENV HOME=/home/node
ENV APP_HOME="$HOME/app"

WORKDIR $APP_HOME

EXPOSE 3000

# copy package.json, package-lock.json
COPY package*.json ./

# すべてのファイルを node ユーザーのものに
RUN chown -R node:node .

# node ユーザーに切り替え
USER node

# ----------------------------------
# deps
# ----------------------------------
FROM base as deps

# dependencies のみインストール
# husky install が動かないように scripts を無視
RUN npm ci --only=production --ignore-scripts

# ----------------------------------
# builder
# ----------------------------------
FROM base as builder

RUN npm ci
COPY --chown=node:node . .
RUN npm run build

# ----------------------------------
# production
# ----------------------------------
FROM base as prod

ENV NODE_ENV=production

COPY --from=deps $APP_HOME/node_modules ./node_modules
COPY --from=builder $APP_HOME/dist ./dist

CMD ["node", "dist/index.js"]
