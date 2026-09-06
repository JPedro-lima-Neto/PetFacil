import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

type AssistenteButtonProps = {
  style?: StyleProp<ViewStyle>;
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  icon: {
    fontSize: 23,
  },
});

export default function AssistenteButton({ style }: AssistenteButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => router.push("/assistente")}
      accessibilityRole="button"
      accessibilityLabel="Abrir assistente virtual"
    >
      <Text style={styles.icon}>💬</Text>
    </TouchableOpacity>
  );
}
