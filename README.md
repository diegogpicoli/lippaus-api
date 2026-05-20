# Lippaus API

Backend (API) do catálogo de produtos da **Lippaus Distribuição**. NestJS + Prisma (PostgreSQL), com armazenamento de imagens em storage S3-compatível (MinIO local / Cloudflare R2 em produção).

> Este repositório é a **fundação** (change `setup-backend`). As features de produto e autenticação entram em changes seguintes.

## Requisitos

- Node 20+ (testado no 22)
- Docker + Docker Compose

## Setup local

```bash
# 1. variáveis de ambiente
cp .env.example .env

# 2. subir Postgres + MinIO
docker compose up -d

# 3. dependências
npm install

# 4. gerar o Prisma Client
npm run prisma:generate

# 5. subir a API (watch)
npm run start:dev
```

A API sobe em `http://localhost:3000`.

## Health check

```
GET /health
```

Retorna **200** com o estado de `database` e `storage`; **503** se alguma dependência estiver indisponível.

## Variáveis de ambiente

| Variável                                    | Descrição                   |
| ------------------------------------------- | --------------------------- |
| `PORT`                                      | Porta HTTP (default `3000`) |
| `DATABASE_URL`                              | Conexão PostgreSQL (Prisma) |
| `S3_ENDPOINT`                               | Endpoint S3 (MinIO/R2)      |
| `S3_REGION`                                 | Região S3                   |
| `S3_BUCKET`                                 | Bucket das imagens          |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Credenciais S3              |
| `S3_FORCE_PATH_STYLE`                       | `true` para MinIO           |

## Serviços locais

- PostgreSQL: `localhost:5432`
- MinIO API: `localhost:9000` · Console: `localhost:9001`

## Scripts

- `npm run start:dev` — API em watch
- `npm run build` / `npm run start:prod`
- `npm test` — testes unitários
- `npm run prisma:generate` / `npm run prisma:migrate`
