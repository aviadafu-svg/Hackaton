import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Search, Plus, AlertTriangle, CheckCircle, Clock } from '../Common/Icons';

export default function LoanList({ loans, onOpenNewLoan, onReturnBook }) {
  const [activeSubTab, setActiveSubTab] = useState('ALL_ACTIVE'); // ALL_ACTIVE, OVERDUE, RETURNED
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Calcular días de retraso
  const getOverdueDays = (expectedDateStr) => {
    const expected = new Date(expectedDateStr);
    const diffTime = today.getTime() - expected.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Clasificación de préstamos
  const activeLoans = useMemo(() => loans.filter(l => !l.fechaDevolucionReal), [loans]);
  const overdueLoans = useMemo(() => activeLoans.filter(l => l.estado === 'Retrasado' || l.fechaDevolucionEsperada < todayStr), [activeLoans, todayStr]);
  const returnedLoans = useMemo(() => loans.filter(l => !!l.fechaDevolucionReal), [loans]);

  // Préstamos a mostrar según la pestaña activa
  const displayedLoans = useMemo(() => {
    let list = [];
    if (activeSubTab === 'ALL_ACTIVE') list = activeLoans;
    else if (activeSubTab === 'OVERDUE') list = overdueLoans;
    else if (activeSubTab === 'RETURNED') list = returnedLoans;

    if (!searchTerm.trim()) return list;

    const term = searchTerm.toLowerCase();
    return list.filter(l =>
      l.libroTitulo?.toLowerCase().includes(term) ||
      l.usuarioNombre?.toLowerCase().includes(term) ||
      l.libroIsbn?.toLowerCase().includes(term)
    );
  }, [activeSubTab, activeLoans, overdueLoans, returnedLoans, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="w-7 h-7 text-indigo-600" /> Préstamos y Control de Devoluciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisión de entregas activas, alertas automáticas de retraso e historial histórico escolar.
          </p>
        </div>
        <button
          onClick={onOpenNewLoan}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md shadow-indigo-500/20 transition"
        >
          <Plus className="w-4 h-4" /> Asignar Nuevo Préstamo
        </button>
      </div>

      {/* Subpestañas y Filtro */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Pestañas de estado */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('ALL_ACTIVE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'ALL_ACTIVE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Activos</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800">
              {activeLoans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('OVERDUE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'OVERDUE'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-rose-600 hover:text-rose-700'
            }`}
          >
            <span>Retrasados</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeSubTab === 'OVERDUE' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'
            }`}>
              {overdueLoans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('RETURNED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'RETURNED'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Devueltos (Historial)</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700">
              {returnedLoans.length}
            </span>
          </button>
        </div>

        {/* Buscador de préstamos */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por libro o alumno..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Tabla de Préstamos */}
      {displayedLoans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Clock className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No hay registros en esta sección</h3>
          <p className="text-xs text-slate-400 mt-1">
            {activeSubTab === 'OVERDUE'
              ? '¡Excelente! No hay alumnos con préstamos retrasados actualmente.'
              : 'No se encontraron préstamos que coincidan con la búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Libro Prestado</th>
                  <th className="py-3.5 px-4">Usuario Escolar</th>
                  <th className="py-3.5 px-4">Fecha Salida</th>
                  <th className="py-3.5 px-4">Fecha Límite</th>
                  <th className="py-3.5 px-4 text-center">Estado / Alerta</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedLoans.map((loan) => {
                  const isReturned = !!loan.fechaDevolucionReal;
                  const isOverdue = !isReturned && (loan.estado === 'Retrasado' || loan.fechaDevolucionEsperada < todayStr);
                  const daysLate = isOverdue ? getOverdueDays(loan.fechaDevolucionEsperada) : 0;

                  return (
                    <tr
                      key={loan.id}
                      className={`transition ${
                        isOverdue ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Libro */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{loan.libroTitulo}</div>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">{loan.libroIsbn}</div>
                        {loan.observaciones && (
                          <div className="text-[11px] text-slate-400 italic mt-1">
                            Obs: "{loan.observaciones}"
                          </div>
                        )}
                      </td>

                      {/* Usuario */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">{loan.usuarioNombre}</div>
                        <span className="inline-block text-[11px] font-medium text-slate-500">
                          {loan.usuarioRol || 'Alumno'}
                        </span>
                      </td>

                      {/* Fecha de Préstamo */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-600">
                        {loan.fechaPrestamo}
                      </td>

                      {/* Fecha Límite */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-600">
                        <div>{loan.fechaDevolucionEsperada}</div>
                        {isReturned && (
                          <div className="text-[11px] text-emerald-600 font-sans font-semibold">
                            Devuelto el {loan.fechaDevolucionReal}
                          </div>
                        )}
                      </td>

                      {/* Estado & Alerta */}
                      <td className="py-4 px-4 text-center">
                        {isReturned ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Devuelto
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Retrasado ({daysLate}d)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3.5 h-3.5" /> En tiempo
                          </span>
                        )}
                      </td>

                      {/* Acción de Devolución */}
                      <td className="py-4 px-4 text-right">
                        {!isReturned ? (
                          <button
                            onClick={() => onReturnBook(loan.id)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow transition active:scale-95 flex items-center gap-1.5 ml-auto"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Registrar Devolución</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Finalizado</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Total mostrados: {displayedLoans.length}</span>
            <span>Histórico de Circulación Escolar</span>
          </div>
        </div>
      )}
    </div>
  );
}
