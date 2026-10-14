import { z } from "zod";

import { ErroHttp, errosPorCampo } from "./erros";

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

// Valida CPF conferindo os dois dígitos verificadores.
export function validarCPF(cpfInformado: string): boolean {
  const cpf = apenasDigitos(cpfInformado);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // 111.111.111-11 etc.

  const calcularDigito = (quantidade: number) => {
    let soma = 0;
    for (let i = 0; i < quantidade; i++) {
      soma += Number(cpf[i]) * (quantidade + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return (
    calcularDigito(9) === Number(cpf[9]) &&
    calcularDigito(10) === Number(cpf[10])
  );
}

// Regra do enunciado: a senha é obrigatória. Para endurecer a política,
// basta aumentar este número (ex.: 8).
export const SENHA_TAMANHO_MINIMO = 1;
// O bcrypt só considera os 72 primeiros bytes da senha.
export const SENHA_TAMANHO_MAXIMO = 72;

export const cadastroSchema = z
  .object({
    nomeCompleto: z
      .string()
      .trim()
      .min(2, "Informe um nome com pelo menos 2 caracteres."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Informe um e-mail válido."),
    cpf: z
      .string()
      .refine(validarCPF, "Informe um CPF válido.")
      .transform(apenasDigitos),
    senha: z
      .string()
      .min(SENHA_TAMANHO_MINIMO, "Informe uma senha.")
      .max(SENHA_TAMANHO_MAXIMO, "A senha pode ter no máximo 72 caracteres."),
    repetirSenha: z.string().min(1, "Repita a senha."),
  })
  .refine((dados) => dados.senha === dados.repetirSenha, {
    path: ["repetirSenha"],
    message: "As senhas não são iguais.",
  });

export const loginSchema = z.object({
  login: z.string().trim().toLowerCase().min(1, "Informe o login."),
  senha: z.string().min(1, "Informe a senha."),
});

// Valida um corpo com um schema Zod e lança ErroHttp 400 se for inválido.
export function validar<T extends z.ZodType>(
  schema: T,
  dados: unknown
): z.output<T> {
  const resultado = schema.safeParse(dados ?? {});

  if (!resultado.success) {
    const campos = errosPorCampo(resultado.error);
    const primeira = Object.values(campos)[0] ?? "Dados inválidos.";
    throw new ErroHttp(400, primeira, campos);
  }

  return resultado.data;
}
