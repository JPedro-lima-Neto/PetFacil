import type { ZodError } from "zod";

// Erro com status HTTP, usado para interromper uma rota com uma resposta clara.
export class ErroHttp extends Error {
  constructor(
    public status: number,
    mensagem: string,
    public campos?: Record<string, string>
  ) {
    super(mensagem);
  }
}

// Transforma o erro do Zod em { campo: "mensagem" }.
export function errosPorCampo(erro: ZodError): Record<string, string> {
  const campos: Record<string, string> = {};

  for (const problema of erro.issues) {
    const campo = String(problema.path[0] ?? "corpo");
    if (campos[campo]) continue;

    campos[campo] =
      problema.code === "invalid_type"
        ? "Campo obrigatório ou com tipo inválido."
        : problema.message;
  }

  return campos;
}
