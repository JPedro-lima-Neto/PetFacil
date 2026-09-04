import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { CarrinhoProvider } from "../context/CarrinhoContext";

export default function RootLayout() {
  return (
    <CarrinhoProvider>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2E8B57",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#F7F9F7",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="cadastro"
          options={{
            title: "Criar conta",
          }}
        />

        <Stack.Screen
          name="produtos"
          options={{
            title: "PetFácil",
            headerBackVisible: false,
          }}
        />

        <Stack.Screen
          name="detalhes"
          options={{
            title: "Detalhes do produto",
          }}
        />

        <Stack.Screen
          name="carrinho"
          options={{
            title: "Meu carrinho",
          }}
        />

        <Stack.Screen
          name="assistente"
          options={{
            title: "Assistente virtual",
          }}
        />

        <Stack.Screen
          name="sucesso"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </CarrinhoProvider>
  );
}