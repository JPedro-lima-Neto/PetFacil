import { networkInterfaces } from "node:os";

import { criarApp } from "./app";
import { config } from "./config";
import { executarSeed } from "./database/seed";

// Importar o seed já abre o banco e cria as tabelas (via database/db.ts).
executarSeed();

const app = criarApp();

// "0.0.0.0" permite que o celular/emulador acesse o servidor pela rede.
app.listen(config.porta, "0.0.0.0", () => {
  console.log(`PetFácil API rodando em http://localhost:${config.porta}`);

  // Endereços para testar no celular (abra no navegador do celular: /saude)
  for (const lista of Object.values(networkInterfaces())) {
    for (const rede of lista ?? []) {
      if (rede.family === "IPv4" && !rede.internal) {
        console.log(`Na rede local:  http://${rede.address}:${config.porta}`);
      }
    }
  }
});
