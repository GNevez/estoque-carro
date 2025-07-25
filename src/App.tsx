import React, { useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AuthScreen } from "./components/Auth/AuthScreen";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { CarInventory } from "./components/Inventory/CarInventory";
import { AddCarForm } from "./components/AddCar/AddCarForm";
import { EditCarForm } from "./components/EditCar/EditCarForm";
import { CarDetailView } from "./components/ViewCar/CarDetailView";
import { Header } from "./components/Layout/Header";
import { Sidebar } from "./components/Layout/Sidebar";
import { LoadingScreen } from "./components/Layout/LoadingScreen";

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

type View = "dashboard" | "inventory" | "add-car" | "edit-car" | "view-car";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log(
    "🔍 AppContent - isAuthenticated:",
    isAuthenticated,
    "isLoading:",
    isLoading
  );

  if (isLoading) {
    console.log("🔄 Mostrando LoadingScreen");
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    console.log("🔒 Mostrando AuthScreen - usuário não autenticado");
    return <AuthScreen />;
  }

  console.log("✅ Usuário autenticado, mostrando dashboard");

  const handleAddCar = () => {
    setCurrentView("add-car");
    setSelectedCar(null);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setCurrentView("edit-car");
  };

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setCurrentView("view-car");
  };

  const handleCarAdded = () => {
    setCurrentView("inventory");
    setSelectedCar(null);
  };

  const handleBackToInventory = () => {
    setCurrentView("inventory");
    setSelectedCar(null);
  };

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    setSelectedCar(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;

      case "inventory":
        return (
          <CarInventory
            onAddCar={handleAddCar}
            onEditCar={handleEditCar}
            onViewCar={handleViewCar}
          />
        );

      case "add-car":
        return <AddCarForm onCarAdded={handleCarAdded} />;

      case "edit-car":
        return selectedCar ? (
          <EditCarForm
            car={selectedCar}
            onCarUpdated={handleBackToInventory}
            onCancel={handleBackToInventory}
          />
        ) : null;

      case "view-car":
        return selectedCar ? (
          <CarDetailView
            car={selectedCar}
            onEdit={() => handleEditCar(selectedCar)}
            onDelete={handleBackToInventory}
            onBack={handleBackToInventory}
          />
        ) : null;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onNavigation={handleNavigation}
      />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          currentView={currentView}
        />

        {/* Main Content */}
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
