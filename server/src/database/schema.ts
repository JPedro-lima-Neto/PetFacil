// Estrutura do banco (SQLite). Segue o modelo de dados do enunciado:
// Usuario (1:N) Compra (N:1) Produto
export const schemaSql = `
CREATE TABLE IF NOT EXISTS usuarios (
  cpf            TEXT PRIMARY KEY,
  nome_completo  TEXT NOT NULL,
  login          TEXT NOT NULL UNIQUE,
  senha_hash     TEXT NOT NULL,
  perfil         TEXT NOT NULL DEFAULT 'CLIENTE'
                 CHECK (perfil IN ('CLIENTE', 'ADMIN'))
);

CREATE TABLE IF NOT EXISTS produtos (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  nome               TEXT NOT NULL,
  preco_atual        REAL NOT NULL CHECK (preco_atual >= 0),
  preco_promocional  REAL CHECK (preco_promocional IS NULL OR preco_promocional >= 0),
  tipo               TEXT NOT NULL,
  descricao          TEXT NOT NULL,
  data_validade      TEXT
);

CREATE TABLE IF NOT EXISTS compras (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_produto   TEXT NOT NULL,
  preco          REAL NOT NULL,
  data_compra    TEXT NOT NULL,
  usuario_cpf    TEXT NOT NULL REFERENCES usuarios(cpf),
  produto_id     INTEGER REFERENCES produtos(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_compras_usuario ON compras(usuario_cpf);
`;
