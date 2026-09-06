import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AssistenteButton from "../components/AssistenteButton";
import { useCarrinho } from "../context/CarrinhoContext";
import { produtos } from "../data/produtos";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F7",
  },

  content: {
    padding: 22,
    paddingBottom: 40,
  },

  assistantRow: {
    alignItems: "flex-end",
    marginBottom: 12,
  },

  imageArea: {
    height: 230,
    backgroundColor: "#EAF6EF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emoji: {
    fontSize: 100,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#DFF3E7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },

  categoryText: {
    color: "#2E8B57",
    fontSize: 13,
    fontWeight: "bold",
  },

  name: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#292929",
  },

  promotionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF0E5",
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 12,
  },

  promotionText: {
    color: "#E78235",
    fontSize: 11,
    fontWeight: "bold",
  },

  priceArea: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  oldPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 10,
  },

  price: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#2E8B57",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E2E2",
    marginVertical: 22,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 23,
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 22,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  infoLabel: {
    color: "#777",
    fontSize: 14,
  },

  infoValue: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },

  line: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 4,
  },

  addButton: {
    height: 56,
    backgroundColor: "#2E8B57",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  notFound: {
    flex: 1,
    backgroundColor: "#F7F9F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  notFoundEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },

  notFoundTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },

  notFoundText: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
    textAlign: "center",
  },

  backButton: {
    backgroundColor: "#2E8B57",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 25,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default function ProdutoScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { adicionarAoCarrinho } = useCarrinho();

  const produtoEncontrado = produtos.find(
    (item) => item.id === Number(id)
  );

  if (!produtoEncontrado) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundEmoji}>🐾</Text>

        <Text style={styles.notFoundTitle}>
          Produto não encontrado
        </Text>

        <Text style={styles.notFoundText}>
          Não foi possível carregar este produto.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/produtos")}
        >
          <Text style={styles.backButtonText}>
            Voltar aos produtos
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const produto = produtoEncontrado;

  const precoFinal =
    produto.precoPromocional ?? produto.precoAtual;

  function adicionar() {
    adicionarAoCarrinho(produto);

    Alert.alert(
      "Produto adicionado! 🐾",
      `${produto.nome} foi adicionado ao carrinho.`,
      [
        {
          text: "Continuar comprando",
          style: "cancel",
        },
        {
          text: "Ver carrinho",
          onPress: () => router.push("/carrinho"),
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.assistantRow}>
        <AssistenteButton />
      </View>

      <View style={styles.imageArea}>
        <Text style={styles.emoji}>
          {produto.emoji}
        </Text>
      </View>

      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>
          {produto.tipo}
        </Text>
      </View>

      <Text style={styles.name}>
        {produto.nome}
      </Text>

      {produto.precoPromocional !== null && (
        <View style={styles.promotionBadge}>
          <Text style={styles.promotionText}>
            PROMOÇÃO
          </Text>
        </View>
      )}

      <View style={styles.priceArea}>
        {produto.precoPromocional !== null && (
          <Text style={styles.oldPrice}>
            R$ {produto.precoAtual
              .toFixed(2)
              .replace(".", ",")}
          </Text>
        )}

        <Text style={styles.price}>
          R$ {precoFinal
            .toFixed(2)
            .replace(".", ",")}
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>
        Descrição
      </Text>

      <Text style={styles.description}>
        {produto.descricao}
      </Text>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Categoria
          </Text>

          <Text style={styles.infoValue}>
            {produto.tipo}
          </Text>
        </View>

        <View style={styles.line} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Validade
          </Text>

          <Text style={styles.infoValue}>
            {produto.dataValidade}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={adicionar}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>
          🛒 Adicionar ao carrinho
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}