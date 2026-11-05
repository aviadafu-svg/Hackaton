import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import BookList from './components/Books/BookList';
import BookModal from './components/Books/BookModal';
import UserList from './components/Users/UserList';
import UserModal from './components/Users/UserModal';
import LoanList from './components/Loans/LoanList';
import NewLoanModal from './components/Loans/NewLoanModal';
import Toast from './components/Common/Toast';
import ConfirmModal from './components/Common/ConfirmModal';
import { BookService, UserService, LoanService, isMockMode, setMockMode } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [mock, setMock] = useState(isMockMode());
  const [toast, setToast] = useState(null);

  // Modales
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [preselectedBook, setPreselectedBook] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => setToast(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Carga inicial y recarga reactiva de datos
  const loadData = useCallback(async () => {
    try {
      const [fetchedBooks, fetchedUsers, fetchedLoans] = await Promise.all([
        BookService.getAll(),
        UserService.getAll(),
        LoanService.getAll(),
      ]);
      setBooks(fetchedBooks);
      setUsers(fetchedUsers);
      setLoans(fetchedLoans);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      showToast('Error de comunicación con el origen de datos', 'error');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, mock]);

  const handleToggleMock = (val) => {
    setMockMode(val);
    setMock(val);
    showToast(val ? 'Cambiado a Modo Simulado (LocalStorage)' : 'Cambiado a Modo Backend REST (/api)');
  };

  const handleResetData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restablecer Datos de Demostración',
      message: '¿Deseas recargar los datos escolares iniciales de prueba? Se reiniciarán libros, alumnos y préstamos a los valores iniciales del hackathon.',
      confirmText: 'Restablecer',
      confirmColor: 'bg-indigo-600 hover:bg-indigo-700',
      onConfirm: async () => {
        LoanService.resetData();
        await loadData();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast('Datos de demostración restablecidos con éxito');
      }
    });
  };

  /* ================= OPERACIONES DE LIBROS ================= */
  const handleSaveBook = async (bookData) => {
    try {
      if (editingBook) {
        await BookService.update(editingBook.id, bookData);
        showToast(`Libro "${bookData.titulo}" actualizado correctamente`);
      } else {
        await BookService.create(bookData);
        showToast(`Libro "${bookData.titulo}" añadido al catálogo`);
      }
      setIsBookModalOpen(false);
      setEditingBook(null);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Error al guardar el libro', 'error');
    }
  };

  const handleDeleteBook = (book) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Libro del Catálogo',
      message: `¿Estás seguro de que deseas dar de baja "${book.titulo}"? Esta acción retirará el libro del inventario escolar.`,
      confirmText: 'Eliminar Libro',
      confirmColor: 'bg-rose-600 hover:bg-rose-700',
      onConfirm: async () => {
        try {
          await BookService.delete(book.id);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          showToast(`Libro "${book.titulo}" eliminado`);
          await loadData();
        } catch (err) {
          showToast(err.message || 'Error al eliminar el libro', 'error');
        }
      }
    });
  };

  /* ================= OPERACIONES DE USUARIOS ================= */
  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await UserService.update(editingUser.id, userData);
        showToast(`Usuario "${userData.nombre}" actualizado`);
      } else {
        await UserService.create(userData);
        showToast(`Usuario "${userData.nombre}" registrado con éxito`);
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Error al guardar usuario', 'error');
    }
  };

  const handleDeleteUser = (user) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Usuario Escolar',
      message: `¿Eliminar a "${user.nombre}" (${user.rol}) del registro? No podrá solicitar nuevos préstamos.`,
      confirmText: 'Eliminar Usuario',
      confirmColor: 'bg-rose-600 hover:bg-rose-700',
      onConfirm: async () => {
        try {
          await UserService.delete(user.id);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          showToast(`Usuario "${user.nombre}" eliminado`);
          await loadData();
        } catch (err) {
          showToast(err.message || 'Error al eliminar usuario', 'error');
        }
      }
    });
  };

  /* ================= OPERACIONES DE PRÉSTAMOS ================= */
  const handleCreateLoan = async (loanData) => {
    try {
      await LoanService.create(loanData);
      setIsLoanModalOpen(false);
      setPreselectedBook(null);
      showToast(`Préstamo de "${loanData.libroTitulo}" asignado con éxito (-1 stock)`);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Error al registrar el préstamo', 'error');
    }
  };

  const handleReturnBook = async (loanId) => {
    const loan = loans.find(l => l.id === loanId);
    setConfirmModal({
      isOpen: true,
      title: 'Registrar Devolución de Libro',
      message: `¿Confirmar la devolución de "${loan?.libroTitulo || 'este libro'}" prestado a ${loan?.usuarioNombre || 'el alumno'}? El ejemplar se sumará de nuevo al stock disponible.`,
      confirmText: 'Registrar Devolución (+1 Stock)',
      confirmColor: 'bg-emerald-600 hover:bg-emerald-700',
      onConfirm: async () => {
        try {
          await LoanService.returnBook(loanId);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          showToast(`Devolución completada. Stock reintegrado (+1)`);
          await loadData();
        } catch (err) {
          showToast(err.message || 'Error al registrar la devolución', 'error');
        }
      }
    });
  };

  const handleOpenLoanForBook = (book) => {
    setPreselectedBook(book);
    setIsLoanModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Barra de Navegación Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewLoan={() => {
          setPreselectedBook(null);
          setIsLoanModalOpen(true);
        }}
        mockMode={mock}
        setMockMode={handleToggleMock}
        onResetData={handleResetData}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            books={books}
            users={users}
            loans={loans}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNewLoan={() => {
              setPreselectedBook(null);
              setIsLoanModalOpen(true);
            }}
            onOpenNewBook={() => {
              setEditingBook(null);
              setIsBookModalOpen(true);
            }}
            onOpenNewUser={() => {
              setEditingUser(null);
              setIsUserModalOpen(true);
            }}
            onReturnBook={handleReturnBook}
          />
        )}

        {activeTab === 'books' && (
          <BookList
            books={books}
            onOpenNewBook={() => {
              setEditingBook(null);
              setIsBookModalOpen(true);
            }}
            onEditBook={(book) => {
              setEditingBook(book);
              setIsBookModalOpen(true);
            }}
            onDeleteBook={handleDeleteBook}
            onLoanBook={handleOpenLoanForBook}
          />
        )}

        {activeTab === 'users' && (
          <UserList
            users={users}
            loans={loans}
            onOpenNewUser={() => {
              setEditingUser(null);
              setIsUserModalOpen(true);
            }}
            onEditUser={(user) => {
              setEditingUser(user);
              setIsUserModalOpen(true);
            }}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === 'loans' && (
          <LoanList
            loans={loans}
            onOpenNewLoan={() => {
              setPreselectedBook(null);
              setIsLoanModalOpen(true);
            }}
            onReturnBook={handleReturnBook}
          />
        )}
      </main>

      {/* Modales */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
        editingBook={editingBook}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />

      <NewLoanModal
        isOpen={isLoanModalOpen}
        onClose={() => {
          setIsLoanModalOpen(false);
          setPreselectedBook(null);
        }}
        onSave={handleCreateLoan}
        books={books}
        users={users}
        preselectedBook={preselectedBook}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmColor={confirmModal.confirmColor}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Notificaciones Toast */}
      <Toast toast={toast} onClose={handleCloseToast} />
    </div>
  );
}
