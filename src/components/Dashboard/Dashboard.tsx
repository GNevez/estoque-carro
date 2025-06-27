import React, { useState, useEffect } from "react";
import {
  Car,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import apiService from "../../services/api";

interface DashboardStats {
  total_carros: number;
  carros_por_marca: Array<{ marca: string; total: number }>;
  preco_medio: string;
}

interface RecentCar {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  data_cadastro: string;
  imagens: string[];
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCars, setRecentCars] = useState<RecentCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Carregar dados do dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Carregar estatísticas
      const statsData = await apiService.obterEstatisticas();
      setStats(statsData);

      // Carregar carros recentes
      const carsData = await apiService.listarCarros({ limit: 5 });
      setRecentCars(carsData.carros);
    } catch (error: any) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setError(error.message || "Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Calcular variação percentual (mock para demonstração)
  const getVariation = () => {
    return {
      cars: 12.5,
      revenue: 8.3,
      users: -2.1,
      average: 5.7,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const variation = getVariation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Visão geral do seu estoque de veículos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Veículos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Veículos
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.total_carros || 0}
              </p>
              <div className="flex items-center mt-2">
                {variation.cars > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ml-1 ${
                    variation.cars > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(variation.cars)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs mês anterior
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Preço Médio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Preço Médio</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.preco_medio || "R$ 0,00"}
              </p>
              <div className="flex items-center mt-2">
                {variation.average > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ml-1 ${
                    variation.average > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(variation.average)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs mês anterior
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Veículos por Marca */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Marcas Diferentes
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.carros_por_marca?.length || 0}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">marcas no estoque</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Veículos Adicionados Hoje */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Adicionados Hoje
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {
                  recentCars.filter((car) => {
                    const today = new Date().toDateString();
                    const carDate = new Date(car.data_cadastro).toDateString();
                    return today === carDate;
                  }).length
                }
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">novos veículos</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carros por Marca */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Veículos por Marca
            </h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          {stats?.carros_por_marca && stats.carros_por_marca.length > 0 ? (
            <div className="space-y-4">
              {stats.carros_por_marca.slice(0, 5).map((item, index) => (
                <div
                  key={item.marca}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          "#3B82F6",
                          "#10B981",
                          "#F59E0B",
                          "#EF4444",
                          "#8B5CF6",
                        ][index % 5],
                      }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.marca}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(item.total / stats.total_carros) * 100}%`,
                          backgroundColor: [
                            "#3B82F6",
                            "#10B981",
                            "#F59E0B",
                            "#EF4444",
                            "#8B5CF6",
                          ][index % 5],
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {item.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum dado disponível</p>
            </div>
          )}
        </div>

        {/* Veículos Recentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Veículos Recentes
            </h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>

          {recentCars.length > 0 ? (
            <div className="space-y-4">
              {recentCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {car.imagens && car.imagens.length > 0 ? (
                      <img
                        src={`http://localhost:3001${car.imagens[0]}`}
                        alt={`${car.marca} ${car.modelo}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Car className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {car.marca} {car.modelo}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {car.ano} • {formatPrice(car.preco)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDate(car.data_cadastro)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum veículo recente</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Adicionar Veículo</p>
              <p className="text-sm text-gray-500">Cadastrar novo carro</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Ver Relatórios</p>
              <p className="text-sm text-gray-500">Análises detalhadas</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Gerenciar Usuários</p>
              <p className="text-sm text-gray-500">Controle de acesso</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
