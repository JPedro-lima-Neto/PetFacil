import { criarApp } from "./app";
import { config } from "./config";
import { executarSeed } from "./database/seed";

// Importar o seed já abre o banco e cria as tabelas (via database/db.ts).
executarSeed();

const app = criarApp();

// "0.0.0.0" permite que o celular/emulador acesse o servidor pela rede.
app.listen(config.porta, "0.0.0.0", () => {
  console.log(`PetFácil API rodando em http://localhost:${config.porta}`);
});
