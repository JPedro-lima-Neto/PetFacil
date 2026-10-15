import type { DadosCadastro } from "../types";

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validarCPF(cpfInformado: string): boolean {
  const cpf = cpfInformado.replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

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

export type ErrosCadastro = Partial<Record<keyof DadosCadastro, string>>;

export function validarCadastro(dados: DadosCadastro): ErrosCadastro {
  const erros: ErrosCadastro = {};

  if (dados.nomeCompleto.trim().length < 2) {
    erros.nomeCompleto = "Informe um nome com pelo menos 2 caracteres.";
  }

  if (!dados.email.trim()) {
    erros.email = "Informe o e-mail.";
  } else if (!validarEmail(dados.email)) {
    erros.email = "Informe um e-mail válido.";
  }

  if (!dados.cpf.trim()) {
    erros.cpf = "Informe o CPF.";
  } else if (!validarCPF(dados.cpf)) {
    erros.cpf = "CPF inválido.";
  }

  if (!dados.senha) {
    erros.senha = "Informe uma senha.";
  }

  if (!dados.repetirSenha) {
    erros.repetirSenha = "Repita a senha.";
  } else if (dados.senha !== dados.repetirSenha) {
    erros.repetirSenha = "As senhas não são iguais.";
  }

  return erros;
}
