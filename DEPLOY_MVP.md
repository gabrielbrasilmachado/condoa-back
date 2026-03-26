# Deploy MVP

## Stack

- Backend: Render
- Database: Supabase Postgres
- Storage: Supabase Storage
- Ambiente local: MinIO

## Render

Se o servico estiver configurado como Docker Web Service:

- Dockerfile Path: `Dockerfile`
- Docker Command: deixar vazio
- Build Command: deixar vazio
- Start Command: deixar vazio
- Health Check Path: `/health`

O `Dockerfile` e o `docker/entrypoint.js` ja cuidam do build, migrations, seed inicial e start da aplicacao.

Se preferir usar Node runtime em vez de Docker:

- Build Command: `corepack enable && yarn install --immutable && yarn build`
- Start Command: `yarn start`
- Health Check Path: `/health`

## Variaveis obrigatorias em producao

- `NODE_ENV=production`
- `PORT`
- `FRONTEND_URL`
- `DATABASE_URL`
- `DB_SSL=true`
- `JWT_ACCESS_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRES_IN`
- `JWT_REFRESH_COOKIE_NAME`
- `JWT_REFRESH_COOKIE_PATH`
- `JWT_REFRESH_COOKIE_SECURE=true`
- `JWT_REFRESH_COOKIE_SAME_SITE=none`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PHONE`
- `ADMIN_PASSWORD`
- `BCRYPT_SALT_ROUNDS`
- `STORAGE_PROVIDER=supabase`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

## Desenvolvimento local

- manter `STORAGE_PROVIDER=minio`
- continuar usando Docker local com MinIO/Postgres
