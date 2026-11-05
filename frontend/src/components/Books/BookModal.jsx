import React, { useState, useEffect } from 'react';
import { X, BookOpen } from '../Common/Icons';

export default function BookModal({ isOpen, onClose, onSave, editingBook }) {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    categoria: 'Literatura Clásica',
    editorial: '',
    totalCopias: 1,
    copiasDisponibles: 1,
    ubicacion: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingBook) {
      setFormData({
        titulo: editingBook.titulo || '',
        autor: editingBook.autor || '',
        isbn: editingBook.isbn || '',
        categoria: editingBook.categoria || 'Literatura Clásica',
        editorial: editingBook.editorial || '',
        totalCopias: editingBook.totalCopias ?? 1,
        copiasDisponibles: editingBook.copiasDisponibles ?? 1,
        ubicacion: editingBook.ubicacion || ''
      });
    } else {
      setFormData({
        titulo: '',
        autor: '',
        isbn: '',
        categoria: 'Literatura Clásica',
        editorial: '',
        totalCopias: 3,
        copiasDisponibles: 3,
        ubicacion: 'Estante A-01'
      });
    }
    setErrors({});
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.titulo.trim()) errs.titulo = 'El título es obligatorio';
    if (!formData.autor.trim()) errs.autor = 'El autor es obligatorio';
    if (!formData.isbn.trim()) errs.isbn = 'El ISBN es obligatorio';
    if (Number(formData.totalCopias) <= 0) errs.totalCopias = 'Debe haber al menos 1 copia en total';
    if (Number(formData.copiasDisponibles) < 0) errs.copiasDisponibles = 'Las copias disponibles no pueden ser negativas';
    if (Number(formData.copiasDisponibles) > Number(formData.totalCopias)) {
      errs.copiasDisponibles = 'Las disponibles no pueden superar el total de copias';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      totalCopias: Number(formData.totalCopias),
      copiasDisponibles: Number(formData.copiasDisponibles)
    });
  };

  const categorias = [
    'Literatura Clásica',
    'Novela',
    'Literatura Juvenil',
    'Matemáticas',
    'Ciencias Naturales',
    'Física',
    'Historia y Filosofía',
    'Fantasía',
    'Arte y Música'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingBook ? 'Editar Libro' : 'Nuevo Libro en Catálogo'}
              </h3>
              <p className="text-xs text-slate-500">Gestión de datos de ejemplar y stock</p>
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
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Título del Libro *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ej: El Ingenioso Hidalgo Don Quijote"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition ${
                errors.titulo ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            />
            {errors.titulo && <p className="text-rose-500 text-xs mt-1">{errors.titulo}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Autor *
              </label>
              <input
                type="text"
                value={formData.autor}
                onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                placeholder="Ej: Miguel de Cervantes"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition ${
                  errors.autor ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.autor && <p className="text-rose-500 text-xs mt-1">{errors.autor}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                ISBN *
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-84-376-0494-7"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition ${
                  errors.isbn ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.isbn && <p className="text-rose-500 text-xs mt-1">{errors.isbn}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Categoría
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Editorial
              </label>
              <input
                type="text"
                value={formData.editorial}
                onChange={(e) => setFormData({ ...formData, editorial: e.target.value })}
                placeholder="Ej: Alfaguara, Anaya..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Copias *
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalCopias}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    totalCopias: val,
                    // Si es nuevo libro, igualamos disponibles
                    copiasDisponibles: editingBook ? formData.copiasDisponibles : val
                  });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition ${
                  errors.totalCopias ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.totalCopias && <p className="text-rose-500 text-xs mt-1">{errors.totalCopias}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Disponibles *
              </label>
              <input
                type="number"
                min="0"
                value={formData.copiasDisponibles}
                onChange={(e) => setFormData({ ...formData, copiasDisponibles: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition ${
                  errors.copiasDisponibles ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.copiasDisponibles && <p className="text-rose-500 text-xs mt-1">{errors.copiasDisponibles}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ubicación
              </label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                placeholder="Estante B-03"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
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
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              {editingBook ? 'Guardar Cambios' : 'Añadir Libro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
