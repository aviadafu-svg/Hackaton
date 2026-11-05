import React from 'react';
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, CheckCircle, Plus, Clock } from './Common/Icons';

export default function Dashboard({
  books,
  users,
  loans,
  onNavigate,
  onOpenNewLoan,
  onOpenNewBook,
  onOpenNewUser,
  onReturnBook
}) {
  // Cálculos estadísticos
  const totalBooks = books.length;
  const totalCopies = books.reduce((acc, b) => acc + (Number(b.totalCopias) || 0), 0);
  const availableCopies = books.reduce((acc, b) => acc + (Number(b.copiasDisponibles) || 0), 0);
  
  const activeLoans = loans.filter(l => !l.fechaDevolucionReal);
  const overdueLoans = activeLoans.filter(l => l.estado === 'Retrasado');
  const returnedLoans = loans.filter(l => l.fechaDevolucionReal);

  const totalUsers = users.length;
  const studentsCount = users.filter(u => u.rol === 'Alumno').length;
  const teachersCount = users.filter(u => u.rol === 'Profesor').length;

  const outOfStockBooks = books.filter(b => b.copiasDisponibles === 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Banner de Bienvenida y Resumen */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3 text-blue-100">
            Panel de Control Escolar
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sistema de Gestión Bibliotecaria
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Supervisa el inventario escolar, administra el flujo de préstamos a alumnos y profesores y controla las alertas de retraso en tiempo real.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenNewLoan}
              className="px-4 py-2 text-sm font-semibold text-blue-900 bg-white hover:bg-blue-50 rounded-xl shadow-md transition transform active:scale-95"
            >
              + Prestar Libro
            </button>
            <button
              onClick={onOpenNewBook}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600/60 hover:bg-blue-600/90 border border-white/20 rounded-xl transition"
            >
              + Añadir al Catálogo
            </button>
            <button
              onClick={() => onNavigate('loans')}
              className="px-4 py-2 text-sm font-semibold text-white bg-transparent hover:bg-white/10 rounded-xl transition"
            >
              Ver Todos los Préstamos →
            </button>
          </div>
        </div>

        {/* Círculo decorativo de fondo */}
        <div className="absolute -right-12 -bottom-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Alerta de Retrasos Críticos */}
      {overdueLoans.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-sm animate-pulse">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-rose-900">
                ¡Atención! {overdueLoans.length} Préstamo(s) con Fecha Vencida
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-200 text-rose-800">
                Urgente
              </span>
            </div>
            <p className="text-sm text-rose-700 mt-1">
              Hay alumnos con préstamos que han sobrepasado la fecha límite estipulada. Revisa los detalles para gestionar la devolución o aplicar sanciones de membresía.
            </p>
            <div className="mt-3">
              <button
                onClick={() => onNavigate('loans')}
                className="text-xs font-bold text-rose-800 hover:text-rose-950 underline underline-offset-4"
              >
                Revisar préstamos retrasados inmediatamente →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas de Métricas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Libros */}
        <div 
          onClick={() => onNavigate('books')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">Títulos en Catálogo</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalBooks}</span>
            <span className="text-xs text-slate-500 font-medium">({totalCopies} ejemplares)</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> {availableCopies} disponibles ahora
          </p>
        </div>

        {/* Préstamos Activos */}
        <div 
          onClick={() => onNavigate('loans')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">Préstamos en Curso</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeLoans.length}</span>
            <span className="text-xs text-slate-500 font-medium">activos</span>
          </div>
          <p className="text-xs text-indigo-600 font-medium mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {returnedLoans.length} devueltos en histórico
          </p>
        </div>

        {/* Retrasos / Alertas */}
        <div 
          onClick={() => onNavigate('loans')}
          className={`p-5 rounded-2xl border transition cursor-pointer group ${
            overdueLoans.length > 0
              ? 'bg-rose-50/60 border-rose-200 shadow-sm hover:shadow-md'
              : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold tracking-wider uppercase ${overdueLoans.length > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
              Alertas de Retraso
            </span>
            <div className={`p-2.5 rounded-xl group-hover:scale-110 transition ${overdueLoans.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${overdueLoans.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueLoans.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">vencidos</span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-2">
            {overdueLoans.length > 0 ? 'Requieren devolución inmediata' : 'Al día, sin retrasos'}
          </p>
        </div>

        {/* Usuarios Registrados */}
        <div 
          onClick={() => onNavigate('users')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">Comunidad Escolar</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalUsers}</span>
            <span className="text-xs text-slate-500 font-medium">usuarios</span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-2 flex items-center gap-2">
            <span>🎓 {studentsCount} Alumnos</span>
            <span>•</span>
            <span>👩‍🏫 {teachersCount} Docentes</span>
          </p>
        </div>
      </div>

      {/* Grid de Secciones de Operaciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Préstamos Activos Recientes (2 columnas) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Préstamos Activos Recientes</h2>
              <p className="text-xs text-slate-500">Últimos libros entregados a usuarios</p>
            </div>
            <button
              onClick={() => onNavigate('loans')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Ver historial completo →
            </button>
          </div>

          {activeLoans.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
              <p className="text-sm font-medium text-slate-600">No hay libros prestados actualmente.</p>
              <button
                onClick={onOpenNewLoan}
                className="mt-3 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                Crear primer préstamo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Libro</th>
                    <th className="pb-3">Usuario</th>
                    <th className="pb-3">Vencimiento</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeLoans.slice(0, 5).map((loan) => {
                    const isOverdue = loan.estado === 'Retrasado';
                    return (
                      <tr key={loan.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 pr-2 font-medium text-slate-900">
                          {loan.libroTitulo}
                        </td>
                        <td className="py-3 pr-2 text-slate-600 text-xs">
                          <div>{loan.usuarioNombre}</div>
                          <span className="text-[10px] text-slate-400">{loan.usuarioRol}</span>
                        </td>
                        <td className="py-3 pr-2 text-xs font-mono">
                          {loan.fechaDevolucionEsperada}
                        </td>
                        <td className="py-3 pr-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              isOverdue
                                ? 'bg-rose-100 text-rose-700 animate-pulse'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {isOverdue ? '⚠️ Retrasado' : 'Al día'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => onReturnBook(loan.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
                          >
                            Devolver
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Columna Derecha: Alertas de Stock y Atajos Rápidos */}
        <div className="space-y-6">
          {/* Libros con Stock Agotado o Bajo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Estado de Stock</h2>
            <p className="text-xs text-slate-500 mb-4">Ejemplares con baja o nula disponibilidad</p>

            {outOfStockBooks.length === 0 ? (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Todos los libros tienen ejemplares disponibles.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {outOfStockBooks.map(book => (
                  <div key={book.id} className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-amber-900">{book.titulo}</p>
                      <p className="text-amber-700 text-[11px]">{book.autor} • {book.categoria}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 font-bold text-amber-900">
                      0 disp. / {book.totalCopias}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('books')}
              className="mt-4 w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center block"
            >
              Gestionar Inventario de Libros
            </button>
          </div>

          {/* Accesos rápidos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">Atajos Rápidos</h2>
            <div className="space-y-2">
              <button
                onClick={onOpenNewBook}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-semibold text-slate-700 border border-slate-100"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Nuevo Libro
                </span>
                <span>+</span>
              </button>
              <button
                onClick={onOpenNewUser}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 transition text-xs font-semibold text-slate-700 border border-slate-100"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" /> Registrar Alumno/Profesor
                </span>
                <span>+</span>
              </button>
              <button
                onClick={onOpenNewLoan}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition text-xs font-semibold text-slate-700 border border-slate-100"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-indigo-600" /> Registrar Préstamo
                </span>
                <span>+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
