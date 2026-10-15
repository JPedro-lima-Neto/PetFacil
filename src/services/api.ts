import Constants from "expo-constants";
import { Platform } from "react-native";

import type { Compra, DadosCadastro, Produto, Usuario } from "../types";

// Endereço do servidor (porta 3333). Ordem de decisão:
// 1) EXPO_PUBLIC_API_URL no arquivo .env (manual, tem prioridade);
// 2) o mesmo computador que está servindo o app (Metro): o Expo informa o IP
//    dele em "hostUri" (ex.: 192.168.0.15:8081), então o celular físico
//    encontra a API sem configurar nada;
// 3) padrão: emulador Android = 10.0.2.2, iOS/web = localhost.
const PORTA_API = 3333;

function descobrirUrlDaApi(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  const ehLocal = !host || host === "localhost" || host === "127.0.0.1";
  const ehTunel = !!host && host.includes("exp.direct");

  if (!ehLocal && !ehTunel) return `http://${host}:${PORTA_API}`;

  return Platform.OS === "android"
    ? `http://10.0.2.2:${PORTA_API}`
    : `http://localhost:${PORTA_API}`;
}

export const API_URL = descobrirUrlDaApi();

export class ApiError extends Error {
  constructor(
    mensagem: string,
    public status: number,
    public campos?: Record<string, string>
  ) {
    super(mensagem);
  }
}

// O token fica em memória para ser anexado a cada requisição.
let tokenAtual: string | null = null;
let aoSessaoExpirar: (() => void) | null = null;

export function definirToken(token: string | null) {
  tokenAtual = token;
}

export function definirAoSessaoExpirar(callback: (() => void) | null) {
  aoSessaoExpirar = callback;
}

type Opcoes = {
  metodo?: "GET" | "POST" | "PUT" | "DELETE";
  corpo?: unknown;
  autenticada?: boolean; // false em login/cadastro
};

async function requisicao<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const { metodo = "GET", corpo, autenticada = true } = opcoes;

  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 10000);

  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        ...(autenticada && tokenAtual
          ? { Authorization: `Bearer ${tokenAtual}` }
          : {}),
      },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: controlador.signal,
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e se a API está rodando.",
      0
    );
  } finally {
    clearTimeout(timeout);
  }

  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    // Token vencido/inválido em uma rota protegida: encerra a sessão.
    if (resposta.status === 401 && autenticada) aoSessaoExpirar?.();

    throw new ApiError(
      dados?.erro ?? "Erro inesperado no servidor.",
      resposta.status,
      dados?.campos
    );
  }

  return dados as T;
}

export const api = {
  login: (login: string, senha: string) =>
    requisicao<{ token: string; usuario: Usuario }>("/auth/login", {
      metodo: "POST",
      corpo: { login, senha },
      autenticada: false,
    }),

  cadastrar: (dados: DadosCadastro) =>
    requisicao<{ usuario: Usuario }>("/auth/cadastro", {
      metodo: "POST",
      corpo: dados,
      autenticada: false,
    }),

  eu: () => requisicao<{ usuario: Usuario }>("/auth/me"),

  listarProdutos: () =>
    requisicao<{ produtos: Produto[] }>("/produtos").then((r) => r.produtos),

  obterProduto: (id: number) =>
    requisicao<{ produto: Produto }>(`/produtos/${id}`).then((r) => r.produto),

  criarPedido: (itens: { produtoId: number; quantidade: number }[]) =>
    requisicao<{ compras: Compra[]; total: number }>("/pedidos", {
      metodo: "POST",
      corpo: { itens },
    }),

  listarCompras: () =>
    requisicao<{ compras: Compra[] }>("/compras").then((r) => r.compras),

  perguntarAssistente: (mensagem: string) =>
    requisicao<{ resposta: string }>("/assistente", {
      metodo: "POST",
      corpo: { mensagem },
    }).then((r) => r.resposta),
};
