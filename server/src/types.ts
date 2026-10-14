export type Perfil = "CLIENTE" | "ADMIN";

// Linhas como estão no banco (snake_case)
export type UsuarioRow = {
  cpf: string;
  nome_completo: string;
  login: string;
  senha_hash: string;
  perfil: Perfil;
};

export type ProdutoRow = {
  id: number;
  nome: string;
  preco_atual: number;
  preco_promocional: number | null;
  tipo: string;
  descricao: string;
  data_validade: string | null;
};

export type CompraRow = {
  id: number;
  nome_produto: string;
  preco: number;
  data_compra: string;
  usuario_cpf: string;
  produto_id: number | null;
};

// Usuário que o middleware de autenticação anexa à requisição
export type UsuarioAutenticado = {
  cpf: string;
  nomeCompleto: string;
  login: string;
  perfil: Perfil;
};
