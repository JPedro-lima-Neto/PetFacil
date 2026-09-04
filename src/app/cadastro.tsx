import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
    padding: 25,
    paddingBottom: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E8B57",
    marginTop: 10,
  },

  subtitle: {
    color: "#777",
    fontSize: 15,
    marginTop: 5,
    marginBottom: 20,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 7,
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

  button: {
    height: 54,
    backgroundColor: "#2E8B57",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, "");
}

function validarCPF(cpfInformado: string) {
  const cpf = somenteNumeros(cpfInformado);

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let primeiroDigito = (soma * 10) % 11;

  if (primeiroDigito === 10) {
    primeiroDigito = 0;
  }

  if (primeiroDigito !== Number(cpf[9])) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  let segundoDigito = (soma * 10) % 11;

  if (segundoDigito === 10) {
    segundoDigito = 0;
  }

  return segundoDigito === Number(cpf[10]);
}

function formatarCPF(valor: string) {
  const numeros = somenteNumeros(valor).slice(0, 11);

  return numeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");

  function cadastrar() {
    if (nome.trim().length < 2) {
      Alert.alert(
        "Cadastro inválido",
        "Informe um nome com pelo menos 2 caracteres."
      );
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert(
        "Cadastro inválido",
        "Informe um e-mail válido."
      );
      return;
    }

    if (!validarCPF(cpf)) {
      Alert.alert(
        "Cadastro inválido",
        "Informe um CPF válido."
      );
      return;
    }

    if (!senha) {
      Alert.alert(
        "Cadastro inválido",
        "Informe uma senha."
      );
      return;
    }

    if (senha !== repetirSenha) {
      Alert.alert(
        "Cadastro inválido",
        "As senhas não são iguais."
      );
      return;
    }

    Alert.alert(
      "Cadastro realizado!",
      "Sua conta foi criada com sucesso.",
      [
        {
          text: "Ir para o login",
          onPress: () => router.replace("/"),
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Criar sua conta 🐾</Text>

        <Text style={styles.subtitle}>
          Cadastre-se para começar suas compras.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome completo</Text>

          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="exemplo@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>CPF</Text>

          <TextInput
            style={styles.input}
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={(valor) => setCpf(formatarCPF(valor))}
            keyboardType="numeric"
            maxLength={14}
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={styles.label}>Repetir senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            value={repetirSenha}
            onChangeText={setRepetirSenha}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={cadastrar}
          >
            <Text style={styles.buttonText}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}