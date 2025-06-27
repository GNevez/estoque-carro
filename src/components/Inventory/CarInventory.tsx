import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Car,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react";
import apiService from "../../services/api";

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
  usuario?: {
    id: number;
    nome: string;
    email: string;
  };
}

interface CarInventoryProps {
  onAddCar: () => void;
  onEditCar: (car: Car) => void;
  onViewCar: (car: Car) => void;
}

export function CarInventory({
  onAddCar,
  onEditCar,
  onViewCar,
}: CarInventoryProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    marca: "",
    combustivel: "",
    transmissao: "",
    anoMin: "",
    anoMax: "",
    precoMin: "",
    precoMax: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCars, setTotalCars] = useState(0);

  const fuelOptions = [
    { value: "flex", label: "Flex" },
    { value: "gasolina", label: "Gasolina" },
    { value: "etanol", label: "Etanol" },
    { value: "diesel", label: "Diesel" },
    { value: "hibrido", label: "Híbrido" },
    { value: "eletrico", label: "Elétrico" },
  ];

  const transmissionOptions = [
    { value: "manual", label: "Manual" },
    { value: "automatico", label: "Automático" },
    { value: "cvt", label: "CVT" },
  ];

  // Carregar carros
  const loadCars = async () => {
    try {
      setLoading(true);
      setError("");

      const apiFilters: any = {
        limit: 12,
        offset: (currentPage - 1) * 12,
      };

      // Adicionar filtros de busca
      if (searchTerm) {
        apiFilters.marca = searchTerm;
        apiFilters.modelo = searchTerm;
      }

      // Adicionar outros filtros
      Object.keys(filters).forEach((key) => {
        if (filters[key as keyof typeof filters]) {
          apiFilters[key] = filters[key as keyof typeof filters];
        }
      });

      const response = await apiService.listarCarros(apiFilters);
      setCars(response.carros);
      setTotalPages(response.paginas);
      setTotalCars(response.total);
    } catch (error: any) {
      console.error("Erro ao carregar carros:", error);
      setError(error.message || "Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  };

  // Deletar carro
  const handleDeleteCar = async (carId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este veículo?")) {
      return;
    }

    try {
      await apiService.deletarCarro(carId);
      // Recarregar lista
      loadCars();
    } catch (error: any) {
      console.error("Erro ao deletar carro:", error);
      alert(error.message || "Erro ao deletar veículo");
    }
  };

  // Aplicar filtros
  const applyFilters = () => {
    setCurrentPage(1);
    loadCars();
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      marca: "",
      combustivel: "",
      transmissao: "",
      anoMin: "",
      anoMax: "",
      precoMin: "",
      precoMax: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
    loadCars();
  };

  // Carregar carros quando componente montar ou filtros mudarem
  useEffect(() => {
    loadCars();
  }, [currentPage]);

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Formatar quilometragem
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("pt-BR").format(mileage) + " km";
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading && cars.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventário de Veículos
          </h1>
          <p className="text-gray-600">
            {totalCars} veículo{totalCars !== 1 ? "s" : ""} encontrado
            {totalCars !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onAddCar}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Veículo
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por marca ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filtros
          </button>

          {/* Apply Search */}
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  value={filters.marca}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, marca: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Honda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Combustível
                </label>
                <select
                  value={filters.combustivel}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      combustivel: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {fuelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmissão
                </label>
                <select
                  value={filters.transmissao}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      transmissao: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {transmissionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano Mínimo
                </label>
                <input
                  type="number"
                  value={filters.anoMin}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, anoMin: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 2010"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano Máximo
                </label>
                <input
                  type="number"
                  value={filters.anoMax}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, anoMax: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Mínimo
                </label>
                <input
                  type="number"
                  value={filters.precoMin}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      precoMin: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 20000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Máximo
                </label>
                <input
                  type="number"
                  value={filters.precoMax}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      precoMax: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 100000"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Cars Grid */}
      {cars.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum veículo encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.values(filters).some((f) => f)
              ? "Tente ajustar os filtros de busca"
              : "Adicione seu primeiro veículo ao inventário"}
          </p>
          {!searchTerm && !Object.values(filters).some((f) => f) && (
            <button
              onClick={onAddCar}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Adicionar Veículo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Car Image */}
              <div className="relative h-48 bg-gray-100">
                {car.imagens && car.imagens.length > 0 ? (
                  <img
                    src={`http://localhost:3001${car.imagens[0]}`}
                    alt={`${car.marca} ${car.modelo}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      car.ativo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {car.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 left-2 flex gap-1">
                  <button
                    onClick={() => onViewCar(car)}
                    className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onEditCar(car)}
                    className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Car Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {car.marca} {car.modelo}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{car.ano}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium text-green-600">
                      {formatPrice(car.preco)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>{formatMileage(car.quilometragem)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="capitalize">{car.combustivel}</span>
                    <span className="capitalize">{car.transmissao}</span>
                  </div>

                  <div className="text-xs text-gray-500">
                    Adicionado em {formatDate(car.data_cadastro)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <span className="px-3 py-2 text-gray-600">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
