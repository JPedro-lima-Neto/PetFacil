# PetFacil

Aplicativo mobile de compras para pet shop desenvolvido em React Native.

O projeto faz parte da Fase 1 da disciplina de Desenvolvimento Mobile e tem como objetivo disponibilizar um protótipo funcional e navegável do PetFacil, utilizando dados simulados (mock), sem integração com back-end ou banco de dados.

## Funcionalidades

- Cadastro de usuário com validação dos campos
- Login simulado
- Catálogo de produtos
- Busca de produtos
- Visualização dos detalhes de cada produto
- Adição de produtos ao carrinho pelo catálogo ou pela tela de detalhes
- Controle de quantidade dos produtos no carrinho
- Remoção de produtos do carrinho
- Cálculo do valor total do pedido
- Finalização do pedido
- Registro simulado das compras
- Assistente virtual com perguntas e respostas simuladas

## Tecnologias utilizadas

- React Native
- Expo
- Expo Router
- TypeScript
- React Hooks
- Context API

## Estrutura do projeto

```text
src/
├── app/          # Telas e navegação da aplicação
├── components/   # Componentes reutilizáveis
├── context/      # Contextos e gerenciamento de estado
├── data/         # Dados mockados dos produtos
└── hooks/        # Hooks utilizados pelo projeto
```

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm
- Expo Go no celular ou um emulador Android/iOS

## Instalação

Clone o repositório:

```bash
git clone https://github.com/JPedro-lima-Neto/PetFacil.git
```

Entre na pasta do projeto:

```bash
cd PetFacil
```

Instale as dependências:

```bash
npm install
```

## Executando o projeto

Execute:

```bash
npx expo start
```

Após iniciar o Expo, você pode:

- Escanear o QR Code utilizando o aplicativo Expo Go
- Pressionar `a` para abrir no emulador Android
- Pressionar `i` para abrir no simulador iOS, quando disponível
- Pressionar `w` para executar a versão web

## Fase 1

Nesta etapa, a aplicação utiliza apenas dados locais e simulados.

Não são utilizados:

- Back-end
- Banco de dados
- Tokens de autenticação
- Persistência remota

A autenticação, os produtos, as compras e as respostas do assistente são simulados de acordo com os requisitos da Fase 1.

## Fluxo principal

```text
Login
  ↓
Cadastro
  ↓
Login
  ↓
Catálogo
  ↓
Detalhes do produto
  ↓
Carrinho
  ↓
Finalização do pedido
```

O assistente virtual também pode ser acessado durante as principais etapas de navegação.

## Integrantes

- Lucas Tertoliano Nóbrega
- José Pedro de Lima Neto

## Disciplina

Desenvolvimento Mobile

Professor: Bruno Rafael Araújo Vasconcelos
