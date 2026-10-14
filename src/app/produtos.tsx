import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AssistenteButton from "../components/AssistenteButton";
import { useAuth } from "../context/AuthContext";
import { useCarrinho } from "../context/CarrinhoContext";
import { api, ApiError } from "../services/api";
import type { Produto } from "../types";
import { confirmar } from "../utils/alertas";
import { emojiDoProduto } from "../utils/formatacao";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F7",
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  welcome: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2E8B57",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 3,
  },

  iconButton: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  icon: {
    fontSize: 23,
  },

  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E78235",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },

  search: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#222",
    marginBottom: 22,
  },

  linksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
    marginBottom: 14,
  },

  linkText: {
    color: "#2E8B57",
    fontWeight: "600",
    fontSize: 14,
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  mensagemErro: {
    color: "#C0392B",
    textAlign: "center",
    marginBottom: 12,
  },

  tentarNovamente: {
    backgroundColor: "#2E8B57",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  tentarNovamenteTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  vazio: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  detailsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  imageArea: {
    width: 85,
    height: 85,
    backgroundColor: "#EAF6EF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 42,
  },

  productInfo: {
    flex: 1,
    marginLeft: 14,
  },

  category: {
    fontSize: 12,
    color: "#2E8B57",
    fontWeight: "600",
    marginBottom: 3,
  },

  productName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },

  promotion: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF0E5",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 6,
  },

  promotionText: {
    color: "#E78235",
    fontSize: 9,
    fontWeight: "bold",
  },

  priceArea: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  oldPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E8B57",
  },

  actionArea: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  addButton: {
    minWidth: 86,
    backgroundColor: "#2E8B57",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 9,
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  arrow: {
    fontSize: 24,
    color: "#AAA",
  },
});

export default function ProdutosScreen() {
  const [busca, setBusca] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const { usuario, sair } = useAuth();
  const { quantidadeItens, adicionarAoCarrinho } = useCarrinho();

  const carregarProdutos = useCallback(async () => {
    setErro("");

    try {
      setProdutos(await api.listarProdutos());
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Não foi possível carregar os produtos."
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const primeiroNome = usuario?.nomeCompleto.split(" ")[0] ?? "";

  function confirmarSaida() {
    confirmar({
      titulo: "Sair da conta",
      mensagem: "Deseja realmente sair?",
      textoConfirmar: "Sair",
      aoConfirmar: sair,
    });
  }

  function abrirProduto(id: number) {
    router.push({
      pathname: "/detalhes",
      params: {
        id: id.toString(),
      },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Olá, {primeiroNome}! 🐾</Text>

          <Text style={styles.subtitle}>
            O que seu pet precisa hoje?
          </Text>
        </View>

        <View style={styles.headerButtons}>
          <AssistenteButton />

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/carrinho")}
          >
            <Text style={styles.icon}>🛒</Text>

            {quantidadeItens > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {quantidadeItens}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => router.push("/compras")}>
          <Text style={styles.linkText}>🧾 Minhas compras</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={confirmarSaida}>
          <Text style={styles.linkText}>Sair 🚪</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar produtos..."
        placeholderTextColor="#999"
        value={busca}
        onChangeText={setBusca}
      />

      <Text style={styles.sectionTitle}>
        Produtos
      </Text>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#2E8B57" />
        </View>
      ) : erro ? (
        <View style={styles.centro}>
          <Text style={styles.mensagemErro}>{erro}</Text>
          <TouchableOpacity
            style={styles.tentarNovamente}
            onPress={() => {
              setCarregando(true);
              carregarProdutos();
            }}
          >
            <Text style={styles.tentarNovamenteTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <FlatList
        data={produtosFiltrados}
        refreshing={atualizando}
        onRefresh={() => {
          setAtualizando(true);
          carregarProdutos();
        }}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
        }
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const precoFinal =
            item.precoPromocional ?? item.precoAtual;

          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.detailsButton}
                activeOpacity={0.8}
                onPress={() => abrirProduto(item.id)}
              >
                <View style={styles.imageArea}>
                  <Text style={styles.emoji}>
                    {emojiDoProduto(item.tipo)}
                  </Text>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.category}>
                    {item.tipo}
                  </Text>

                  <Text style={styles.productName}>
                    {item.nome}
                  </Text>

                  {item.precoPromocional !== null && (
                    <View style={styles.promotion}>
                      <Text style={styles.promotionText}>
                        PROMOÇÃO
                      </Text>
                    </View>
                  )}

                  <View style={styles.priceArea}>
                    {item.precoPromocional !== null && (
                      <Text style={styles.oldPrice}>
                        R${" "}
                        {item.precoAtual
                          .toFixed(2)
                          .replace(".", ",")}
                      </Text>
                    )}

                    <Text style={styles.price}>
                      R${" "}
                      {precoFinal
                        .toFixed(2)
                        .replace(".", ",")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.actionArea}>
                <TouchableOpacity
                  style={styles.addButton}
                  activeOpacity={0.8}
                  onPress={() => adicionarAoCarrinho(item)}
                >
                  <Text style={styles.addButtonText}>
                    + Adicionar
                  </Text>
                </TouchableOpacity>

                <Text style={styles.arrow}>›</Text>
              </View>
            </View>
          );
        }}
      />
      )}
    </View>
  );
}