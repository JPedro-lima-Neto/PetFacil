import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { cores } from "../constants/cores";

type BotaoProps = {
  titulo: string;
  onPress: () => void;
  variante?: "primario" | "contorno";
  carregando?: boolean;
  desabilitado?: boolean;
};

export default function Botao({
  titulo,
  onPress,
  variante = "primario",
  carregando = false,
  desabilitado = false,
}: BotaoProps) {
  const inativo = desabilitado || carregando;
  const contorno = variante === "contorno";

  return (
    <TouchableOpacity
      style={[
        styles.botao,
        contorno ? styles.contorno : styles.primario,
        inativo && styles.inativo,
      ]}
      onPress={onPress}
      disabled={inativo}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      {carregando ? (
        <ActivityIndicator color={contorno ? cores.laranja : cores.branco} />
      ) : (
        <Text style={[styles.texto, contorno && styles.textoContorno]}>
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  primario: {
    backgroundColor: cores.verde,
  },
  contorno: {
    borderWidth: 2,
    borderColor: cores.laranja,
  },
  inativo: {
    opacity: 0.5,
  },
  texto: {
    color: cores.branco,
    fontSize: 17,
    fontWeight: "bold",
  },
  textoContorno: {
    color: cores.laranja,
    fontSize: 16,
  },
});
