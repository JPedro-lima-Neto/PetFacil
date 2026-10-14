import "dotenv/config";

function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(
      `Variável de ambiente ${nome} não definida. Copie ".env.example" para ".env".`
    );
  }
  return valor;
}

export const config = {
  porta: Number(process.env.PORT ?? 3333),
  jwtSecret: obrigatoria("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "2h",
  dbPath: process.env.DB_PATH ?? "./data/petfacil.db",
  admin: {
    cpf: process.env.ADMIN_CPF ?? "11144477735",
    nome: process.env.ADMIN_NOME ?? "Administrador PetFácil",
    login: (process.env.ADMIN_LOGIN ?? "admin@petfacil.com").toLowerCase(),
    senha: process.env.ADMIN_SENHA ?? "Admin@123",
  },
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
};
