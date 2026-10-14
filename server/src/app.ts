import cors from "cors";
import express from "express";
import helmet from "helmet";

export function criarApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "100kb" }));

  app.get("/saude", (_req, res) => {
    res.json({ status: "ok", servico: "petfacil-server" });
  });

  return app;
}
