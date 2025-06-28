import React, { useState, useEffect } from "react";
import {
  Car,
  Calendar,
  DollarSign,
  Zap,
  MapPin,
  User,
  ArrowLeft,
  Edit,
  Trash2,
  Check,
  X,
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

interface CarDetailViewProps {
  car: Car;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export function CarDetailView({
  car,
  onEdit,
  onDelete,
  onBack,
}: CarDetailViewProps) {
  const [carData, setCarData] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadCarData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.obterCarro(car.id);
        setCarData(response.carro);
      } catch (error: any) {
        console.error("Erro ao carregar dados do carro:", error);
        setError("Erro ao carregar dados do veículo");
      } finally {
        setIsLoading(false);
      }
    };

    loadCarData();
  }, [car.id]);

  const handleDelete = async () => {
    if (!carData) return;

    try {
      setIsDeleting(true);
      await apiService.deletarCarro(carData.id);
      onDelete();
    } catch (error: any) {
      console.error("Erro ao deletar carro:", error);
      setError(error.message || "Erro ao deletar veículo");
      setIsDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("pt-BR").format(mileage) + " km";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getFuelLabel = (fuel: string) => {
    const fuelLabels: { [key: string]: string } = {
      flex: "Flex",
      gasolina: "Gasolina",
      etanol: "Etanol",
      diesel: "Diesel",
      hibrido: "Híbrido",
      eletrico: "Elétrico",
    };
    return fuelLabels[fuel] || fuel;
  };

  const getTransmissionLabel = (transmission: string) => {
    const transmissionLabels: { [key: string]: string } = {
      manual: "Manual",
      automatico: "Automático",
      cvt: "CVT",
    };
    return transmissionLabels[transmission] || transmission;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do veículo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao inventário
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao inventário
          </button>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Veículo não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao inventário
          </button>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          {carData.marca} {carData.modelo}
        </h1>
        <p className="text-gray-600 mt-2">Detalhes completos do veículo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Fotos do Veículo
          </h2>

          {carData.imagens && carData.imagens.length > 0 ? (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={`http://localhost:3001${carData.imagens[currentImageIndex]}`}
                  alt={`${carData.marca} ${carData.modelo}`}
                  className="w-full h-80 object-cover rounded-lg border border-gray-200"
                />

                {/* Navigation Arrows */}
                {carData.imagens.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex(
                          currentImageIndex === 0
                            ? carData.imagens.length - 1
                            : currentImageIndex - 1
                        )
                      }
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex(
                          currentImageIndex === carData.imagens.length - 1
                            ? 0
                            : currentImageIndex + 1
                        )
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {carData.imagens.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {carData.imagens.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={`http://localhost:3001${image}`}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma foto disponível</p>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Informações Básicas
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  <strong>Ano:</strong> {carData.ano}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  <strong>Preço:</strong>{" "}
                  <span className="text-green-600 font-semibold">
                    {formatPrice(carData.preco)}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  <strong>Quilometragem:</strong>{" "}
                  {formatMileage(carData.quilometragem)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  <strong>Cor:</strong> {carData.cor}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  <strong>Combustível:</strong>{" "}
                  {getFuelLabel(carData.combustivel)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  <strong>Transmissão:</strong>{" "}
                  {getTransmissionLabel(carData.transmissao)}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          {carData.caracteristicas && carData.caracteristicas.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Características
              </h2>

              <div className="grid grid-cols-2 gap-2">
                {carData.caracteristicas.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {carData.descricao && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Descrição
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {carData.descricao}
              </p>
            </div>
          )}

          {/* Owner Info */}
          {carData.usuario && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informações do Proprietário
              </h2>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <strong>Nome:</strong> {carData.usuario.nome}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <strong>Email:</strong> {carData.usuario.email}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Informações Adicionais
            </h2>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    carData.ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {carData.ativo ? "Ativo" : "Inativo"}
                </span>
              </p>
              <p>
                <strong>Data de Cadastro:</strong>{" "}
                {formatDate(carData.data_cadastro)}
              </p>
              <p>
                <strong>Última Atualização:</strong>{" "}
                {formatDate(carData.data_atualizacao)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o veículo{" "}
              <strong>
                {carData.marca} {carData.modelo}
              </strong>
              ? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Excluindo...
                  </div>
                ) : (
                  "Excluir"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
