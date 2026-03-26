FROM node:24.12-alpine AS development

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./

RUN corepack enable && yarn install --immutable

COPY src ./src
COPY docker ./docker

EXPOSE 3333

CMD ["node", "docker/entrypoint.js"]
