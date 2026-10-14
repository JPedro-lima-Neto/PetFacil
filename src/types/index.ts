export type Perfil = "CLIENTE" | "ADMIN";

export type Usuario = {
  cpf: string;
  nomeCompleto: string;
  login: string;
  perfil: Perfil;
};

export type Produto = {
  id: number;
  nome: string;
  precoAtual: number;
  precoPromocional: number | null;
  tipo: string;
  descricao: string;
  dataValidade: string | null; // "AAAA-MM-DD" ou null
};

export type Compra = {
  id: number;
  nomeProduto: string;
  preco: number;
  dataCompra: string; // ISO 8601
};

export type DadosCadastro = {
  nomeCompleto: string;
  email: string;
  cpf: string;
  senha: string;
  repetirSenha: string;
};
