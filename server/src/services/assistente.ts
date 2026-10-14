import { config } from "../config";
import { db } from "../database/db";
import type { ProdutoRow } from "../types";

// ---------------------------------------------------------------------------
// Assistente virtual do PetFácil.
// 1) Se existir ANTHROPIC_API_KEY no .env, usa a API da Anthropic (Claude).
// 2) Caso contrário (ou se a API falhar), usa respostas por regras que
//    consultam os produtos REAIS do banco de dados.
// ---------------------------------------------------------------------------

const moeda = (valor: number) =>
  `R$ ${valor.toFixed(2).replace(".", ",")}`;

const precoFinal = (p: ProdutoRow) => p.preco_promocional ?? p.preco_atual;

function listarProdutos(produtos: ProdutoRow[]): string {
  return produtos
    .map((p) =>
      p.preco_promocional !== null
        ? `• ${p.nome}: de ${moeda(p.preco_atual)} por ${moeda(p.preco_promocional)}`
        : `• ${p.nome}: ${moeda(p.preco_atual)}`
    )
    .join("\n");
}

// minúsculas e sem acentos, para comparar textos com facilidade
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function todosProdutos(): ProdutoRow[] {
  return db.prepare("SELECT * FROM produtos ORDER BY id").all() as ProdutoRow[];
}

const PALAVRAS_IGNORADAS = new Set([
  "para", "qual", "quais", "tem", "voce", "quanto", "custa", "preco",
  "produto", "produtos", "como", "onde", "quero", "tenho", "uma", "umas",
  "uns", "com", "sem", "que", "vcs", "voces",
]);

export function responderPorRegras(mensagem: string): string {
  const texto = normalizar(mensagem);
  const tem = (...palavras: string[]) => palavras.some((p) => texto.includes(p));
  const produtos = todosProdutos();

  if (tem("promocao", "promocoes", "desconto", "oferta", "barato")) {
    const emPromocao = produtos.filter((p) => p.preco_promocional !== null);
    return emPromocao.length > 0
      ? `Estes produtos estão em promoção hoje:\n${listarProdutos(emPromocao)}`
      : "No momento não temos produtos em promoção.";
  }

  if (tem("filhote")) {
    const filhotes = produtos.filter((p) => normalizar(p.nome).includes("filhote"));
    return filhotes.length > 0
      ? `Para filhotes, o ideal é uma ração específica para a fase de crescimento. Temos:\n${listarProdutos(filhotes)}`
      : "Para filhotes, o ideal é uma ração específica para a fase de crescimento. Pergunte ao atendente da loja pela melhor opção.";
  }

  if (tem("finaliz", "fechar pedido", "fazer pedido", "comprar", "como compro")) {
    return "Para finalizar: adicione os produtos ao carrinho, abra o carrinho (🛒) e toque em “Finalizar pedido”. O pagamento é feito no caixa da loja, na retirada.";
  }

  if (tem("retirada", "retirar", "pagamento", "pagar", "caixa")) {
    return "A retirada é feita na loja. Depois de finalizar o pedido, o pagamento é realizado no caixa, no momento em que você retira os produtos.";
  }

  if (tem("remover", "excluir", "tirar", "apagar")) {
    return "No carrinho, toque no ✕ ao lado do produto que deseja remover.";
  }

  if (tem("historico", "minhas compras", "ja comprei", "compras anteriores")) {
    return "Você pode ver tudo o que já comprou na tela “Minhas compras” (ícone 🧾 na lista de produtos).";
  }

  if (tem("validade", "vence", "vencimento")) {
    const comValidade = produtos.filter((p) => p.data_validade !== null);
    return `A validade de cada produto aparece na tela de detalhes. Itens com validade controlada:\n${comValidade
      .map((p) => `• ${p.nome}: ${p.data_validade!.split("-").reverse().join("/")}`)
      .join("\n")}`;
  }

  if (tem("oi", "ola", "bom dia", "boa tarde", "boa noite") && texto.length < 20) {
    return "Olá! 🐾 Posso ajudar com produtos, promoções e pedidos. O que você procura?";
  }

  // Busca por produto: palavras da pergunta que aparecem no nome/tipo/descrição
  const termos = texto
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 3 && !PALAVRAS_IGNORADAS.has(t));

  const encontrados = produtos.filter((p) => {
    const alvo = normalizar(`${p.nome} ${p.tipo} ${p.descricao}`);
    return termos.some((t) => alvo.includes(t.replace(/s$/, "")));
  });

  if (encontrados.length > 0) {
    return `Encontrei estes produtos:\n${listarProdutos(encontrados.slice(0, 5))}`;
  }

  return "Não tenho certeza se entendi 🐾. Posso ajudar com: promoções, rações para filhotes, como finalizar o pedido, retirada e pagamento, ou preço de algum produto.";
}

async function responderComClaude(mensagem: string): Promise<string> {
  const catalogo = listarProdutos(todosProdutos());

  const resposta = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.anthropicApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-5-5",
      max_tokens: 400,
      system:
        "Você é o assistente virtual do PetFácil, um pet shop. Responda em português do Brasil, de forma curta e simpática. " +
        "Use SOMENTE o catálogo abaixo para falar de produtos e preços. O pagamento é feito no caixa da loja, na retirada. " +
        "Se não souber, diga que não sabe e sugira falar com um atendente.\n\nCatálogo:\n" +
        catalogo,
      messages: [{ role: "user", content: mensagem }],
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!resposta.ok) throw new Error(`API respondeu ${resposta.status}`);

  const dados = (await resposta.json()) as {
    content: { type: string; text?: string }[];
  };

  const texto = dados.content
    .filter((bloco) => bloco.type === "text")
    .map((bloco) => bloco.text ?? "")
    .join("\n")
    .trim();

  if (!texto) throw new Error("Resposta vazia");
  return texto;
}

export async function responder(mensagem: string): Promise<string> {
  if (config.anthropicApiKey) {
    try {
      return await responderComClaude(mensagem);
    } catch (erro) {
      console.error("Falha na API do assistente, usando regras:", erro);
    }
  }

  return responderPorRegras(mensagem);
}
