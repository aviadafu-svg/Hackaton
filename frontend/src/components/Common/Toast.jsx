import React from 'react';
import { CheckCircle, AlertTriangle, X } from './Icons';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl bg-white border border-slate-200 text-slate-800 transition-all duration-300 animate-fade-in max-w-md">
      <div className={`p-2 rounded-lg ${isSuccess ? 'bg-emerald-100 text-emerald-600' : isError ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
        {isSuccess ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      </div>
      <div className="flex-1 text-sm font-medium">
        <p className="font-semibold text-slate-900">{isSuccess ? 'Éxito' : isError ? 'Error' : 'Notificación'}</p>
        <p className="text-slate-600 text-xs mt-0.5">{toast.message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
