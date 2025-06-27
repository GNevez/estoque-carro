import React from "react";
import { Home, Car, Plus, X } from "lucide-react";

type View = "dashboard" | "inventory" | "add-car" | "edit-car" | "view-car";

interface SidebarProps {
  currentView: View;
  onNavigation: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  currentView,
  onNavigation,
  isOpen,
  onClose,
}: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard" as View,
      label: "Dashboard",
      icon: Home,
      description: "Visão geral do sistema",
    },
    {
      id: "inventory" as View,
      label: "Estoque",
      icon: Car,
      description: "Gerenciar veículos",
    },
    {
      id: "add-car" as View,
      label: "Adicionar Carro",
      icon: Plus,
      description: "Cadastrar novo veículo",
    },
  ];

  const handleItemClick = (viewId: View) => {
    onNavigation(viewId);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">AutoStock</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-blue-600" : "text-gray-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            isActive ? "text-blue-700" : "text-gray-900"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-xs ${
                            isActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              AutoStock Pro v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
