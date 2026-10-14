import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { config } from "../config";
import { schemaSql } from "./schema";

// Usa o SQLite embutido no Node.js (node:sqlite, Node 22.13+).
// Vantagem: não precisa compilar nada nem instalar Visual Studio no Windows.

if (config.dbPath !== ":memory:") {
  mkdirSync(dirname(config.dbPath), { recursive: true });
}

const conexao = new DatabaseSync(config.dbPath);

conexao.exec("PRAGMA journal_mode = WAL;");
conexao.exec("PRAGMA foreign_keys = ON;"); // garante as chaves estrangeiras
conexao.exec(schemaSql);

// Pequeno "adaptador" para o restante do código usar sempre
// db.prepare(...).get/all/run e db.transaction(...).
export const db = {
  prepare(sql: string) {
    const comando = conexao.prepare(sql);

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get: (...parametros: any[]): any => comando.get(...parametros),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      all: (...parametros: any[]): any[] => comando.all(...parametros),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      run: (...parametros: any[]) => comando.run(...parametros),
    };
  },

  // Executa a função dentro de uma transação: se lançar erro, desfaz tudo.
  transaction<A extends unknown[], R>(funcao: (...args: A) => R) {
    return (...args: A): R => {
      conexao.exec("BEGIN");
      try {
        const resultado = funcao(...args);
        conexao.exec("COMMIT");
        return resultado;
      } catch (erro) {
        conexao.exec("ROLLBACK");
        throw erro;
      }
    };
  },
};
