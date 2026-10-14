export function formatarPreco(valor: number): string {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

// "2027-12-15" -> "15/12/2027"  |  null -> "Não se aplica"
export function formatarValidade(data: string | null): string {
  if (!data) return "Não se aplica";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// "2026-09-03T14:30:00.000Z" -> "03/09/2026 11:30"
export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  return (
    data.toLocaleDateString("pt-BR") +
    " " +
    data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

export function formatarCPF(valor: string): string {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  return numeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// Os produtos não têm imagem no banco (o modelo do enunciado não prevê),
// então o app escolhe um emoji a partir do tipo do produto.
const emojiPorTipo: Record<string, string> = {
  "ração": "🥣",
  brinquedo: "🧸",
  cama: "🛏️",
  "acessório": "✂️",
  higiene: "🧼",
  petisco: "🦴",
};

export function emojiDoProduto(tipo: string): string {
  return emojiPorTipo[tipo.toLowerCase()] ?? "🐾";
}
