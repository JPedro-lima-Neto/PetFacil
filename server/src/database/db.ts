import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { config } from "../config";
import { schemaSql } from "./schema";

if (config.dbPath !== ":memory:") {
  mkdirSync(dirname(config.dbPath), { recursive: true });
}

export const db = new Database(config.dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON"); // garante as chaves estrangeiras
db.exec(schemaSql);
