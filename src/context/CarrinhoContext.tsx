import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";
import type { Compra, Produto } from "../types";
import { useAuth } from "./AuthContext";

type ItemCarrinho = Produto & {
  quantidade: number;
};

type CarrinhoContextType = {
  carrinho: ItemCarrinho[];
  adicionarAoCarrinho: (produto: Produto) => void;
  removerDoCarrinho: (id: number) => void;
  finalizarPedido: () => Promise<{ compras: Compra[]; total: number }>;
  total: number;
  quantidadeItens: number;
};

const CarrinhoContext = createContext<CarrinhoContextType>(
  {} as CarrinhoContextType
);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  // Ao sair da conta, o carrinho é esvaziado.
  useEffect(() => {
    if (!usuario) setCarrinho([]);
  }, [usuario]);

  function adicionarAoCarrinho(produto: Produto) {
    setCarrinho((carrinhoAtual) => {
      const existente = carrinhoAtual.find((item) => item.id === produto.id);

      if (existente) {
        return carrinhoAtual.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...carrinhoAtual, { ...produto, quantidade: 1 }];
    });
  }

  function removerDoCarrinho(id: number) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.filter((item) => item.id !== id)
    );
  }

  // Envia o pedido ao servidor. Lá, o preço é lido do banco e uma Compra é
  // registrada para cada produto. O carrinho só é limpo se o servidor aceitar.
  async function finalizarPedido() {
    const itens = carrinho.map((item) => ({
      produtoId: item.id,
      quantidade: item.quantidade,
    }));

    const resultado = await api.criarPedido(itens);
    setCarrinho([]);

    return resultado;
  }

  const total = carrinho.reduce(
    (soma, item) =>
      soma + (item.precoPromocional ?? item.precoAtual) * item.quantidade,
    0
  );

  const quantidadeItens = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        finalizarPedido,
        total,
        quantidadeItens,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}
