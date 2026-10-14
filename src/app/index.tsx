import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Botao from "../components/Botao";
import CampoTexto from "../components/CampoTexto";
import { cores } from "../constants/cores";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";

export default function LoginScreen() {
  const { entrar } = useAuth();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function aoEntrar() {
    if (!login.trim() || !senha) {
      setErro("Informe o login e a senha.");
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      // Se der certo, o AuthContext guarda o usuário e o Stack.Protected
      // libera automaticamente as telas privadas.
      await entrar(login.trim(), senha);
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Não foi possível entrar. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logo}>
            <Text style={styles.paw}>🐾</Text>
          </View>

          <Text style={styles.title}>PetFácil</Text>
          <Text style={styles.subtitle}>Tudo para o seu melhor amigo</Text>

          <CampoTexto
            rotulo="Login"
            placeholder="Digite seu e-mail"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <CampoTexto
            rotulo="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            onSubmitEditing={aoEntrar}
          />

          {!!erro && (
            <View style={styles.caixaErro}>
              <Text style={styles.textoErro}>{erro}</Text>
            </View>
          )}

          <View style={styles.espaco}>
            <Botao titulo="Entrar" onPress={aoEntrar} carregando={carregando} />
          </View>

          <Text style={styles.accountText}>Ainda não possui uma conta?</Text>

          <Botao
            titulo="Criar cadastro"
            variante="contorno"
            onPress={() => router.push("/cadastro")}
          />

          <Text style={styles.footer}>
            PetFácil • Cuidando de quem faz parte da família
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: cores.verdeClaro,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  paw: { fontSize: 45 },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: cores.verde,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: cores.textoSuave,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  caixaErro: {
    backgroundColor: cores.erroFundo,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  textoErro: { color: cores.erro, fontSize: 14 },
  espaco: { marginTop: 22 },
  accountText: {
    textAlign: "center",
    color: "#777",
    marginTop: 25,
    marginBottom: 10,
  },
  footer: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 35,
  },
});
