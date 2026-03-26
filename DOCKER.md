# Docker Setup - Condoa Backend

## Objetivo

Esta configuracao Docker e voltada para desenvolvimento local.

Ela sobe:
- API Node.js com reload automatico
- PostgreSQL
- MinIO

## Arquivos relevantes

```text
docker/
|-- entrypoint.js
`-- init.sql
Dockerfile
docker-compose.yml
.dockerignore
.env.example
```

## Primeira execucao

```bash
cp .env.example .env
docker compose up --build
```

## Servicos disponiveis

| Servico | URL | Observacao |
| --- | --- | --- |
| API | http://localhost:3333 | rota `/health` disponivel |
| PostgreSQL | localhost:5433 | banco `condoa` |
| MinIO API | http://localhost:9000 | endpoint S3 compativel |
| MinIO Console | http://localhost:9001 | console web |

## Comandos uteis

```bash
docker compose up
docker compose up --build
docker compose down
docker compose down -v
docker compose logs -f app
docker compose exec app yarn migration:run
docker compose exec db psql -U postgres -d condoa
```
