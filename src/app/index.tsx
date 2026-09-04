import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F7",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#DFF3E7",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  paw: {
    fontSize: 45,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2E8B57",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 35,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8DED9",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#222",
  },

  loginButton: {
    height: 52,
    backgroundColor: "#2E8B57",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  accountText: {
    textAlign: "center",
    color: "#777",
    marginTop: 25,
    marginBottom: 10,
  },

  registerButton: {
    height: 52,
    borderWidth: 2,
    borderColor: "#E78235",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  registerButtonText: {
    color: "#E78235",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 35,
  },
});

export default function LoginScreen() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  function entrar() {
    if (!login.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Informe o login e a senha.");
      return;
    }

    router.replace("/produtos");
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.logo}>
          <Text style={styles.paw}>🐾</Text>
        </View>

        <Text style={styles.title}>Pet</Text>

        <Text style={styles.subtitle}>
          Tudo para o seu melhor amigo
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={entrar}
          >
            <Text style={styles.loginButtonText}>
              Entrar
            </Text>
          </TouchableOpacity>

          <Text style={styles.accountText}>
            Ainda não possui uma conta?
          </Text>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push("/cadastro")}
          >
            <Text style={styles.registerButtonText}>
              Criar cadastro
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          PetFácil • Cuidando de quem faz parte da família
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}