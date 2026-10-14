import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const CHAVE = "petfacil.token";

// No celular o token fica no armazenamento seguro do sistema (Keychain no iOS,
// Keystore no Android). O SecureStore não existe na web, então lá usamos
// localStorage (apenas para testes no navegador).

export async function salvarToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(CHAVE, token);
    return;
  }
  await SecureStore.setItemAsync(CHAVE, token);
}

export async function lerToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return globalThis.localStorage?.getItem(CHAVE) ?? null;
  }
  return SecureStore.getItemAsync(CHAVE);
}

export async function apagarToken(): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(CHAVE);
    return;
  }
  await SecureStore.deleteItemAsync(CHAVE);
}
