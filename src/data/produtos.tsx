export type Produto = {
  id: number;
  nome: string;
  precoAtual: number;
  precoPromocional: number | null;
  tipo: string;
  descricao: string;
  dataValidade: string;
  emoji: string;
};

export const produtos: Produto[] = [
  {
    id: 1,
    nome: "Ração Premium para Cães",
    precoAtual: 89.9,
    precoPromocional: 74.9,
    tipo: "Ração",
    descricao:
      "Ração completa para cães adultos, desenvolvida para uma alimentação equilibrada e saborosa.",
    dataValidade: "15/12/2027",
    emoji: "🐶",
  },
  {
    id: 2,
    nome: "Ração Premium para Gatos",
    precoAtual: 79.9,
    precoPromocional: 69.9,
    tipo: "Ração",
    descricao:
      "Alimento completo para gatos adultos, com nutrientes essenciais para o dia a dia.",
    dataValidade: "20/11/2027",
    emoji: "🐱",
  },
  {
    id: 3,
    nome: "Mordedor para Cães",
    precoAtual: 24.9,
    precoPromocional: null,
    tipo: "Brinquedo",
    descricao:
      "Brinquedo resistente para diversão e enriquecimento da rotina do seu cão.",
    dataValidade: "Não se aplica",
    emoji: "🦴",
  },
  {
    id: 4,
    nome: "Bolinha para Gatos",
    precoAtual: 16.9,
    precoPromocional: 12.9,
    tipo: "Brinquedo",
    descricao:
      "Bolinha leve e divertida para estimular brincadeiras e atividades do seu gato.",
    dataValidade: "Não se aplica",
    emoji: "🧶",
  },
  {
    id: 5,
    nome: "Cama Pet Confort",
    precoAtual: 119.9,
    precoPromocional: 99.9,
    tipo: "Cama",
    descricao:
      "Cama macia e confortável para proporcionar um espaço aconchegante para o seu pet.",
    dataValidade: "Não se aplica",
    emoji: "🛏️",
  },
  {
    id: 6,
    nome: "Toca para Gatos",
    precoAtual: 109.9,
    precoPromocional: null,
    tipo: "Cama",
    descricao:
      "Toca confortável que oferece um ambiente reservado e aconchegante para gatos.",
    dataValidade: "Não se aplica",
    emoji: "🐾",
  },
  {
    id: 7,
    nome: "Cortador de Unhas Pet",
    precoAtual: 29.9,
    precoPromocional: 24.9,
    tipo: "Acessório",
    descricao:
      "Cortador de unhas desenvolvido para facilitar os cuidados básicos com cães e gatos.",
    dataValidade: "Não se aplica",
    emoji: "✂️",
  },
  {
    id: 8,
    nome: "Escova Removedora de Pelos",
    precoAtual: 39.9,
    precoPromocional: null,
    tipo: "Acessório",
    descricao:
      "Escova para auxiliar na remoção de pelos soltos e nos cuidados com a pelagem.",
    dataValidade: "Não se aplica",
    emoji: "🪮",
  },
];