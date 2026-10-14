import { Alert, Platform } from "react-native";

// O Alert.alert com vários botões não funciona na versão web do Expo.
// Estas funções usam window.alert/confirm na web e Alert.alert no celular.

export function avisar(titulo: string, mensagem: string, aoFechar?: () => void) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
    aoFechar?.();
    return;
  }

  Alert.alert(titulo, mensagem, [{ text: "OK", onPress: aoFechar }]);
}

export function confirmar(opcoes: {
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  aoConfirmar: () => void;
}) {
  const {
    titulo,
    mensagem,
    textoConfirmar = "Confirmar",
    textoCancelar = "Cancelar",
    aoConfirmar,
  } = opcoes;

  if (Platform.OS === "web") {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: textoCancelar, style: "cancel" },
    { text: textoConfirmar, onPress: aoConfirmar },
  ]);
}
