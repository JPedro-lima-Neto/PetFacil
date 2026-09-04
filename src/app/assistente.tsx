import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Mensagem = {
  id: number;
  texto: string;
  tipo: "usuario" | "assistente";
};

const perguntas = [
  {
    pergunta: "Qual ração é indicada para filhotes?",
    resposta:
      "Para filhotes, o ideal é utilizar uma ração específica para a fase de crescimento. Ela possui nutrientes adequados para o desenvolvimento do pet.",
  },
  {
    pergunta: "Quais produtos estão em promoção?",
    resposta:
      "No momento temos algumas rações, brinquedos, camas e acessórios em promoção. Você pode identificar os produtos pelo selo PROMOÇÃO no catálogo.",
  },
  {
    pergunta: "Como finalizo meu pedido?",
    resposta:
      "Adicione os produtos ao carrinho, abra o carrinho e toque em Finalizar pedido. Depois, confirme a compra.",
  },
  {
    pergunta: "Como funciona a retirada?",
    resposta:
      "Após finalizar o pedido, os produtos ficam registrados para retirada. O pagamento é realizado no caixa da loja.",
  },
  {
    pergunta: "Posso remover produtos do carrinho?",
    resposta:
      "Sim. No carrinho, toque no X ao lado do produto que deseja remover.",
  },
];

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
    paddingBottom: 18,
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
});

export default function AssistenteScreen() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 1,
      texto:
        "Olá! 🐾 Sou o assistente virtual do pet shop. Como posso ajudar?",
      tipo: "assistente",
    },
  ]);

  function perguntar(pergunta: string, resposta: string) {
    const novaMensagemUsuario: Mensagem = {
      id: Date.now(),
      texto: pergunta,
      tipo: "usuario",
    };

    const novaMensagemAssistente: Mensagem = {
      id: Date.now() + 1,
      texto: resposta,
      tipo: "assistente",
    };

    setMensagens((mensagensAtuais) => [
      ...mensagensAtuais,
      novaMensagemUsuario,
      novaMensagemAssistente,
    ]);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
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
                mensagem.tipo === "usuario"
                  ? styles.userText
                  : styles.assistantText,
              ]}
            >
              {mensagem.texto}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.questionsArea}>
        <Text style={styles.questionsTitle}>
          Perguntas rápidas
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {perguntas.map((item) => (
            <TouchableOpacity
              key={item.pergunta}
              style={styles.questionButton}
              onPress={() =>
                perguntar(item.pergunta, item.resposta)
              }
            >
              <Text style={styles.questionText}>
                {item.pergunta}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}