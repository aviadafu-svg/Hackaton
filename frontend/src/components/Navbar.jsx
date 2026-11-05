import React from 'react';
import { BookOpen, LayoutDashboard, Users, ArrowLeftRight, Plus, RefreshCw } from './Common/Icons';

export default function Navbar({ activeTab, setActiveTab, onOpenNewLoan, mockMode, setMockMode, onResetData }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Catálogo de Libros', icon: BookOpen },
    { id: 'users', label: 'Usuarios Escolares', icon: Users },
    { id: 'loans', label: 'Préstamos y Devoluciones', icon: ArrowLeftRight },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Nombre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                Biblio<span className="text-blue-600">Edu</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Escolar
                </span>
              </span>
              <p className="text-xs text-slate-500 hidden sm:block">Control de Préstamos y Catálogo</p>
            </div>
          </div>

          {/* Menú de pestañas */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Acciones Rápidas & Conexión */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón rápido Nuevo Préstamo */}
            <button
              onClick={onOpenNewLoan}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-600/25 transition duration-150"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo</span> Préstamo
            </button>

            {/* Toggle de Modo Mock / Backend REST */}
            <button
              onClick={() => setMockMode(!mockMode)}
              title={mockMode ? "Modo Local (LocalStorage) activo. Haz clic para cambiar a Backend REST" : "Modo Backend REST activo. Haz clic para cambiar a Modo Local"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                mockMode
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${mockMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="hidden lg:inline">{mockMode ? 'Modo Mock Local' : 'API Backend'}</span>
            </button>

            {/* Botón reiniciar datos de demo */}
            <button
              onClick={onResetData}
              title="Reiniciar datos de prueba"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navegación móvil inferior */}
      <div className="flex md:hidden border-t border-slate-100 bg-white px-2 py-1 justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1.5 px-2 text-xs font-medium ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
