import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  iconArea: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DFF3E7",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    color: "#2E8B57",
    fontSize: 55,
    fontWeight: "bold",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E8B57",
    marginTop: 25,
  },

  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },

  infoBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    marginTop: 30,
  },

  infoEmoji: {
    fontSize: 35,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },

  infoText: {
    color: "#777",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 7,
  },

  button: {
    width: "100%",
    height: 54,
    backgroundColor: "#2E8B57",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default function SucessoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconArea}>
        <Text style={styles.icon}>✓</Text>
      </View>

      <Text style={styles.title}>
        Pedido realizado!
      </Text>

      <Text style={styles.text}>
        Seu pedido foi registrado com sucesso.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoEmoji}>🏪</Text>

        <Text style={styles.infoTitle}>
          Agora é só retirar
        </Text>

        <Text style={styles.infoText}>
          O pagamento será realizado diretamente no caixa da loja
          no momento da retirada.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/produtos")}
      >
        <Text style={styles.buttonText}>
          Continuar comprando
        </Text>
      </TouchableOpacity>
    </View>
  );
}