export const INITIAL_BOOKS = [
  {
    id: 1,
    isbn: "978-84-376-0494-7",
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    categoria: "Literatura Clásica",
    editorial: "Cátedra",
    totalCopias: 5,
    copiasDisponibles: 3,
    ubicacion: "Estante A-12"
  },
  {
    id: 2,
    isbn: "978-03-074-7472-8",
    titulo: "Cien Años de Soledad",
    autor: "Gabriel García Márquez",
    categoria: "Novela",
    editorial: "Debolsillo",
    totalCopias: 4,
    copiasDisponibles: 2,
    ubicacion: "Estante B-04"
  },
  {
    id: 3,
    isbn: "978-60-774-4530-2",
    titulo: "Álgebra Elemental",
    autor: "Aurelio Baldor",
    categoria: "Matemáticas",
    editorial: "Grupo Editorial Patria",
    totalCopias: 6,
    copiasDisponibles: 5,
    ubicacion: "Estante M-01"
  },
  {
    id: 4,
    isbn: "978-95-006-0334-8",
    titulo: "Biología Celular y Molecular",
    autor: "Helena Curtis",
    categoria: "Ciencias Naturales",
    editorial: "Médica Panamericana",
    totalCopias: 3,
    copiasDisponibles: 1,
    ubicacion: "Estante C-08"
  },
  {
    id: 5,
    isbn: "978-01-560-1398-7",
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    categoria: "Literatura Juvenil",
    editorial: "Reynal & Hitchcock",
    totalCopias: 8,
    copiasDisponibles: 0, // Agotado para probar alerta de stock
    ubicacion: "Estante J-03"
  },
  {
    id: 6,
    isbn: "978-60-732-3302-6",
    titulo: "Física Conceptual",
    autor: "Paul G. Hewitt",
    categoria: "Física",
    editorial: "Pearson",
    totalCopias: 4,
    copiasDisponibles: 4,
    ubicacion: "Estante F-02"
  },
  {
    id: 7,
    isbn: "978-84-788-8445-2",
    titulo: "Harry Potter y la Piedra Filosofal",
    autor: "J.K. Rowling",
    categoria: "Fantasía",
    editorial: "Salamandra",
    totalCopias: 5,
    copiasDisponibles: 2,
    ubicacion: "Estante J-09"
  }
];

export const INITIAL_USERS = [
  {
    id: 1,
    matricula: "ALU-2026-001",
    nombre: "Sofía Martínez Ruiz",
    email: "sofia.martinez@colegio.edu.es",
    rol: "Alumno",
    curso: "4º ESO B",
    estado: "Activo",
    telefono: "611 223 344"
  },
  {
    id: 2,
    matricula: "ALU-2026-042",
    nombre: "Lucas Gómez Morales",
    email: "lucas.gomez@colegio.edu.es",
    rol: "Alumno",
    curso: "2º Bachillerato A",
    estado: "Activo",
    telefono: "622 334 455"
  },
  {
    id: 3,
    matricula: "PROF-2024-008",
    nombre: "Prof. Carmen Navarro",
    email: "carmen.navarro@colegio.edu.es",
    rol: "Profesor",
    curso: "Dpto. Lengua y Literatura",
    estado: "Activo",
    telefono: "633 445 566"
  },
  {
    id: 4,
    matricula: "PROF-2023-015",
    nombre: "Prof. Alejandro Vega",
    email: "alejandro.vega@colegio.edu.es",
    rol: "Profesor",
    curso: "Dpto. Ciencias Naturales",
    estado: "Activo",
    telefono: "644 556 677"
  },
  {
    id: 5,
    matricula: "ALU-2026-089",
    nombre: "Mateo Fernández Torres",
    email: "mateo.fernandez@colegio.edu.es",
    rol: "Alumno",
    curso: "1º ESO C",
    estado: "Sancionado",
    telefono: "655 667 788"
  }
];

// Fechas dinámicas para pruebas
const today = new Date();
const formatDate = (date) => date.toISOString().split('T')[0];

const datePast10 = new Date(today);
datePast10.setDate(today.getDate() - 20);

const datePastOverdue = new Date(today);
datePastOverdue.setDate(today.getDate() - 5); // Venció hace 5 días

const datePast5 = new Date(today);
datePast5.setDate(today.getDate() - 5);

const dateFuture9 = new Date(today);
dateFuture9.setDate(today.getDate() + 9);

export const INITIAL_LOANS = [
  {
    id: 1,
    libroId: 5,
    libroTitulo: "El Principito",
    libroIsbn: "978-01-560-1398-7",
    usuarioId: 1,
    usuarioNombre: "Sofía Martínez Ruiz",
    usuarioRol: "Alumno",
    fechaPrestamo: formatDate(datePast10),
    fechaDevolucionEsperada: formatDate(datePastOverdue), // ¡Retrasado!
    fechaDevolucionReal: null,
    estado: "Retrasado",
    observaciones: "Notificación de aviso enviada por email"
  },
  {
    id: 2,
    libroId: 4,
    libroTitulo: "Biología Celular y Molecular",
    usuarioId: 4,
    usuarioNombre: "Prof. Alejandro Vega",
    usuarioRol: "Profesor",
    libroIsbn: "978-95-006-0334-8",
    fechaPrestamo: formatDate(datePast5),
    fechaDevolucionEsperada: formatDate(dateFuture9), // Al día
    fechaDevolucionReal: null,
    estado: "Activo",
    observaciones: "Préstamo docente para preparación de clase"
  },
  {
    id: 3,
    libroId: 1,
    libroTitulo: "Don Quijote de la Mancha",
    libroIsbn: "978-84-376-0494-7",
    usuarioId: 2,
    usuarioNombre: "Lucas Gómez Morales",
    usuarioRol: "Alumno",
    fechaPrestamo: "2026-10-10",
    fechaDevolucionEsperada: "2026-10-24",
    fechaDevolucionReal: "2026-10-22",
    estado: "Devuelto",
    observaciones: "Devuelto en perfecto estado"
  }
];
