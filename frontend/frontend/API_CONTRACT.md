# 📄 Contrato de Integración API REST — Frontend & Backend
**Hackathon Full-Stack: Sistema de Gestión de Biblioteca Escolar**

Este documento define la especificación técnica de la API REST para que el equipo de **Backend (Node.js/Express + SQLite)** y **Frontend (React)** queden 100% sincronizados sin bloquearse.

---

## ⚙️ Configuración de Conexión
- **URL Base:** `/api` (en desarrollo con proxy automático a `http://localhost:3000`)
- **Headers requeridos:** `Content-Type: application/json`
- **Variable de entorno opcional:** `VITE_API_URL` (ej: `https://mi-backend.onrender.com/api`)

---

## 📚 1. Módulo de Libros (`/api/books`)

### Modelo de Datos (SQLite)
```sql
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  isbn TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  categoria TEXT,
  editorial TEXT,
  totalCopias INTEGER NOT NULL DEFAULT 1,
  copiasDisponibles INTEGER NOT NULL DEFAULT 1,
  ubicacion TEXT
);
```

### Endpoints
| Método | Endpoint | Descripción | Body (Envío) | Respuesta Exitosa |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Listar todos los libros | Ninguno | `200 OK` `[ { id, isbn, titulo, autor, categoria, totalCopias, copiasDisponibles, ... } ]` |
| `POST` | `/api/books` | Crear libro nuevo | `{ isbn, titulo, autor, categoria, editorial, totalCopias, copiasDisponibles, ubicacion }` | `201 Created` `{ id, ... }` |
| `PUT` | `/api/books/:id` | Modificar libro | Campos a actualizar | `200 OK` `{ libroActualizado }` |
| `DELETE` | `/api/books/:id` | Dar de baja libro | Ninguno | `200 OK` `{ success: true, id }` |

---

## 👥 2. Módulo de Usuarios Escolares (`/api/users`)

### Modelo de Datos (SQLite)
```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  matricula TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  rol TEXT NOT NULL CHECK(rol IN ('Alumno', 'Profesor')),
  curso TEXT,
  telefono TEXT,
  estado TEXT NOT NULL DEFAULT 'Activo' CHECK(estado IN ('Activo', 'Inactivo', 'Sancionado'))
);
```

### Endpoints
| Método | Endpoint | Descripción | Body (Envío) | Respuesta Exitosa |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Listar todos los usuarios | Ninguno | `200 OK` `[ { id, matricula, nombre, email, rol, curso, estado, ... } ]` |
| `POST` | `/api/users` | Registrar nuevo usuario | `{ matricula, nombre, email, rol, curso, telefono, estado }` | `201 Created` `{ id, ... }` |
| `PUT` | `/api/users/:id` | Actualizar datos/estado | Campos a actualizar | `200 OK` `{ usuarioActualizado }` |
| `DELETE` | `/api/users/:id` | Eliminar usuario | Ninguno | `200 OK` `{ success: true, id }` |

---

## 🔄 3. Módulo de Préstamos y Devoluciones (`/api/loans`)

### Modelo de Datos (SQLite)
```sql
CREATE TABLE IF NOT EXISTS loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  libroId INTEGER NOT NULL,
  libroTitulo TEXT NOT NULL,
  libroIsbn TEXT,
  usuarioId INTEGER NOT NULL,
  usuarioNombre TEXT NOT NULL,
  usuarioRol TEXT,
  fechaPrestamo TEXT NOT NULL,
  fechaDevolucionEsperada TEXT NOT NULL,
  fechaDevolucionReal TEXT DEFAULT NULL,
  estado TEXT NOT NULL DEFAULT 'Activo' CHECK(estado IN ('Activo', 'Devuelto', 'Retrasado')),
  observaciones TEXT,
  FOREIGN KEY(libroId) REFERENCES books(id),
  FOREIGN KEY(usuarioId) REFERENCES users(id)
);
```

### Endpoints
| Método | Endpoint | Descripción | Regla de Negocio Crítica |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/loans` | Listado de préstamos activos e históricos | Si `fechaDevolucionReal IS NULL` y `fechaDevolucionEsperada < fechaActual`, marcar `estado = 'Retrasado'`. |
| `POST` | `/api/loans` | Crear nuevo préstamo | **Descontar 1 unidad**: `UPDATE books SET copiasDisponibles = copiasDisponibles - 1 WHERE id = libroId`. Validar que `copiasDisponibles > 0`. |
| `PUT` | `/api/loans/:id/return` | Registrar devolución activa | **Reintegrar 1 unidad**: `UPDATE books SET copiasDisponibles = copiasDisponibles + 1 WHERE id = loan.libroId`. Actualizar `fechaDevolucionReal = CURRENT_DATE` y `estado = 'Devuelto'`. |

---

## ⚡ Fallback y Modo Simulado (Frontend)
El Frontend incorpora un **switch visual (Modo Mock Local vs API Backend)**:
- Mientras Backend termina el servidor en SQLite, el Frontend ya funciona al 100% en el navegador con `localStorage`.
- Cuando el Backend esté levantado en `http://localhost:3000`, solo basta con desactivar el mock o conectar la URL base y se comunicará directamente con los endpoints REST definidos arriba.
