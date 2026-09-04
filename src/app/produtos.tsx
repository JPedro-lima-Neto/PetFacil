import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { produtos } from "../data/produtos";
import { useCarrinho } from "../context/CarrinhoContext";

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

  arrow: {
    fontSize: 30,
    color: "#AAA",
    paddingLeft: 8,
  },
});

export default function ProdutosScreen() {
  const [busca, setBusca] = useState("");
  const { quantidadeItens } = useCarrinho();

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

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
          <Text style={styles.welcome}>Olá! 🐾</Text>

          <Text style={styles.subtitle}>
            O que seu pet precisa hoje?
          </Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/assistente")}
          >
            <Text style={styles.icon}>💬</Text>
          </TouchableOpacity>

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

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const precoFinal =
            item.precoPromocional ?? item.precoAtual;

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => abrirProduto(item.id)}
            >
              <View style={styles.imageArea}>
                <Text style={styles.emoji}>
                  {item.emoji}
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

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}