import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

import { Produto } from "../data/produtos";

type ItemCarrinho = Produto & {
  quantidade: number;
};

type Compra = {
  produto: string;
  preco: number;
  data: string;
};

type CarrinhoContextType = {
  carrinho: ItemCarrinho[];
  compras: Compra[];
  adicionarAoCarrinho: (produto: Produto) => void;
  removerDoCarrinho: (id: number) => void;
  finalizarPedido: () => void;
  total: number;
  quantidadeItens: number;
};

const CarrinhoContext = createContext<CarrinhoContextType>(
  {} as CarrinhoContextType
);

export function CarrinhoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);

  function adicionarAoCarrinho(produto: Produto) {
    setCarrinho((carrinhoAtual) => {
      const produtoExistente = carrinhoAtual.find(
        (item) => item.id === produto.id
      );

      if (produtoExistente) {
        return carrinhoAtual.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: item.quantidade + 1,
              }
            : item
        );
      }

      return [
        ...carrinhoAtual,
        {
          ...produto,
          quantidade: 1,
        },
      ];
    });
  }

  function removerDoCarrinho(id: number) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.filter((item) => item.id !== id)
    );
  }

  function finalizarPedido() {
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    const novasCompras: Compra[] = [];

    carrinho.forEach((item) => {
      const preco =
        item.precoPromocional ?? item.precoAtual;

      for (let i = 0; i < item.quantidade; i++) {
        novasCompras.push({
          produto: item.nome,
          preco,
          data: dataAtual,
        });
      }
    });

    setCompras((comprasAtuais) => [
      ...comprasAtuais,
      ...novasCompras,
    ]);

    setCarrinho([]);
  }

  const total = carrinho.reduce((soma, item) => {
    const preco =
      item.precoPromocional ?? item.precoAtual;

    return soma + preco * item.quantidade;
  }, 0);

  const quantidadeItens = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        compras,
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