import { router } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AssistenteButton from "../components/AssistenteButton";
import { useCarrinho } from "../context/CarrinhoContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F7",
    padding: 18,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2E8B57",
    marginTop: 5,
  },

  subtitle: {
    color: "#777",
    marginTop: 4,
    marginBottom: 18,
  },

  list: {
    paddingBottom: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },

  emojiArea: {
    width: 65,
    height: 65,
    borderRadius: 10,
    backgroundColor: "#EAF6EF",
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 32,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },

  quantity: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },

  price: {
    color: "#2E8B57",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },

  removeButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  removeText: {
    color: "#D9534F",
    fontSize: 20,
    fontWeight: "bold",
  },

  summary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 5,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  total: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2E8B57",
  },

  paymentInfo: {
    color: "#777",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },

  finishButton: {
    height: 54,
    backgroundColor: "#E78235",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: "#F7F9F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  emptyEmoji: {
    fontSize: 75,
  },

  emptyTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 8,
  },

  continueButton: {
    backgroundColor: "#2E8B57",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  emptyAssistant: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

export default function CarrinhoScreen() {
  const {
    carrinho,
    removerDoCarrinho,
    finalizarPedido,
    total,
    quantidadeItens,
  } = useCarrinho();

  function finalizar() {
    if (carrinho.length === 0) {
      Alert.alert(
        "Carrinho vazio",
        "Adicione algum produto antes de finalizar."
      );
      return;
    }

    Alert.alert(
      "Finalizar pedido",
      `O total do seu pedido é R$ ${total
        .toFixed(2)
        .replace(".", ",")}.\n\nO pagamento será realizado na retirada na loja.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            finalizarPedido();
            router.replace("/sucesso");
          },
        },
      ]
    );
  }

  if (carrinho.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AssistenteButton style={styles.emptyAssistant} />

        <Text style={styles.emptyEmoji}>🛒</Text>

        <Text style={styles.emptyTitle}>
          Seu carrinho está vazio
        </Text>

        <Text style={styles.emptyText}>
          Adicione alguns produtos para continuar.
        </Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.replace("/produtos")}
        >
          <Text style={styles.continueButtonText}>
            Ver produtos
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Seu pedido 🐾</Text>
        <AssistenteButton />
      </View>

      <Text style={styles.subtitle}>
        {quantidadeItens}{" "}
        {quantidadeItens === 1 ? "item" : "itens"} no carrinho
      </Text>

      <FlatList
        data={carrinho}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const preco =
            item.precoPromocional ?? item.precoAtual;

          return (
            <View style={styles.card}>
              <View style={styles.emojiArea}>
                <Text style={styles.emoji}>
                  {item.emoji}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.productName}>
                  {item.nome}
                </Text>

                <Text style={styles.quantity}>
                  Quantidade: {item.quantidade}
                </Text>

                <Text style={styles.price}>
                  R${" "}
                  {(preco * item.quantidade)
                    .toFixed(2)
                    .replace(".", ",")}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removerDoCarrinho(item.id)}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <View style={styles.summary}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>

          <Text style={styles.total}>
            R$ {total.toFixed(2).replace(".", ",")}
          </Text>
        </View>

        <Text style={styles.paymentInfo}>
          Pagamento realizado no caixa da loja durante a retirada.
        </Text>

        <TouchableOpacity
          style={styles.finishButton}
          onPress={finalizar}
        >
          <Text style={styles.finishButtonText}>
            Finalizar pedido
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}