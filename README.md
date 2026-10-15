# PetFácil

Aplicativo mobile de compras para pet shop, com recomendações e assistente virtual.
Projeto da disciplina de Desenvolvimento Mobile (Prof. Bruno Rafael Araújo Vasconcelos).

- **Fase 1:** app React Native com dados simulados (mock).
- **Fase 2 (esta versão):** o mesmo app agora conectado a um **servidor**, com **banco de dados**,
  **autenticação e autorização com tokens (JWT)** e **senhas criptografadas (bcrypt)**.

## Arquitetura

```text
┌────────────────────┐   HTTP + JSON    ┌──────────────────────────┐   SQL   ┌──────────────┐
│  App (Expo / RN)   │ ───────────────► │ API (Node + Express)     │ ──────► │ SQLite       │
│  token no          │  Authorization:  │ valida JWT, perfis,      │         │ usuarios     │
│  SecureStore       │  Bearer <token>  │ regras e senhas (bcrypt) │         │ produtos     │
└────────────────────┘                  └──────────────────────────┘         │ compras      │
                                                                             └──────────────┘
```

| Camada | Tecnologias |
|---|---|
| App | React Native, Expo, Expo Router, TypeScript, Context API, expo-secure-store |
| Servidor | Node.js, Express, TypeScript, Zod (validação), JWT (jsonwebtoken), bcryptjs |
| Banco | SQLite (`node:sqlite`, embutido no Node.js) |

## Estrutura

```text
PetFacil/
├── src/                 # APP
│   ├── app/             # telas (Expo Router): login, cadastro, produtos, detalhes, carrinho, compras, assistente, sucesso
│   ├── components/      # Botao, CampoTexto, AssistenteButton
│   ├── context/         # AuthContext (sessão/token) e CarrinhoContext
│   ├── services/        # api.ts (cliente HTTP) e armazenamentoToken.ts
│   ├── utils/           # validações, formatação, alertas
│   ├── constants/       # cores
│   └── types/
└── server/              # API
    ├── src/
    │   ├── database/    # schema, conexão e seed
    │   ├── middlewares/ # autenticação (JWT), perfis, erros, limite de tentativas
    │   ├── routes/      # auth, produtos, pedidos/compras, assistente
    │   ├── services/    # assistente virtual
    │   └── utils/
    └── scripts/smoke.ts # teste automático de ponta a ponta
```

## Como executar

Pré-requisitos: **Node.js 22.13 ou superior** (o servidor usa o SQLite embutido do Node, sem precisar compilar nada) e Expo Go (celular) ou um emulador.

### 1. Servidor

```bash
cd server
npm install
cp .env.example .env      # (Windows: copy .env.example .env) e troque o JWT_SECRET
npm run dev
```

A API sobe em `http://localhost:3333`. Na primeira execução o banco é criado e populado com 10 produtos e
uma conta de administrador (`admin@petfacil.com` / `Admin@123`, definidos no `.env`).

Teste automático (com o servidor rodando): `npm run smoke`

### 2. App

```bash
# na raiz do projeto
npm install
npx expo start
```

- **Emulador Android:** funciona sem configuração (usa `10.0.2.2`).
- **Simulador iOS / navegador:** funciona sem configuração (`localhost`).
- **Celular físico (Expo Go):** funciona sem configuração: o app descobre o IP do computador pelo Expo. Celular e computador precisam estar na **mesma rede Wi-Fi** e o Windows deve permitir o Node.js na rede privada (firewall). Se necessário, force o endereço criando um `.env` na raiz (veja `.env.example`) e reinicie com `npx expo start -c`.

## Endpoints

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/cadastro` | público | Cria conta (valida nome, e-mail, CPF, senha) |
| POST | `/auth/login` | público | Retorna o token JWT |
| GET | `/auth/me` | autenticado | Dados do usuário do token |
| GET | `/produtos`, `/produtos/:id` | autenticado | Catálogo |
| POST/PUT/DELETE | `/produtos`, `/produtos/:id` | **ADMIN** | Gerência de produtos |
| POST | `/pedidos` | autenticado | Finaliza o pedido e registra uma compra por unidade |
| GET | `/compras` | autenticado | Cliente: as suas. Admin: todas |
| POST | `/assistente` | autenticado | Assistente virtual |

## Segurança implementada

- **Senhas criptografadas:** só o hash bcrypt é salvo; a senha nunca é armazenada nem devolvida.
- **Autenticação:** login devolve um JWT (HS256, expira em 2h) enviado no cabeçalho `Authorization: Bearer`.
- **Autorização:** perfis `CLIENTE` e `ADMIN`; criar/editar/remover produto exige `ADMIN`;
  cada cliente só vê as próprias compras.
- **Preço no servidor:** o app envia apenas `produtoId` e `quantidade`; o valor é lido do banco.
- **Validação dupla:** regras do cadastro (nome, e-mail, CPF com dígitos verificadores, senha) no app
  (tempo real) e no servidor (Zod).
- **Outros:** `helmet`, limite de tentativas em login/cadastro, mensagem genérica em erro de login,
  token do app guardado no SecureStore, rotas privadas protegidas no app (`Stack.Protected`).

## Assistente virtual

`POST /assistente` responde com regras que consultam os produtos reais do banco (promoções, filhotes,
preços, retirada, etc.). Se `ANTHROPIC_API_KEY` estiver definida em `server/.env`, o servidor usa a API da
Anthropic (Claude) com o catálogo como contexto, e volta para as regras caso a API falhe.
A chave fica **somente no servidor**.

## Integrantes

- Lucas Tertoliano Nóbrega
- José Pedro de Lima Neto
