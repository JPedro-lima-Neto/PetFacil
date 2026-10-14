import bcrypt from "bcryptjs";

import { config } from "../config";
import { db } from "./db";

const produtosIniciais = [
  {
    nome: "Ração Premium para Cães",
    precoAtual: 89.9,
    precoPromocional: 74.9,
    tipo: "Ração",
    descricao:
      "Ração completa para cães adultos, desenvolvida para uma alimentação equilibrada e saborosa.",
    dataValidade: "2027-12-15",
  },
  {
    nome: "Ração Premium para Gatos",
    precoAtual: 79.9,
    precoPromocional: 69.9,
    tipo: "Ração",
    descricao:
      "Alimento completo para gatos adultos, com nutrientes essenciais para o dia a dia.",
    dataValidade: "2027-11-20",
  },
  {
    nome: "Ração para Filhotes",
    precoAtual: 94.9,
    precoPromocional: null,
    tipo: "Ração",
    descricao:
      "Ração específica para filhotes em fase de crescimento, rica em proteínas e cálcio.",
    dataValidade: "2027-10-30",
  },
  {
    nome: "Mordedor para Cães",
    precoAtual: 24.9,
    precoPromocional: null,
    tipo: "Brinquedo",
    descricao:
      "Brinquedo resistente para diversão e enriquecimento da rotina do seu cão.",
    dataValidade: null,
  },
  {
    nome: "Bolinha para Gatos",
    precoAtual: 16.9,
    precoPromocional: 12.9,
    tipo: "Brinquedo",
    descricao:
      "Bolinha leve e divertida para estimular brincadeiras e atividades do seu gato.",
    dataValidade: null,
  },
  {
    nome: "Cama Pet Confort",
    precoAtual: 119.9,
    precoPromocional: 99.9,
    tipo: "Cama",
    descricao:
      "Cama macia e confortável para proporcionar um espaço aconchegante para o seu pet.",
    dataValidade: null,
  },
  {
    nome: "Toca para Gatos",
    precoAtual: 109.9,
    precoPromocional: null,
    tipo: "Cama",
    descricao:
      "Toca confortável que oferece um ambiente reservado e aconchegante para gatos.",
    dataValidade: null,
  },
  {
    nome: "Cortador de Unhas Pet",
    precoAtual: 29.9,
    precoPromocional: 24.9,
    tipo: "Acessório",
    descricao:
      "Cortador de unhas desenvolvido para facilitar os cuidados básicos com cães e gatos.",
    dataValidade: null,
  },
  {
    nome: "Escova Removedora de Pelos",
    precoAtual: 39.9,
    precoPromocional: null,
    tipo: "Acessório",
    descricao:
      "Escova para auxiliar na remoção de pelos soltos e nos cuidados com a pelagem.",
    dataValidade: null,
  },
  {
    nome: "Shampoo Neutro para Pets",
    precoAtual: 32.9,
    precoPromocional: 27.9,
    tipo: "Higiene",
    descricao:
      "Shampoo suave, de pH neutro, indicado para banhos frequentes em cães e gatos.",
    dataValidade: "2028-03-10",
  },
];

export function executarSeed() {
  const { total } = db
    .prepare("SELECT COUNT(*) AS total FROM produtos")
    .get() as { total: number };

  if (total === 0) {
    const inserir = db.prepare(
      `INSERT INTO produtos
        (nome, preco_atual, preco_promocional, tipo, descricao, data_validade)
       VALUES (@nome, @precoAtual, @precoPromocional, @tipo, @descricao, @dataValidade)`
    );

    const inserirTodos = db.transaction((lista: typeof produtosIniciais) => {
      for (const produto of lista) inserir.run(produto);
    });

    inserirTodos(produtosIniciais);
    console.log(`Seed: ${produtosIniciais.length} produtos inseridos.`);
  }

  const admin = db
    .prepare("SELECT cpf FROM usuarios WHERE login = ?")
    .get(config.admin.login);

  if (!admin) {
    const senhaHash = bcrypt.hashSync(config.admin.senha, 10);

    db.prepare(
      `INSERT INTO usuarios (cpf, nome_completo, login, senha_hash, perfil)
       VALUES (?, ?, ?, ?, 'ADMIN')`
    ).run(config.admin.cpf, config.admin.nome, config.admin.login, senhaHash);

    console.log(`Seed: administrador criado (${config.admin.login}).`);
  }
}
