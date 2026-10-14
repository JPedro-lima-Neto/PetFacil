import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";

import { cores } from "../constants/cores";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CarrinhoProvider } from "../context/CarrinhoContext";

function Navegacao() {
  const { usuario, carregando } = useAuth();

  // Enquanto verifica se já existe uma sessão salva, mostra um carregando.
  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: cores.fundo,
        }}
      >
        <ActivityIndicator size="large" color={cores.verde} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: cores.verde },
        headerTintColor: cores.branco,
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      {/* Telas PÚBLICAS: só acessíveis para quem NÃO está logado */}
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ title: "Criar conta" }} />
      </Stack.Protected>

      {/* Telas PRIVADAS: só acessíveis com login (token válido) */}
      <Stack.Protected guard={!!usuario}>
        <Stack.Screen
          name="produtos"
          options={{ title: "PetFácil", headerBackVisible: false }}
        />
        <Stack.Screen name="detalhes" options={{ title: "Detalhes do produto" }} />
        <Stack.Screen name="carrinho" options={{ title: "Meu carrinho" }} />
        <Stack.Screen name="compras" options={{ title: "Minhas compras" }} />
        <Stack.Screen name="assistente" options={{ title: "Assistente virtual" }} />
        <Stack.Screen name="sucesso" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <StatusBar style="dark" />
        <Navegacao />
      </CarrinhoProvider>
    </AuthProvider>
  );
}
