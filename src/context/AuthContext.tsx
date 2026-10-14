import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { api, definirAoSessaoExpirar, definirToken } from "../services/api";
import {
  apagarToken,
  lerToken,
  salvarToken,
} from "../services/armazenamentoToken";
import type { DadosCadastro, Usuario } from "../types";

type AuthContextType = {
  usuario: Usuario | null;
  carregando: boolean; // true enquanto verifica se já existe uma sessão salva
  entrar: (login: string, senha: string) => Promise<void>;
  cadastrar: (dados: DadosCadastro) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const sair = useCallback(async () => {
    definirToken(null);
    await apagarToken();
    setUsuario(null);
  }, []);

  // Ao abrir o app: se há token salvo, confirma com o servidor quem é o usuário.
  useEffect(() => {
    async function restaurarSessao() {
      try {
        const token = await lerToken();

        if (token) {
          definirToken(token);
          const { usuario: logado } = await api.eu();
          setUsuario(logado);
        }
      } catch {
        // token expirado/inválido ou servidor fora do ar: volta ao login
        definirToken(null);
        await apagarToken();
      } finally {
        setCarregando(false);
      }
    }

    restaurarSessao();
  }, []);

  // Se qualquer requisição receber 401 (token vencido), encerra a sessão.
  useEffect(() => {
    definirAoSessaoExpirar(() => {
      sair();
    });
    return () => definirAoSessaoExpirar(null);
  }, [sair]);

  async function entrar(login: string, senha: string) {
    const { token, usuario: logado } = await api.login(login, senha);

    await salvarToken(token);
    definirToken(token);
    setUsuario(logado);
  }

  async function cadastrar(dados: DadosCadastro) {
    await api.cadastrar(dados);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, entrar, cadastrar, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
