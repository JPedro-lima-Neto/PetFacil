import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { cores } from "../constants/cores";

type CampoTextoProps = TextInputProps & {
  rotulo: string;
  erro?: string;
};

export default function CampoTexto({ rotulo, erro, ...props }: CampoTextoProps) {
  return (
    <View>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <TextInput
        style={[styles.input, !!erro && styles.inputComErro]}
        placeholderTextColor="#999"
        {...props}
      />

      {!!erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginTop: 14,
    marginBottom: 7,
  },
  input: {
    height: 52,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: cores.texto,
  },
  inputComErro: {
    borderColor: cores.erro,
  },
  erro: {
    color: cores.erro,
    fontSize: 13,
    marginTop: 5,
  },
});
