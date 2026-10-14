import type { NextFunction, Request, Response } from "express";

import { ErroHttp } from "../utils/erros";

export function rotaNaoEncontrada(_req: Request, res: Response) {
  res.status(404).json({ erro: "Rota não encontrada." });
}

// Middleware final: transforma qualquer erro em uma resposta JSON padronizada.
export function tratarErros(
  erro: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (erro instanceof ErroHttp) {
    res.status(erro.status).json({ erro: erro.message, campos: erro.campos });
    return;
  }

  // JSON malformado enviado pelo cliente
  if (
    typeof erro === "object" &&
    erro !== null &&
    (erro as { type?: string }).type === "entity.parse.failed"
  ) {
    res.status(400).json({ erro: "JSON inválido." });
    return;
  }

  console.error(erro);
  res.status(500).json({ erro: "Erro interno do servidor." });
}
