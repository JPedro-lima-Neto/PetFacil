import { Router } from "express";
import { z } from "zod";

import { db } from "../database/db";
import { autenticar, exigirPerfil } from "../middlewares/autenticacao";
import type { ProdutoRow } from "../types";
import { ErroHttp } from "../utils/erros";
import { produtoParaApi } from "../utils/mapeadores";
import { validar } from "../utils/validacoes";

export const rotasProdutos = Router();

// Todas as rotas de produtos exigem login.
rotasProdutos.use(autenticar);

const produtoSchema = z
  .object({
    nome: z.string().trim().min(1, "Informe o nome."),
    precoAtual: z.number().min(0, "O preço não pode ser negativo."),
    precoPromocional: z
      .number()
      .min(0, "O preço promocional não pode ser negativo.")
      .nullable()
      .optional(),
    tipo: z.string().trim().min(1, "Informe o tipo."),
    descricao: z.string().trim().min(1, "Informe a descrição."),
    dataValidade: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD.")
      .nullable()
      .optional(),
  })
  .refine(
    (p) => p.precoPromocional == null || p.precoPromocional <= p.precoAtual,
    {
      path: ["precoPromocional"],
      message: "O preço promocional não pode ser maior que o preço atual.",
    }
  );

function buscarProduto(id: number): ProdutoRow {
  const produto = db
    .prepare("SELECT * FROM produtos WHERE id = ?")
    .get(id) as ProdutoRow | undefined;

  if (!produto) throw new ErroHttp(404, "Produto não encontrado.");
  return produto;
}

function lerId(valor: string | string[] | undefined): number {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErroHttp(400, "Identificador de produto inválido.");
  }
  return id;
}

// GET /produtos?busca=ração   (RF03)
rotasProdutos.get("/", (req, res) => {
  const busca =
    typeof req.query.busca === "string" ? req.query.busca.trim() : "";

  const linhas = db
    .prepare(
      `SELECT * FROM produtos
       WHERE nome LIKE @termo OR tipo LIKE @termo
       ORDER BY id`
    )
    .all({ termo: `%${busca}%` }) as ProdutoRow[];

  res.json({ produtos: linhas.map(produtoParaApi) });
});

// GET /produtos/:id
rotasProdutos.get("/:id", (req, res) => {
  res.json({ produto: produtoParaApi(buscarProduto(lerId(req.params.id))) });
});

// ---- Somente ADMIN (autorização por perfil) ----

// POST /produtos
rotasProdutos.post("/", exigirPerfil("ADMIN"), (req, res) => {
  const p = validar(produtoSchema, req.body);

  const resultado = db
    .prepare(
      `INSERT INTO produtos
        (nome, preco_atual, preco_promocional, tipo, descricao, data_validade)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      p.nome,
      p.precoAtual,
      p.precoPromocional ?? null,
      p.tipo,
      p.descricao,
      p.dataValidade ?? null
    );

  const criado = buscarProduto(Number(resultado.lastInsertRowid));
  res.status(201).json({ produto: produtoParaApi(criado) });
});

// PUT /produtos/:id
rotasProdutos.put("/:id", exigirPerfil("ADMIN"), (req, res) => {
  const id = lerId(req.params.id);
  buscarProduto(id);
  const p = validar(produtoSchema, req.body);

  db.prepare(
    `UPDATE produtos
     SET nome = ?, preco_atual = ?, preco_promocional = ?,
         tipo = ?, descricao = ?, data_validade = ?
     WHERE id = ?`
  ).run(
    p.nome,
    p.precoAtual,
    p.precoPromocional ?? null,
    p.tipo,
    p.descricao,
    p.dataValidade ?? null,
    id
  );

  res.json({ produto: produtoParaApi(buscarProduto(id)) });
});

// DELETE /produtos/:id
rotasProdutos.delete("/:id", exigirPerfil("ADMIN"), (req, res) => {
  const id = lerId(req.params.id);
  buscarProduto(id);

  db.prepare("DELETE FROM produtos WHERE id = ?").run(id);
  res.status(204).send();
});
