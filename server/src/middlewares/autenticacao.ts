import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "../config";
import { db } from "../database/db";
import type { Perfil, UsuarioAutenticado, UsuarioRow } from "../types";
import { ErroHttp } from "../utils/erros";
import { usuarioParaApi } from "../utils/mapeadores";

// Acrescenta "req.usuario" ao tipo Request do Express.
declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

// AUTENTICAÇÃO: "quem é você?" -> valida o token JWT enviado no cabeçalho
//   Authorization: Bearer <token>
export function autenticar(req: Request, _res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith("Bearer ")) {
    throw new ErroHttp(401, "Token não informado.");
  }

  const token = cabecalho.slice("Bearer ".length).trim();

  let cpf: string;

  try {
    const payload = jwt.verify(token, config.jwtSecret, {
      algorithms: ["HS256"],
    });

    if (typeof payload === "string" || !payload.sub) {
      throw new Error("payload inválido");
    }

    cpf = payload.sub;
  } catch {
    throw new ErroHttp(401, "Token inválido ou expirado.");
  }

  // O perfil é lido do banco (e não do token), então mudanças de perfil
  // e exclusão de usuários valem imediatamente.
  const usuario = db
    .prepare("SELECT * FROM usuarios WHERE cpf = ?")
    .get(cpf) as UsuarioRow | undefined;

  if (!usuario) {
    throw new ErroHttp(401, "Usuário do token não existe mais.");
  }

  req.usuario = usuarioParaApi(usuario);
  next();
}

// AUTORIZAÇÃO: "o que você pode fazer?" -> exige um dos perfis informados.
export function exigirPerfil(...perfis: Perfil[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.usuario || !perfis.includes(req.usuario.perfil)) {
      throw new ErroHttp(403, "Você não tem permissão para esta ação.");
    }
    next();
  };
}
