import type {
  CompraRow,
  ProdutoRow,
  UsuarioAutenticado,
  UsuarioRow,
} from "../types";

// Converte as linhas do banco (snake_case) para o formato da API (camelCase).
// Repare que "senha_hash" NUNCA é exposta.

export function usuarioParaApi(row: UsuarioRow): UsuarioAutenticado {
  return {
    cpf: row.cpf,
    nomeCompleto: row.nome_completo,
    login: row.login,
    perfil: row.perfil,
  };
}

export function produtoParaApi(row: ProdutoRow) {
  return {
    id: row.id,
    nome: row.nome,
    precoAtual: row.preco_atual,
    precoPromocional: row.preco_promocional,
    tipo: row.tipo,
    descricao: row.descricao,
    dataValidade: row.data_validade,
  };
}

export function compraParaApi(row: CompraRow, incluirUsuario = false) {
  return {
    id: row.id,
    nomeProduto: row.nome_produto,
    preco: row.preco,
    dataCompra: row.data_compra,
    ...(incluirUsuario ? { usuarioCpf: row.usuario_cpf } : {}),
  };
}
