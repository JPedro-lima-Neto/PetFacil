import { Router } from "express";
import { z } from "zod";

import { autenticar } from "../middlewares/autenticacao";
import { responder } from "../services/assistente";
import { validar } from "../utils/validacoes";

export const rotasAssistente = Router();

rotasAssistente.use(autenticar);

const mensagemSchema = z.object({
  mensagem: z
    .string()
    .trim()
    .min(1, "Digite uma mensagem.")
    .max(500, "A mensagem pode ter no máximo 500 caracteres."),
});

// POST /assistente  (RF09)
rotasAssistente.post("/", async (req, res) => {
  const { mensagem } = validar(mensagemSchema, req.body);
  const resposta = await responder(mensagem);
  res.json({ resposta });
});
