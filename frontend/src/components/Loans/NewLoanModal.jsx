import React, { useState, useEffect } from 'react';
import { X, ArrowLeftRight, BookOpen, Users, AlertTriangle, CheckCircle } from '../Common/Icons';

export default function NewLoanModal({
  isOpen,
  onClose,
  onSave,
  books,
  users,
  preselectedBook = null
}) {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [fechaPrestamo, setFechaPrestamo] = useState('');
  const [fechaDevolucionEsperada, setFechaDevolucionEsperada] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const calculateReturnDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isOpen) {
      setError('');
      setFechaPrestamo(todayStr);
      setFechaDevolucionEsperada(calculateReturnDate(14)); // 14 días estándar escolar
      setObservaciones('');

      if (preselectedBook && Number(preselectedBook.copiasDisponibles) > 0) {
        setSelectedBookId(preselectedBook.id);
      } else {
        const firstAvailable = books.find(b => Number(b.copiasDisponibles) > 0);
        setSelectedBookId(firstAvailable ? firstAvailable.id : '');
      }

      const firstActiveUser = users.find(u => u.estado === 'Activo');
      setSelectedUserId(firstActiveUser ? firstActiveUser.id : '');
    }
  }, [isOpen, preselectedBook, books, users]);

  if (!isOpen) return null;

  const currentBook = books.find(b => b.id === Number(selectedBookId) || b.id === selectedBookId);
  const currentUser = users.find(u => u.id === Number(selectedUserId) || u.id === selectedUserId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedBookId) {
      setError('Debes seleccionar un libro disponible.');
      return;
    }
    if (!selectedUserId) {
      setError('Debes seleccionar un alumno o docente.');
      return;
    }
    if (currentBook && Number(currentBook.copiasDisponibles) <= 0) {
      setError('Este libro no tiene ejemplares disponibles en este momento.');
      return;
    }
    if (!fechaDevolucionEsperada) {
      setError('Indica la fecha máxima de devolución.');
      return;
    }
    if (fechaDevolucionEsperada < fechaPrestamo) {
      setError('La fecha de devolución no puede ser anterior a la fecha de préstamo.');
      return;
    }

    onSave({
      libroId: currentBook.id,
      libroTitulo: currentBook.titulo,
      libroIsbn: currentBook.isbn,
      usuarioId: currentUser.id,
      usuarioNombre: currentUser.nombre,
      usuarioRol: currentUser.rol,
      fechaPrestamo,
      fechaDevolucionEsperada,
      observaciones: observaciones.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Registrar Nuevo Préstamo</h3>
              <p className="text-xs text-slate-500">Descuenta automáticamente 1 unidad del stock disponible</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Selector de Libro */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Libro a Prestar *
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">-- Seleccionar libro --</option>
              {books.map(b => (
                <option 
                  key={b.id} 
                  value={b.id} 
                  disabled={Number(b.copiasDisponibles) <= 0}
                >
                  {b.titulo} — {b.autor} {Number(b.copiasDisponibles) > 0 ? `(${b.copiasDisponibles} disp.)` : '❌ [AGOTADO]'}
                </option>
              ))}
            </select>
            {currentBook && (
              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between text-slate-600">
                <span>ISBN: <strong className="font-mono">{currentBook.isbn}</strong></span>
                <span className={`font-semibold ${currentBook.copiasDisponibles > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Stock actual: {currentBook.copiasDisponibles} de {currentBook.totalCopias}
                </span>
              </div>
            )}
          </div>

          {/* Selector de Usuario */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alumno o Profesor *
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">-- Seleccionar usuario escolar --</option>
              {users.map(u => (
                <option key={u.id} value={u.id} disabled={u.estado === 'Sancionado'}>
                  {u.nombre} ({u.rol} - {u.curso || 'Centro'}) {u.estado === 'Sancionado' ? '⛔ [SANCIONADO]' : ''}
                </option>
              ))}
            </select>
            {currentUser && currentUser.estado === 'Sancionado' && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Este usuario tiene membresía suspendida o sancionada.
              </p>
            )}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fecha de Préstamo
              </label>
              <input
                type="date"
                value={fechaPrestamo}
                onChange={(e) => setFechaPrestamo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fecha Límite Devolución *
              </label>
              <input
                type="date"
                value={fechaDevolucionEsperada}
                onChange={(e) => setFechaDevolucionEsperada(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-mono"
              />
            </div>
          </div>

          {/* Atajos de plazo predefinidos */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Plazos sugeridos:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFechaDevolucionEsperada(calculateReturnDate(7))}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 transition"
              >
                7 días (Express)
              </button>
              <button
                type="button"
                onClick={() => setFechaDevolucionEsperada(calculateReturnDate(14))}
                className="px-2.5 py-1 text-xs rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 font-semibold text-blue-700 transition"
              >
                14 días (Estándar Alumno)
              </button>
              <button
                type="button"
                onClick={() => setFechaDevolucionEsperada(calculateReturnDate(30))}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 transition"
              >
                30 días (Docente)
              </button>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Observaciones (Opcional)
            </label>
            <textarea
              rows="2"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: Ejemplar con cubierta forrada, entrega para trabajo de evaluación..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Confirmar Préstamo (-1 Stock)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
