import { useState, useEffect, createContext, useContext } from "react";
import apiService from "../services/api";

interface User {
  id: number;
  nome: string;
  email: string;
  role: "admin" | "user";
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { nome?: string; email?: string }) => Promise<void>;
  changePassword: (senhaAtual: string, novaSenha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("🔍 Verificando autenticação...");
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        console.log("🔑 Token e usuário encontrados no localStorage");
        try {
          // Tentar verificar token no servidor
          const response = await apiService.verificarToken();
          console.log("✅ Token válido no servidor:", response);
          setUser(response.usuario);
        } catch (error) {
          console.error("❌ Token inválido no servidor:", error);
          // Token inválido, limpar dados
          apiService.clearAuth();
          setUser(null);
        }
      } else {
        console.log("⚠️ Nenhum token ou usuário encontrado no localStorage");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Erro ao verificar autenticação:", error);
      apiService.clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ email, senha });
      setUser(response.usuario);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nome: string, email: string, senha: string) => {
    try {
      console.log("🔵 Iniciando registro...");
      setIsLoading(true);
      const response = await apiService.cadastrarUsuario({
        nome,
        email,
        senha,
      });
      console.log("✅ Registro bem-sucedido:", response);
      // Só definir o usuário se o cadastro for bem-sucedido
      setUser(response.usuario);
    } catch (error) {
      console.error("❌ Erro no cadastro:", error);
      // Não definir o usuário em caso de erro
      throw error;
    } finally {
      console.log("🔵 Finalizando registro...");
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { nome?: string; email?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiService.atualizarPerfil(data);
      setUser(response.usuario);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (senhaAtual: string, novaSenha: string) => {
    try {
      setIsLoading(true);
      await apiService.alterarSenha({ senhaAtual, novaSenha });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
