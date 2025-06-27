const API_BASE_URL = "http://localhost:3001/api";

interface User {
  id: number;
  nome: string;
  email: string;
  role: "admin" | "user";
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

interface Car {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  quilometragem: number;
  combustivel: string;
  transmissao: string;
  cor: string;
  descricao: string;
  caracteristicas: string[];
  imagens: string[];
  usuario_id: number;
  ativo: boolean;
  data_cadastro: string;
  data_atualizacao: string;
  usuario?: User;
}

interface LoginResponse {
  message: string;
  usuario: User;
  token: string;
}

interface CarResponse {
  message: string;
  carro: Car;
}

interface CarsListResponse {
  carros: Car[];
  total: number;
  limit: number;
  offset: number;
  paginas: number;
}

interface CarFilters {
  marca?: string;
  modelo?: string;
  anoMin?: number;
  anoMax?: number;
  precoMin?: number;
  precoMax?: number;
  combustivel?: string;
  transmissao?: string;
  cor?: string;
  limit?: number;
  offset?: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper para fazer requisições
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Adicionar headers padrão
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Adicionar token de autenticação se existir
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log(
        "🔑 API - Token encontrado e enviado:",
        token.substring(0, 20) + "..."
      );
    } else {
      console.log("⚠️ API - Nenhum token encontrado no localStorage");
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Preservar a mensagem de erro específica do backend
        const errorMessage = data.error || "Erro na requisição";
        console.error("❌ API Error:", errorMessage);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("❌ API Request Error:", error);
      // Se já é um Error com mensagem, re-throw
      if (error instanceof Error) {
        throw error;
      }
      // Se não, criar um novo Error
      throw new Error("Erro na requisição");
    }
  }

  // Helper para upload de arquivos
  private async uploadRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {};
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro no upload");
      }

      return data;
    } catch (error) {
      console.error("Erro no upload:", error);
      throw error;
    }
  }

  // ===== AUTENTICAÇÃO =====

  // Cadastrar usuário
  async cadastrarUsuario(userData: {
    nome: string;
    email: string;
    senha: string;
  }): Promise<LoginResponse> {
    console.log("🌐 API - Iniciando cadastro de usuário:", userData);
    try {
      const response = await this.request<LoginResponse>("/auth/cadastro", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      console.log("✅ API - Cadastro bem-sucedido:", response);

      // Salvar token no localStorage após cadastro bem-sucedido
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.usuario));
      }

      return response;
    } catch (error) {
      console.error("❌ API - Erro no cadastro:", error);
      throw error;
    }
  }

  // Fazer login
  async login(credentials: {
    email: string;
    senha: string;
  }): Promise<LoginResponse> {
    const data = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Salvar token no localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));
    }

    return data;
  }

  // Fazer logout
  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", {
        method: "POST",
      });
    } finally {
      // Limpar dados locais mesmo se a requisição falhar
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // Verificar token
  async verificarToken(): Promise<{ message: string; usuario: User }> {
    return this.request<{ message: string; usuario: User }>("/auth/verificar");
  }

  // Obter perfil do usuário
  async obterPerfil(): Promise<{ usuario: User }> {
    return this.request<{ usuario: User }>("/auth/perfil");
  }

  // Atualizar perfil
  async atualizarPerfil(userData: {
    nome?: string;
    email?: string;
  }): Promise<{ message: string; usuario: User }> {
    return this.request<{ message: string; usuario: User }>("/auth/perfil", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Alterar senha
  async alterarSenha(passwordData: {
    senhaAtual: string;
    novaSenha: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/alterar-senha", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  }

  // ===== VEÍCULOS =====

  // Adicionar carro
  async adicionarCarro(
    carData: any,
    images: File[] = []
  ): Promise<CarResponse> {
    const formData = new FormData();

    // Adicionar dados do carro
    Object.keys(carData).forEach((key) => {
      if (key === "caracteristicas") {
        formData.append(key, JSON.stringify(carData[key]));
      } else {
        formData.append(key, carData[key]);
      }
    });

    // Adicionar imagens
    images.forEach((image) => {
      formData.append("imagens", image);
    });

    return this.uploadRequest<CarResponse>("/carros", formData);
  }

  // Listar carros
  async listarCarros(filters: CarFilters = {}): Promise<CarsListResponse> {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof CarFilters];
      if (value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/carros${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return this.request<CarsListResponse>(endpoint);
  }

  // Obter carro por ID
  async obterCarro(id: number): Promise<{ carro: Car }> {
    return this.request<{ carro: Car }>(`/carros/${id}`);
  }

  // Listar carros do usuário
  async listarMeusCarros(): Promise<{ carros: Car[]; total: number }> {
    return this.request<{ carros: Car[]; total: number }>(
      "/carros/usuario/meus-carros"
    );
  }

  // Atualizar carro
  async atualizarCarro(
    id: number,
    carData: any,
    images: File[] = []
  ): Promise<CarResponse> {
    const formData = new FormData();

    // Adicionar dados do carro
    Object.keys(carData).forEach((key) => {
      if (key === "caracteristicas") {
        formData.append(key, JSON.stringify(carData[key]));
      } else {
        formData.append(key, carData[key]);
      }
    });

    // Adicionar imagens
    images.forEach((image) => {
      formData.append("imagens", image);
    });

    const url = `${this.baseURL}/carros/${id}`;
    const headers: HeadersInit = {};
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar carro");
      }

      return data;
    } catch (error) {
      console.error("Erro ao atualizar carro:", error);
      throw error;
    }
  }

  // Deletar carro
  async deletarCarro(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/carros/${id}`, {
      method: "DELETE",
    });
  }

  // Obter estatísticas
  async obterEstatisticas(): Promise<{
    total_carros: number;
    carros_por_marca: Array<{ marca: string; total: number }>;
    preco_medio: string;
  }> {
    return this.request("/carros/estatisticas/geral");
  }

  // ===== UTILITÁRIOS =====

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // Obter token
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // Limpar dados de autenticação
  clearAuth(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Utilitário para construir URLs de imagens
  getImageUrl(imagePath: string): string {
    if (!imagePath) return "";
    // Se já tem http, retorna como está
    if (imagePath.startsWith("http")) return imagePath;
    // Se começa com /, adiciona a base URL
    if (imagePath.startsWith("/")) return `${this.baseURL}${imagePath}`;
    // Se não, assume que é só o filename
    return `${this.baseURL}/uploads/${imagePath}`;
  }
}

// Instância única do serviço
const apiService = new ApiService();

export default apiService;
