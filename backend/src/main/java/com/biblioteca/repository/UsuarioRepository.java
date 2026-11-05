package com.biblioteca.repository;

import com.biblioteca.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * REPOSITORIO DE DATOS: UsuarioRepository
 * ============================================================================
 * 
 * ¿QUÉ ES Y CUÁL ES SU ROL?
 * Es la capa de acceso a datos (Data Access Layer). 
 * Se encarga de comunicarse directamente con la base de datos (H2 / SQLite)
 * para realizar las operaciones SQL (SELECT, INSERT, UPDATE, DELETE).
 * 
 * LA MAGIA DE SPRING DATA JPA:
 * Al extender 'JpaRepository<Usuario, Long>':
 *   - NO necesitas escribir código de implementación ni sentencias SQL manuales.
 *   - Spring genera automáticamente en tiempo de ejecución las consultas SQL.
 * 
 * MÉTODOS HEREDADOS AUTOMÁTICAMENTE:
 *   - save(usuario): Guarda un nuevo usuario o actualiza si ya tiene ID (INSERT / UPDATE).
 *   - findById(id): Busca un usuario por su clave primaria (SELECT ... WHERE id = ?).
 *   - findAll(): Devuelve todos los usuarios (SELECT * FROM usuarios).
 *   - deleteById(id): Elimina un usuario por su ID (DELETE FROM usuarios WHERE id = ?).
 *   - count(): Cuenta el total de filas registradas.
 */

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * BUSCAR POR EMAIL:
     * Spring Data analiza el nombre del método "findBy" + "Email" y genera:
     * SQL: SELECT * FROM usuarios WHERE email = ?
     * 
     * Retorna un Optional<Usuario> para evitar el temido NullPointerException.
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * VERIFICAR SI UN EMAIL YA EXISTE:
     * SQL: SELECT COUNT(*) > 0 FROM usuarios WHERE email = ?
     * Útil en el Service para validar antes de registrar y no duplicar correos.
     */
    boolean existsByEmail(String email);

    /**
     * FILTRAR POR ROL:
     * SQL: SELECT * FROM usuarios WHERE rol = ?
     * Ejemplo: buscar todos los alumnos o todos los profesores.
     */
    List<Usuario> findByRol(String rol);

    /**
     * FILTRAR POR ESTADO (ACTIVOS / INACTIVOS):
     * SQL: SELECT * FROM usuarios WHERE activo = ?
     * Ejemplo: findByActivo(true) devuelve solo los usuarios habilitados para pedir libros.
     */
    List<Usuario> findByActivo(Boolean activo);

    /**
     * FILTRAR COMBINADO (ROL Y ESTADO):
     * SQL: SELECT * FROM usuarios WHERE rol = ? AND activo = ?
     * Ejemplo: Buscar solo los "ALUMNOS" que estén "ACTIVOS".
     */
    List<Usuario> findByRolAndActivo(String rol, Boolean activo);
}
