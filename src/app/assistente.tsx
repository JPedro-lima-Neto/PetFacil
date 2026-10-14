import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { api, ApiError } from "../services/api";

type Mensagem = {
  id: number;
  texto: string;
  tipo: "usuario" | "assistente";
};

// Atalhos de perguntas. A resposta agora vem do servidor (POST /assistente).
const perguntasRapidas = [
  "Qual ração é indicada para filhotes?",
  "Quais produtos estão em promoção?",
  "Como finalizo meu pedido?",
  "Como funciona a retirada?",
  "Posso remover produtos do carrinho?",
];

export default function AssistenteScreen() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 1,
      texto: "Olá! 🐾 Sou o assistente virtual do pet shop. Como posso ajudar?",
      tipo: "assistente",
    },
  ]);
  const [texto, setTexto] = useState("");
  const [respondendo, setRespondendo] = useState(false);
  const listaRef = useRef<ScrollView>(null);

  function adicionar(mensagem: Omit<Mensagem, "id">) {
    setMensagens((atuais) => [
      ...atuais,
      { ...mensagem, id: Date.now() + atuais.length },
    ]);
  }

  async function enviar(pergunta: string) {
    const mensagem = pergunta.trim();
    if (!mensagem || respondendo) return;

    adicionar({ texto: mensagem, tipo: "usuario" });
    setTexto("");
    setRespondendo(true);

    try {
      const resposta = await api.perguntarAssistente(mensagem);
      adicionar({ texto: resposta, tipo: "assistente" });
    } catch (e) {
      adicionar({
        texto:
          e instanceof ApiError
            ? e.message
            : "Desculpe, não consegui responder agora.",
        tipo: "assistente",
      });
    } finally {
      setRespondendo(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={listaRef}
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: true })}
      >
        {mensagens.map((mensagem) => (
          <View
            key={mensagem.id}
            style={[
              styles.message,
              mensagem.tipo === "usuario"
                ? styles.userMessage
                : styles.assistantMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                mensagem.tipo === "usuario" ? styles.userText : styles.assistantText,
              ]}
            >
              {mensagem.texto}
            </Text>
          </View>
        ))}

        {respondendo && (
          <View style={[styles.message, styles.assistantMessage]}>
            <ActivityIndicator size="small" color="#2E8B57" />
          </View>
        )}
      </ScrollView>

      <View style={styles.questionsArea}>
        <Text style={styles.questionsTitle}>Perguntas rápidas</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {perguntasRapidas.map((pergunta) => (
            <TouchableOpacity
              key={pergunta}
              style={styles.questionButton}
              onPress={() => enviar(pergunta)}
              disabled={respondendo}
            >
              <Text style={styles.questionText}>{pergunta}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua pergunta..."
            placeholderTextColor="#999"
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={() => enviar(texto)}
            returnKeyType="send"
            maxLength={500}
          />

          <TouchableOpacity
            style={[styles.sendButton, (!texto.trim() || respondendo) && styles.sendDisabled]}
            onPress={() => enviar(texto)}
            disabled={!texto.trim() || respondendo}
            accessibilityLabel="Enviar mensagem"
          >
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F7",
  },

  chat: {
    flex: 1,
  },

  chatContent: {
    padding: 18,
    paddingBottom: 30,
  },

  message: {
    maxWidth: "82%",
    padding: 13,
    borderRadius: 14,
    marginBottom: 12,
  },

  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2E8B57",
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },

  assistantText: {
    color: "#333",
  },

  userText: {
    color: "#FFFFFF",
  },

  questionsArea: {
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },

  questionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
  },

  questionButton: {
    backgroundColor: "#EAF6EF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    maxWidth: 220,
  },

  questionText: {
    color: "#2E8B57",
    fontSize: 13,
    fontWeight: "600",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },

  input: {
    flex: 1,
    height: 46,
    backgroundColor: "#F2F5F3",
    borderRadius: 23,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#222",
  },

  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2E8B57",
    justifyContent: "center",
    alignItems: "center",
  },

  sendDisabled: {
    opacity: 0.4,
  },

  sendText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});
