import { INITIAL_BOOKS, INITIAL_USERS, INITIAL_LOANS } from './mockData';

// Claves de LocalStorage para modo simulado/desconectado
const STORAGE_KEYS = {
  BOOKS: 'biblio_books',
  USERS: 'biblio_users',
  LOANS: 'biblio_loans',
  MODE: 'biblio_use_mock'
};

// Inicialización de LocalStorage con datos por defecto si está vacío
const initializeLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOANS)) {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOANS));
  }
};

initializeLocalStorage();

export const isMockMode = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.MODE);
  return saved !== null ? JSON.parse(saved) : true; // Por defecto modo mock activo para desarrollo frontend ágil
};

export const setMockMode = (enabled) => {
  localStorage.setItem(STORAGE_KEYS.MODE, JSON.stringify(enabled));
};

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper para llamadas al backend
async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
  }

  return response.json();
}

/* ========================================================
   SERVICIOS DE LIBROS
   ======================================================== */
export const BookService = {
  async getAll() {
    if (!isMockMode()) {
      try {
        return await request('/books');
      } catch (err) {
        console.warn('Fallo al conectar con Backend REST, usando datos locales:', err);
      }
    }
    const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return data ? JSON.parse(data) : [];
  },

  async create(bookData) {
    if (!isMockMode()) {
      try {
        return await request('/books', {
          method: 'POST',
          body: JSON.stringify(bookData),
        });
      } catch (err) {
        console.warn('Fallo Backend, guardando en local:', err);
      }
    }
    const books = await this.getAll();
    const newBook = {
      ...bookData,
      id: Date.now(),
      totalCopias: Number(bookData.totalCopias) || 1,
      copiasDisponibles: Number(bookData.copiasDisponibles ?? bookData.totalCopias) || 1
    };
    books.unshift(newBook);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    return newBook;
  },

  async update(id, bookData) {
    if (!isMockMode()) {
      try {
        return await request(`/books/${id}`, {
          method: 'PUT',
          body: JSON.stringify(bookData),
        });
      } catch (err) {
        console.warn('Fallo Backend, actualizando local:', err);
      }
    }
    const books = await this.getAll();
    const index = books.findIndex(b => b.id === Number(id) || b.id === id);
    if (index === -1) throw new Error("Libro no encontrado");

    books[index] = { ...books[index], ...bookData };
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    return books[index];
  },

  async delete(id) {
    if (!isMockMode()) {
      try {
        return await request(`/books/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Fallo Backend, eliminando local:', err);
      }
    }
    const books = await this.getAll();
    const filtered = books.filter(b => b.id !== Number(id) && b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(filtered));
    return { success: true, id };
  }
};

/* ========================================================
   SERVICIOS DE USUARIOS (ALUMNOS Y PROFESORES)
   ======================================================== */
export const UserService = {
  async getAll() {
    if (!isMockMode()) {
      try {
        return await request('/users');
      } catch (err) {
        console.warn('Fallo al conectar con Backend REST, usando datos locales:', err);
      }
    }
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  async create(userData) {
    if (!isMockMode()) {
      try {
        return await request('/users', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
      } catch (err) {
        console.warn('Fallo Backend, guardando en local:', err);
      }
    }
    const users = await this.getAll();
    const newUser = {
      ...userData,
      id: Date.now(),
      estado: userData.estado || 'Activo'
    };
    users.unshift(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  async update(id, userData) {
    if (!isMockMode()) {
      try {
        return await request(`/users/${id}`, {
          method: 'PUT',
          body: JSON.stringify(userData),
        });
      } catch (err) {
        console.warn('Fallo Backend, actualizando local:', err);
      }
    }
    const users = await this.getAll();
    const index = users.findIndex(u => u.id === Number(id) || u.id === id);
    if (index === -1) throw new Error("Usuario no encontrado");

    users[index] = { ...users[index], ...userData };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[index];
  },

  async delete(id) {
    if (!isMockMode()) {
      try {
        return await request(`/users/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Fallo Backend, eliminando local:', err);
      }
    }
    const users = await this.getAll();
    const filtered = users.filter(u => u.id !== Number(id) && u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
    return { success: true, id };
  }
};

/* ========================================================
   SERVICIOS DE PRÉSTAMOS (FLUJO DE PRÉSTAMO Y STOCK)
   ======================================================== */
export const LoanService = {
  async getAll() {
    if (!isMockMode()) {
      try {
        return await request('/loans');
      } catch (err) {
        console.warn('Fallo al conectar con Backend REST, usando datos locales:', err);
      }
    }
    const data = localStorage.getItem(STORAGE_KEYS.LOANS);
    const loans = data ? JSON.parse(data) : [];
    
    // Actualizar automáticamente estado 'Retrasado' si la fecha esperada venció y no se ha devuelto
    const todayStr = new Date().toISOString().split('T')[0];
    return loans.map(loan => {
      if (!loan.fechaDevolucionReal && loan.fechaDevolucionEsperada < todayStr) {
        return { ...loan, estado: 'Retrasado' };
      }
      return loan;
    });
  },

  async create(loanData) {
    if (!isMockMode()) {
      try {
        return await request('/loans', {
          method: 'POST',
          body: JSON.stringify(loanData),
        });
      } catch (err) {
        console.warn('Fallo Backend, guardando préstamo en local:', err);
      }
    }

    // Regla de Negocio: Descuento de stock en el libro
    const books = await BookService.getAll();
    const bookIndex = books.findIndex(b => b.id === Number(loanData.libroId) || b.id === loanData.libroId);
    
    if (bookIndex === -1) {
      throw new Error("El libro seleccionado no existe");
    }
    if (books[bookIndex].copiasDisponibles <= 0) {
      throw new Error("No hay ejemplares disponibles para préstamo de este libro");
    }

    // Descontar 1 copia disponible
    books[bookIndex].copiasDisponibles -= 1;
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));

    // Registrar nuevo préstamo
    const loans = await this.getAll();
    const newLoan = {
      ...loanData,
      id: Date.now(),
      libroTitulo: books[bookIndex].titulo,
      libroIsbn: books[bookIndex].isbn,
      fechaPrestamo: loanData.fechaPrestamo || new Date().toISOString().split('T')[0],
      fechaDevolucionReal: null,
      estado: 'Activo'
    };

    loans.unshift(newLoan);
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
    return newLoan;
  },

  async returnBook(loanId) {
    if (!isMockMode()) {
      try {
        return await request(`/loans/${loanId}/return`, { method: 'PUT' });
      } catch (err) {
        console.warn('Fallo Backend, procesando devolución en local:', err);
      }
    }

    const loans = await this.getAll();
    const loanIndex = loans.findIndex(l => l.id === Number(loanId) || l.id === loanId);
    if (loanIndex === -1) throw new Error("Préstamo no encontrado");

    const loan = loans[loanIndex];
    if (loan.fechaDevolucionReal) {
      throw new Error("Este libro ya fue devuelto con anterioridad");
    }

    // Regla de negocio: Al devolver se reincorpora la copia al stock
    const books = await BookService.getAll();
    const bookIndex = books.findIndex(b => b.id === Number(loan.libroId) || b.id === loan.libroId);
    if (bookIndex !== -1) {
      books[bookIndex].copiasDisponibles = Math.min(
        books[bookIndex].copiasDisponibles + 1,
        books[bookIndex].totalCopias
      );
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    }

    loan.fechaDevolucionReal = new Date().toISOString().split('T')[0];
    loan.estado = 'Devuelto';
    loans[loanIndex] = loan;
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

    return loan;
  },

  // Resetear a datos iniciales de fábrica para demo
  resetData() {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOANS));
  }
};
