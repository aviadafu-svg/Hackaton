import React, { useState, useEffect } from 'react';
import { X, Users } from '../Common/Icons';

export default function UserModal({ isOpen, onClose, onSave, editingUser }) {
  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
    email: '',
    rol: 'Alumno',
    curso: '',
    telefono: '',
    estado: 'Activo'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      setFormData({
        nombre: editingUser.nombre || '',
        matricula: editingUser.matricula || '',
        email: editingUser.email || '',
        rol: editingUser.rol || 'Alumno',
        curso: editingUser.curso || '',
        telefono: editingUser.telefono || '',
        estado: editingUser.estado || 'Activo'
      });
    } else {
      setFormData({
        nombre: '',
        matricula: `ALU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        email: '',
        rol: 'Alumno',
        curso: '1º Bachillerato A',
        telefono: '',
        estado: 'Activo'
      });
    }
    setErrors({});
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.nombre.trim()) errs.nombre = 'El nombre completo es obligatorio';
    if (!formData.matricula.trim()) errs.matricula = 'La matrícula o código escolar es obligatoria';
    if (!formData.email.trim()) {
      errs.email = 'El email escolar es obligatorio';
    } else if (!formData.email.includes('@')) {
      errs.email = 'Introduce un email válido';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingUser ? 'Editar Usuario Escolar' : 'Inscribir Alumno / Docente'}
              </h3>
              <p className="text-xs text-slate-500">Membresía y credenciales de biblioteca</p>
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
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Lucía Navarro Martínez"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition ${
                errors.nombre ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            />
            {errors.nombre && <p className="text-rose-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Matrícula / ID Escolar *
              </label>
              <input
                type="text"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                placeholder="ALU-2026-001"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition ${
                  errors.matricula ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.matricula && <p className="text-rose-500 text-xs mt-1">{errors.matricula}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Rol Escolar *
              </label>
              <select
                value={formData.rol}
                onChange={(e) => {
                  const rol = e.target.value;
                  setFormData({
                    ...formData,
                    rol,
                    curso: rol === 'Alumno' ? '3º ESO A' : 'Dpto. Humanidades'
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition bg-white"
              >
                <option value="Alumno">Alumno</option>
                <option value="Profesor">Profesor / Docente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correo Institucional *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@colegio.edu.es"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition ${
                  errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {formData.rol === 'Alumno' ? 'Curso / Grupo' : 'Departamento'}
              </label>
              <input
                type="text"
                value={formData.curso}
                onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                placeholder={formData.rol === 'Alumno' ? 'Ej: 2º Bachillerato B' : 'Ej: Dpto. Ciencias'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="600 123 456"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estado de Membresía
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition bg-white"
              >
                <option value="Activo">Activo (Habilitado para préstamos)</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Sancionado">Sancionado (Por retraso o falta)</option>
              </select>
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
              className="px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20 transition active:scale-95"
            >
              {editingUser ? 'Guardar Cambios' : 'Registrar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
