// Teste de ponta a ponta da API. Com o servidor rodando (npm run dev):
//   npm run smoke
import "dotenv/config";

const BASE = process.env.API_URL ?? `http://localhost:${process.env.PORT ?? 3333}`;
const ADMIN_LOGIN = process.env.ADMIN_LOGIN ?? "admin@petfacil.com";
const ADMIN_SENHA = process.env.ADMIN_SENHA ?? "Admin@123";

let falhas = 0;

function checar(descricao: string, condicao: boolean, detalhe?: unknown) {
  if (condicao) {
    console.log(`  ✅ ${descricao}`);
  } else {
    falhas++;
    console.log(`  ❌ ${descricao}`, detalhe ?? "");
  }
}

async function chamar(
  metodo: string,
  caminho: string,
  corpo?: unknown,
  token?: string
) {
  const resposta = await fetch(BASE + caminho, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  const texto = await resposta.text();
  return { status: resposta.status, dados: texto ? JSON.parse(texto) : null };
}

// Gera um CPF válido aleatório (para não repetir entre execuções)
function gerarCpf(): string {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const digito = (nums: number[]) => {
    const soma = nums.reduce((s, n, i) => s + n * (nums.length + 1 - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const d1 = digito(base);
  const d2 = digito([...base, d1]);
  return [...base, d1, d2].join("");
}

async function main() {
  const sufixo = Date.now();
  const email = `teste${sufixo}@email.com`;
  const cpf = gerarCpf();
  const senha = "senha123";

  console.log(`Testando ${BASE}\n`);

  console.log("Cadastro (RF01)");
  let r = await chamar("POST", "/auth/cadastro", {
    nomeCompleto: "A", email: "x", cpf: "111.111.111-11", senha: "1", repetirSenha: "2",
  });
  checar("rejeita dados inválidos (400)", r.status === 400, r);
  r = await chamar("POST", "/auth/cadastro", {
    nomeCompleto: "Cliente Teste", email, cpf, senha, repetirSenha: senha,
  });
  checar("cadastra cliente válido (201)", r.status === 201, r);
  checar("não devolve a senha", !JSON.stringify(r.dados).includes("senha"));
  r = await chamar("POST", "/auth/cadastro", {
    nomeCompleto: "Cliente Teste", email, cpf, senha, repetirSenha: senha,
  });
  checar("rejeita CPF/e-mail duplicado (409)", r.status === 409, r);

  console.log("\nLogin (RF02)");
  r = await chamar("POST", "/auth/login", { login: email, senha: "errada" });
  checar("senha errada => 401", r.status === 401, r);
  r = await chamar("POST", "/auth/login", { login: email, senha });
  checar("login correto => 200 com token", r.status === 200 && !!r.dados.token, r);
  const token: string = r.dados.token;
  r = await chamar("GET", "/auth/me", undefined, token);
  checar("/auth/me retorna o usuário", r.status === 200 && r.dados.usuario.login === email, r);

  console.log("\nProteção por token");
  r = await chamar("GET", "/produtos");
  checar("sem token => 401", r.status === 401, r);
  r = await chamar("GET", "/produtos", undefined, token + "x");
  checar("token adulterado => 401", r.status === 401, r);

  console.log("\nProdutos (RF03)");
  r = await chamar("GET", "/produtos", undefined, token);
  checar("lista produtos", r.status === 200 && r.dados.produtos.length > 0, r);
  const produtos = r.dados.produtos as { id: number; precoAtual: number; precoPromocional: number | null }[];
  r = await chamar("GET", `/produtos/${produtos[0].id}`, undefined, token);
  checar("detalhe de um produto", r.status === 200, r);
  r = await chamar("GET", "/produtos/99999", undefined, token);
  checar("produto inexistente => 404", r.status === 404, r);

  console.log("\nAutorização por perfil");
  const novoProduto = {
    nome: "Petisco Teste", precoAtual: 10, precoPromocional: null,
    tipo: "Petisco", descricao: "Produto de teste", dataValidade: "2030-01-01",
  };
  r = await chamar("POST", "/produtos", novoProduto, token);
  checar("CLIENTE não cria produto => 403", r.status === 403, r);
  r = await chamar("POST", "/auth/login", { login: ADMIN_LOGIN, senha: ADMIN_SENHA });
  checar("login do admin", r.status === 200, r);
  const tokenAdmin: string = r.dados.token;
  r = await chamar("POST", "/produtos", novoProduto, tokenAdmin);
  checar("ADMIN cria produto => 201", r.status === 201, r);
  const idNovo = r.dados.produto?.id;
  r = await chamar("PUT", `/produtos/${idNovo}`, { ...novoProduto, precoAtual: 12, precoPromocional: 9 }, tokenAdmin);
  checar("ADMIN edita produto", r.status === 200 && r.dados.produto.precoAtual === 12, r);
  r = await chamar("DELETE", `/produtos/${idNovo}`, undefined, tokenAdmin);
  checar("ADMIN remove produto => 204", r.status === 204, r);

  console.log("\nPedido e compras (RF07, RF08)");
  r = await chamar("POST", "/pedidos", { itens: [] }, token);
  checar("pedido vazio => 400", r.status === 400, r);
  r = await chamar("POST", "/pedidos", { itens: [{ produtoId: 99999, quantidade: 1 }] }, token);
  checar("produto inexistente no pedido => 404", r.status === 404, r);
  const [a, b] = produtos;
  const unitA = a.precoPromocional ?? a.precoAtual;
  const unitB = b.precoPromocional ?? b.precoAtual;
  r = await chamar("POST", "/pedidos", {
    itens: [{ produtoId: a.id, quantidade: 2 }, { produtoId: b.id, quantidade: 1 }],
  }, token);
  const totalEsperado = Math.round((unitA * 2 + unitB) * 100) / 100;
  checar("pedido válido => 201 e gera 3 compras", r.status === 201 && r.dados.compras.length === 3, r);
  checar("total calculado pelo servidor", r.dados.total === totalEsperado, r.dados.total);
  r = await chamar("GET", "/compras", undefined, token);
  checar("cliente vê só as próprias compras (3)", r.status === 200 && r.dados.compras.length === 3, r);
  r = await chamar("GET", "/compras", undefined, tokenAdmin);
  checar("admin vê as compras de todos", r.status === 200 && r.dados.compras.length >= 3, r);

  console.log("\nAssistente (RF09)");
  r = await chamar("POST", "/assistente", { mensagem: "Quais produtos estão em promoção?" }, token);
  checar("responde sobre promoções", r.status === 200 && typeof r.dados.resposta === "string", r);
  r = await chamar("POST", "/assistente", { mensagem: "Quais produtos estão em promoção?" });
  checar("exige token => 401", r.status === 401, r);

  console.log(falhas === 0 ? "\n🎉 Tudo certo!" : `\n⚠️  ${falhas} verificação(ões) falharam.`);
  process.exit(falhas === 0 ? 0 : 1);
}

main().catch((erro) => {
  console.error("Não foi possível executar o teste. O servidor está rodando?", erro);
  process.exit(1);
});
