import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Plus, Edit2, Trash2, ArrowLeftRight, CheckCircle, AlertTriangle } from '../Common/Icons';

export default function BookList({ books, onOpenNewBook, onEditBook, onDeleteBook, onLoanBook }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // ALL, AVAILABLE, OUT_OF_STOCK

  // Obtener categorías únicas presentes en la base de datos
  const categories = useMemo(() => {
    const set = new Set(books.map(b => b.categoria).filter(Boolean));
    return Array.from(set);
  }, [books]);

  // Filtrado reactivo en tiempo real
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchSearch =
        book.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.autor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = categoryFilter === 'ALL' || book.categoria === categoryFilter;

      let matchStock = true;
      if (stockFilter === 'AVAILABLE') matchStock = Number(book.copiasDisponibles) > 0;
      if (stockFilter === 'OUT_OF_STOCK') matchStock = Number(book.copiasDisponibles) === 0;

      return matchSearch && matchCategory && matchStock;
    });
  }, [books, searchTerm, categoryFilter, stockFilter]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Cabecera y botón principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" /> Catálogo de Libros Escolares
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestión completa de títulos, códigos ISBN y disponibilidad dinámica de ejemplares.
          </p>
        </div>
        <button
          onClick={onOpenNewBook}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Libro
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, autor o código ISBN..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Filtro Categoría */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Filtro Disponibilidad de Stock */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Todo el Stock</option>
            <option value="AVAILABLE">Con ejemplares disponibles</option>
            <option value="OUT_OF_STOCK">Agotados (0 disp.)</option>
          </select>
        </div>
      </div>

      {/* Resultados de libros */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No se encontraron libros</h3>
          <p className="text-xs text-slate-400 mt-1">Intenta cambiar los términos de búsqueda o filtros.</p>
          {(searchTerm || categoryFilter !== 'ALL' || stockFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setCategoryFilter('ALL'); setStockFilter('ALL'); }}
              className="mt-4 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Título y Autor</th>
                  <th className="py-3.5 px-4">ISBN</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Ubicación</th>
                  <th className="py-3.5 px-4 text-center">Disponibilidad / Stock</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((book) => {
                  const hasStock = Number(book.copiasDisponibles) > 0;
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/80 transition">
                      {/* Título & Autor */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{book.titulo}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{book.autor}</span>
                          {book.editorial && (
                            <>
                              <span>•</span>
                              <span className="text-slate-400">{book.editorial}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* ISBN */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-600">
                        {book.isbn}
                      </td>

                      {/* Categoría */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                          {book.categoria}
                        </span>
                      </td>

                      {/* Ubicación */}
                      <td className="py-4 px-4 text-xs text-slate-600">
                        {book.ubicacion || 'General'}
                      </td>

                      {/* Stock dinámico */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            hasStock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                          }`}
                        >
                          {hasStock ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{book.copiasDisponibles} de {book.totalCopias} disp.</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Agotado (0 / {book.totalCopias})</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Prestar Libro directo */}
                          <button
                            onClick={() => onLoanBook(book)}
                            disabled={!hasStock}
                            title={hasStock ? "Realizar préstamo rápido de este libro" : "Sin ejemplares disponibles para prestar"}
                            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                              hasStock
                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Prestar</span>
                          </button>

                          {/* Editar */}
                          <button
                            onClick={() => onEditBook(book)}
                            title="Editar libro"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => onDeleteBook(book)}
                            title="Eliminar libro"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pie de tabla con conteo */}
          <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Mostrando {filteredBooks.length} de {books.length} títulos</span>
            <span>Inventario Escolar Actualizado</span>
          </div>
        </div>
      )}
    </div>
  );
}
