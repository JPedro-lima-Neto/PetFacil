import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
import type { DadosCadastro } from "../types";
import { avisar } from "../utils/alertas";
import { formatarCPF } from "../utils/formatacao";
import { validarCadastro } from "../utils/validacoes";

type Campo = keyof DadosCadastro;

export default function CadastroScreen() {
  const { cadastrar } = useAuth();

  const [dados, setDados] = useState<DadosCadastro>({
    nomeCompleto: "",
    email: "",
    cpf: "",
    senha: "",
    repetirSenha: "",
  });
  // campos que o usuário já tocou (para não mostrar erro antes da hora)
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  // erros que vieram do servidor (ex.: CPF já cadastrado)
  const [errosServidor, setErrosServidor] = useState<Partial<Record<Campo, string>>>({});
  const [carregando, setCarregando] = useState(false);

  // Validação em tempo real: recalculada a cada tecla digitada.
  const erros = useMemo(() => validarCadastro(dados), [dados]);
  const formularioValido = Object.keys(erros).length === 0;

  function alterar(campo: Campo, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setTocados((atual) => ({ ...atual, [campo]: true }));
    setErrosServidor((atual) => ({ ...atual, [campo]: undefined }));
  }

  // O erro só aparece depois que o campo foi tocado.
  const erroDe = (campo: Campo) =>
    tocados[campo] ? errosServidor[campo] ?? erros[campo] : undefined;

  async function aoCadastrar() {
    if (!formularioValido) return;

    setCarregando(true);

    try {
      await cadastrar({
        ...dados,
        nomeCompleto: dados.nomeCompleto.trim(),
        email: dados.email.trim(),
      });

      avisar("Cadastro realizado!", "Sua conta foi criada com sucesso.", () =>
        router.replace("/")
      );
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.campos) {
          setErrosServidor(e.campos as Partial<Record<Campo, string>>);
          setTocados({
            nomeCompleto: true, email: true, cpf: true, senha: true, repetirSenha: true,
          });
        }
        avisar("Não foi possível cadastrar", e.message);
      } else {
        avisar("Erro", "Não foi possível concluir o cadastro.");
      }
    } finally {
      setCarregando(false);
    }
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
        <Text style={styles.subtitle}>Cadastre-se para começar suas compras.</Text>

        <CampoTexto
          rotulo="Nome completo"
          placeholder="Seu nome completo"
          value={dados.nomeCompleto}
          onChangeText={(v) => alterar("nomeCompleto", v)}
          erro={erroDe("nomeCompleto")}
        />

        <CampoTexto
          rotulo="E-mail"
          placeholder="exemplo@email.com"
          value={dados.email}
          onChangeText={(v) => alterar("email", v)}
          keyboardType="email-address"
          autoCapitalize="none"
          erro={erroDe("email")}
        />

        <CampoTexto
          rotulo="CPF"
          placeholder="000.000.000-00"
          value={dados.cpf}
          onChangeText={(v) => alterar("cpf", formatarCPF(v))}
          keyboardType="numeric"
          maxLength={14}
          erro={erroDe("cpf")}
        />

        <CampoTexto
          rotulo="Senha"
          placeholder="Digite sua senha"
          value={dados.senha}
          onChangeText={(v) => alterar("senha", v)}
          secureTextEntry
          erro={erroDe("senha")}
        />

        <CampoTexto
          rotulo="Repetir senha"
          placeholder="Digite a senha novamente"
          value={dados.repetirSenha}
          onChangeText={(v) => alterar("repetirSenha", v)}
          secureTextEntry
          erro={erroDe("repetirSenha")}
        />

        <View style={styles.botao}>
          <Botao
            titulo="Cadastrar"
            onPress={aoCadastrar}
            carregando={carregando}
            desabilitado={!formularioValido}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  content: { padding: 25, paddingBottom: 50 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: cores.verde,
    marginTop: 10,
  },
  subtitle: {
    color: "#777",
    fontSize: 15,
    marginTop: 5,
    marginBottom: 6,
  },
  botao: { marginTop: 30 },
});
