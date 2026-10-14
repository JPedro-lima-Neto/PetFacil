import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { cores } from "../constants/cores";
import { api, ApiError } from "../services/api";
import type { Compra } from "../types";
import { formatarDataHora, formatarPreco } from "../utils/formatacao";

export default function ComprasScreen() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setErro("");

    try {
      setCompras(await api.listarCompras());
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Não foi possível carregar suas compras."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.verde} />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => {
            setCarregando(true);
            carregar();
          }}
        >
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalGasto = compras.reduce((soma, compra) => soma + compra.preco, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={compras}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          compras.length > 0 ? (
            <View style={styles.resumo}>
              <Text style={styles.resumoRotulo}>
                {compras.length} {compras.length === 1 ? "compra" : "compras"} registradas
              </Text>
              <Text style={styles.resumoValor}>{formatarPreco(totalGasto)}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🧾</Text>
            <Text style={styles.vazioTitulo}>Nenhuma compra ainda</Text>
            <Text style={styles.vazioTexto}>
              Quando você finalizar um pedido, as compras aparecem aqui.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nomeProduto}</Text>
              <Text style={styles.data}>{formatarDataHora(item.dataCompra)}</Text>
            </View>
            <Text style={styles.preco}>{formatarPreco(item.preco)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: cores.fundo,
  },
  lista: { padding: 18, paddingBottom: 40 },
  resumo: {
    backgroundColor: cores.verde,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  resumoRotulo: { color: "#DFF3E7", fontSize: 14 },
  resumoValor: {
    color: cores.branco,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  info: { flex: 1, paddingRight: 10 },
  nome: { fontSize: 15, fontWeight: "600", color: cores.texto },
  data: { fontSize: 12, color: "#888", marginTop: 3 },
  preco: { fontSize: 16, fontWeight: "bold", color: cores.verde },
  vazio: { alignItems: "center", marginTop: 60 },
  vazioEmoji: { fontSize: 54 },
  vazioTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: cores.verde,
    marginTop: 12,
  },
  vazioTexto: {
    color: cores.textoSuave,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 30,
  },
  erro: { color: cores.erro, textAlign: "center", marginBottom: 12 },
  botao: {
    backgroundColor: cores.verde,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  botaoTexto: { color: cores.branco, fontWeight: "bold" },
});
