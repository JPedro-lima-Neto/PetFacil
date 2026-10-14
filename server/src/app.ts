import cors from "cors";
import express from "express";
import helmet from "helmet";

import { rotaNaoEncontrada, tratarErros } from "./middlewares/erros";
import { limitadorAuth } from "./middlewares/limitador";
import { rotasAssistente } from "./routes/assistente";
import { rotasAuth } from "./routes/auth";
import { rotasCompras, rotasPedidos } from "./routes/pedidos";
import { rotasProdutos } from "./routes/produtos";

export function criarApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "100kb" }));

  app.get("/saude", (_req, res) => {
    res.json({ status: "ok", servico: "petfacil-server" });
  });

  app.use("/auth/login", limitadorAuth);
  app.use("/auth/cadastro", limitadorAuth);
  app.use("/auth", rotasAuth);
  app.use("/produtos", rotasProdutos);
  app.use("/pedidos", rotasPedidos);
  app.use("/compras", rotasCompras);
  app.use("/assistente", rotasAssistente);

  // Sempre por último
  app.use(rotaNaoEncontrada);
  app.use(tratarErros);

  return app;
}
