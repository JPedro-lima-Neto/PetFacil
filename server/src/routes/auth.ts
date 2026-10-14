import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";

import { config } from "../config";
import { db } from "../database/db";
import { autenticar } from "../middlewares/autenticacao";
import type { UsuarioRow } from "../types";
import { ErroHttp } from "../utils/erros";
import { usuarioParaApi } from "../utils/mapeadores";
import { cadastroSchema, loginSchema, validar } from "../utils/validacoes";

export const rotasAuth = Router();

const CUSTO_BCRYPT = 10;

// Hash falso usado quando o login não existe, para que o tempo de resposta
// seja parecido e não revele quais e-mails estão cadastrados.
const HASH_FALSO = bcrypt.hashSync("senha-falsa", CUSTO_BCRYPT);

// POST /auth/cadastro  (RF01)
rotasAuth.post("/cadastro", async (req, res) => {
  const dados = validar(cadastroSchema, req.body);

  const cpfExistente = db
    .prepare("SELECT 1 FROM usuarios WHERE cpf = ?")
    .get(dados.cpf);
  if (cpfExistente) {
    throw new ErroHttp(409, "Este CPF já está cadastrado.", {
      cpf: "Este CPF já está cadastrado.",
    });
  }

  const loginExistente = db
    .prepare("SELECT 1 FROM usuarios WHERE login = ?")
    .get(dados.email);
  if (loginExistente) {
    throw new ErroHttp(409, "Este e-mail já está cadastrado.", {
      email: "Este e-mail já está cadastrado.",
    });
  }

  // A senha NUNCA é guardada: só o hash (bcrypt, com "salt" automático).
  const senhaHash = await bcrypt.hash(dados.senha, CUSTO_BCRYPT);

  db.prepare(
    `INSERT INTO usuarios (cpf, nome_completo, login, senha_hash, perfil)
     VALUES (?, ?, ?, ?, 'CLIENTE')`
  ).run(dados.cpf, dados.nomeCompleto, dados.email, senhaHash);

  const criado = db
    .prepare("SELECT * FROM usuarios WHERE cpf = ?")
    .get(dados.cpf) as UsuarioRow;

  res.status(201).json({ usuario: usuarioParaApi(criado) });
});

// POST /auth/login  (RF02)
rotasAuth.post("/login", async (req, res) => {
  const { login, senha } = validar(loginSchema, req.body);

  const usuario = db
    .prepare("SELECT * FROM usuarios WHERE login = ?")
    .get(login) as UsuarioRow | undefined;

  const senhaConfere = await bcrypt.compare(
    senha,
    usuario?.senha_hash ?? HASH_FALSO
  );

  if (!usuario || !senhaConfere) {
    // Mensagem genérica: não diz se foi o login ou a senha que errou.
    throw new ErroHttp(401, "Login ou senha inválidos.");
  }

  const token = jwt.sign({ perfil: usuario.perfil }, config.jwtSecret, {
    subject: usuario.cpf,
    algorithm: "HS256",
    expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
  });

  res.json({ token, usuario: usuarioParaApi(usuario) });
});

// GET /auth/me  -> dados do usuário dono do token (usado ao reabrir o app)
rotasAuth.get("/me", autenticar, (req, res) => {
  res.json({ usuario: req.usuario });
});
