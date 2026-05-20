# Lippaus API

Backend do catálogo de produtos da **Lippaus Distribuição**.

Projeto desenvolvido como **teste técnico para a vaga de Desenvolvedor FullStack na Lippaus**.

Stack: **NestJS 11** + **Prisma 7** (PostgreSQL), storage S3-compatível (**MinIO** local / **Cloudflare R2** em produção), autenticação **JWT** e documentação **OpenAPI (Swagger)**.

## Requisitos

- Node 20+ (testado no 22)
- Docker + Docker Compose

## Como rodar (local)

```bash
# 1. variáveis de ambiente
cp .env.example .env

# 2. subir Postgres + MinIO
docker compose up -d

# 3. dependências
npm install

# 4. aplicar as migrations (cria as tabelas) e gerar o Prisma Client
npm run prisma:migrate

# 5. subir a API em watch
npm run start:dev
```

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`

O bucket no MinIO é criado e liberado para leitura pública automaticamente no boot (ambiente de desenvolvimento).

## Autenticação

As rotas de negócio exigem o cabeçalho `Authorization: Bearer <token>`.

Obtenha o token em `POST /auth/register` ou `POST /auth/login` (ambos retornam `access_token`). No Swagger, use o botão **Authorize** e cole o token.

## Rotas

| Método   | Rota             | Descrição                                  | Auth |
| -------- | ---------------- | ------------------------------------------ | ---- |
| `GET`    | `/health`        | Readiness (database + storage)             | não  |
| `POST`   | `/auth/register` | Cria usuário e retorna o access token      | não  |
| `POST`   | `/auth/login`    | Autentica e retorna o access token         | não  |
| `GET`    | `/auth/me`       | Dados do usuário autenticado               | sim  |
| `POST`   | `/products`      | Cria produto (multipart, com foto)         | sim  |
| `GET`    | `/products`      | Lista paginada (filtro por status + busca) | sim  |
| `GET`    | `/products/:id`  | Detalhe do produto                         | sim  |
| `PATCH`  | `/products/:id`  | Atualiza produto (multipart, com foto)     | sim  |
| `DELETE` | `/products/:id`  | Remove o produto e suas imagens            | sim  |

## Variáveis de ambiente

| Variável                                    | Descrição                          |
| ------------------------------------------- | ---------------------------------- |
| `PORT`                                      | Porta HTTP (default `3000`)        |
| `DATABASE_URL`                              | Conexão PostgreSQL (Prisma)        |
| `S3_ENDPOINT`                               | Endpoint S3 (MinIO/R2)             |
| `S3_REGION`                                 | Região S3                          |
| `S3_BUCKET`                                 | Bucket das imagens                 |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Credenciais S3                     |
| `S3_FORCE_PATH_STYLE`                       | `true` para MinIO, `false` para R2 |
| `JWT_SECRET`                                | Segredo de assinatura do JWT       |
| `JWT_EXPIRES_IN`                            | Expiração do token (ex.: `1d`)     |

## Serviços locais

- PostgreSQL: `localhost:5432`
- MinIO API: `localhost:9000` · Console: `localhost:9001` (credenciais do `.env`)

## Scripts

- `npm run start:dev` — API em watch
- `npm run build` / `npm run start:prod`
- `npm run lint` / `npm run format`
- `npm run prisma:migrate` — aplica migrations (cria/atualiza tabelas)
- `npm run prisma:generate` — regenera o Prisma Client
- `npm run prisma:studio` — abre o Prisma Studio
