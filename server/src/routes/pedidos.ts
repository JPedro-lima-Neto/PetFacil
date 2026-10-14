import { Router } from "express";
import { z } from "zod";

import { db } from "../database/db";
import { autenticar } from "../middlewares/autenticacao";
import type { CompraRow, ProdutoRow } from "../types";
import { ErroHttp } from "../utils/erros";
import { compraParaApi } from "../utils/mapeadores";
import { validar } from "../utils/validacoes";

export const rotasPedidos = Router();
export const rotasCompras = Router();

rotasPedidos.use(autenticar);
rotasCompras.use(autenticar);

const pedidoSchema = z.object({
  itens: z
    .array(
      z.object({
        produtoId: z.number().int().positive(),
        quantidade: z.number().int().min(1).max(99),
      })
    )
    .min(1, "O pedido precisa ter ao menos um item."),
});

const arredondar = (valor: number) => Math.round(valor * 100) / 100;

// POST /pedidos  (RF07 + RF08)
// O cliente envia apenas { produtoId, quantidade }. O PREÇO é sempre lido do
// banco: o app nunca decide quanto o produto custa.
// Para cada unidade comprada é gerado um registro de Compra.
rotasPedidos.post("/", (req, res) => {
  const { itens } = validar(pedidoSchema, req.body);
  const cpf = req.usuario!.cpf;

  const registrarPedido = db.transaction(() => {
    const dataCompra = new Date().toISOString();
    const criadas: CompraRow[] = [];

    const buscar = db.prepare("SELECT * FROM produtos WHERE id = ?");
    const inserir = db.prepare(
      `INSERT INTO compras (nome_produto, preco, data_compra, usuario_cpf, produto_id)
       VALUES (?, ?, ?, ?, ?)`
    );
    const lerCompra = db.prepare("SELECT * FROM compras WHERE id = ?");

    for (const item of itens) {
      const produto = buscar.get(item.produtoId) as ProdutoRow | undefined;

      if (!produto) {
        // Lançar o erro dentro da transação desfaz tudo (rollback).
        throw new ErroHttp(
          404,
          `Produto ${item.produtoId} não encontrado. Atualize o catálogo.`
        );
      }

      const preco = produto.preco_promocional ?? produto.preco_atual;

      for (let i = 0; i < item.quantidade; i++) {
        const r = inserir.run(produto.nome, preco, dataCompra, cpf, produto.id);
        criadas.push(lerCompra.get(r.lastInsertRowid) as CompraRow);
      }
    }

    return criadas;
  });

  const criadas = registrarPedido();
  const total = arredondar(criadas.reduce((soma, c) => soma + c.preco, 0));

  res.status(201).json({
    compras: criadas.map((c) => compraParaApi(c)),
    total,
  });
});

// GET /compras
// CLIENTE: vê só as próprias compras. ADMIN: vê as compras de todos.
rotasCompras.get("/", (req, res) => {
  const usuario = req.usuario!;
  const ehAdmin = usuario.perfil === "ADMIN";

  const linhas = (
    ehAdmin
      ? db.prepare("SELECT * FROM compras ORDER BY id DESC").all()
      : db
          .prepare("SELECT * FROM compras WHERE usuario_cpf = ? ORDER BY id DESC")
          .all(usuario.cpf)
  ) as CompraRow[];

  res.json({ compras: linhas.map((c) => compraParaApi(c, ehAdmin)) });
});
