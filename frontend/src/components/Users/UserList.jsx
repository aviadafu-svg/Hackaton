import React, { useState, useMemo } from 'react';
import { Users, Search, Plus, Edit2, Trash2, GraduationCap, AlertTriangle, CheckCircle } from '../Common/Icons';

export default function UserList({ users, loans, onOpenNewUser, onEditUser, onDeleteUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Calcular número de préstamos activos por usuario
  const activeLoansCountByUser = useMemo(() => {
    const map = {};
    loans.forEach(loan => {
      if (!loan.fechaDevolucionReal) {
        map[loan.usuarioId] = (map[loan.usuarioId] || 0) + 1;
      }
    });
    return map;
  }, [loans]);

  // Filtrado reactivo
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch =
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.matricula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.curso?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = roleFilter === 'ALL' || user.rol === roleFilter;
      const matchStatus = statusFilter === 'ALL' || user.estado === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-600" /> Registro de Usuarios Escolares
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Alumnos y profesorado habilitados para el préstamo de libros y control de sanciones.
          </p>
        </div>
        <button
          onClick={onOpenNewUser}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 rounded-xl shadow-md shadow-purple-500/20 transition"
        >
          <Plus className="w-4 h-4" /> Registrar Usuario
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email, curso o matrícula..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
          />
        </div>

        {/* Filtro Rol */}
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="ALL">Todos los Roles</option>
            <option value="Alumno">Alumnos</option>
            <option value="Profesor">Profesores / Docentes</option>
          </select>

          {/* Filtro Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
            <option value="Sancionado">Sancionados</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No se encontraron usuarios</h3>
          <p className="text-xs text-slate-400 mt-1">Prueba con otros términos de búsqueda o filtros.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Usuario Escolar</th>
                  <th className="py-3.5 px-4">Matrícula / ID</th>
                  <th className="py-3.5 px-4">Rol & Curso/Dpto</th>
                  <th className="py-3.5 px-4">Contacto</th>
                  <th className="py-3.5 px-4 text-center">Préstamos Activos</th>
                  <th className="py-3.5 px-4 text-center">Membresía</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const activeCount = activeLoansCountByUser[user.id] || 0;
                  const isTeacher = user.rol === 'Profesor';
                  const isSancionado = user.estado === 'Sancionado';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                      {/* Nombre & Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.nombre.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.nombre}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Matrícula */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-600">
                        {user.matricula}
                      </td>

                      {/* Rol & Curso */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isTeacher ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          <GraduationCap className="w-3 h-3" />
                          {user.rol}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">{user.curso || 'No especificado'}</div>
                      </td>

                      {/* Teléfono */}
                      <td className="py-4 px-4 text-xs text-slate-600">
                        {user.telefono || '—'}
                      </td>

                      {/* Libros en posesión actual */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold ${
                          activeCount > 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {activeCount} {activeCount === 1 ? 'libro' : 'libros'}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.estado === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isSancionado
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {user.estado === 'Activo' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : isSancionado ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : null}
                          {user.estado}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditUser(user)}
                            title="Editar usuario"
                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteUser(user)}
                            title="Eliminar usuario"
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
          <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Total usuarios: {filteredUsers.length}</span>
            <span>Censo Escolar</span>
          </div>
        </div>
      )}
    </div>
  );
}
