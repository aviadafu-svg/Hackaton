package com.biblioteca.service;

import com.biblioteca.model.Usuario;
import com.biblioteca.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * ============================================================================
 * CAPA DE SERVICIO / LÓGICA DE NEGOCIO: UsuarioService
 * ============================================================================
 * 
 * ¿QUÉ ES Y CUÁL ES SU ROL?
 * Es el "cerebro" del módulo de usuarios.
 * Aquí residen todas las reglas de negocio, validaciones y coordinación de datos.
 * 
 * RESPONSABILIDADES:
 *   1. Aplicar reglas de negocio (ej: comprobar que no se duplique un email).
 *   2. Comunicarse con UsuarioRepository para leer y guardar datos en la BD.
 *   3. Lanzar excepciones con códigos HTTP adecuados si algo falla (ej: 404 Not Found, 400 Bad Request).
 *   4. Gestionar transacciones de base de datos con @Transactional.
 */

// @Service:
// Indica a Spring que esta clase contiene lógica de negocio y debe registrarse
// en el contenedor de dependencias para poder inyectarse en los controladores.
@Service
public class UsuarioService {

    // Repositorio inyectado mediante constructor (inmutable)
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // ========================================================================
    // 1. OBTENER TODOS LOS USUARIOS
    // ========================================================================
    /**
     * @Transactional(readOnly = true):
     * Optimiza la conexión a la base de datos al ser una consulta de solo lectura
     * (evita que Hibernate gaste memoria revisando si los objetos cambiaron).
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // ========================================================================
    // 2. BUSCAR UN USUARIO POR SU ID
    // ========================================================================
    /**
     * Busca por ID. Si no lo encuentra, lanza automáticamente un error 404 (NOT_FOUND).
     * 
     * TRUCO PROFESIONAL:
     * Usar 'ResponseStatusException' evita tener que crear clases de excepción manuales,
     * y Spring Boot genera de inmediato una respuesta JSON con código 404.
     */
    @Transactional(readOnly = true)
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con ID: " + id
                ));
    }

    // ========================================================================
    // 3. REGISTRAR UN NUEVO USUARIO
    // ========================================================================
    /**
     * REGLAS DE NEGOCIO APLICADAS:
     *   - Valida que el email no esté registrado previamente (evita duplicados).
     *   - Normaliza el rol a mayúsculas ("ALUMNO" o "PROFESOR").
     *   - Garantiza que el usuario inicie en estado activo.
     */
    @Transactional
    public Usuario guardar(Usuario usuario) {
        // Regla 1: Comprobar unicidad de email
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El email '" + usuario.getEmail() + "' ya está registrado en el sistema"
            );
        }

        // Regla 2: Normalizar rol a mayúsculas
        if (usuario.getRol() != null) {
            usuario.setRol(usuario.getRol().trim().toUpperCase());
        }

        // Regla 3: Si no se especificó 'activo', inicia como true
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }

        return usuarioRepository.save(usuario);
    }

    // ========================================================================
    // 4. ACTUALIZAR UN USUARIO EXISTENTE
    // ========================================================================
    /**
     * Actualiza los datos de un usuario existente.
     * Pasos:
     *   1. Busca el usuario actual; si no existe, falla con 404.
     *   2. Si el email cambió, verifica que el nuevo email no esté en uso por otra persona.
     *   3. Sobreescribe los campos modificables y persiste los cambios.
     */
    @Transactional
    public Usuario actualizar(Long id, Usuario datosNuevos) {
        Usuario usuarioExistente = obtenerPorId(id);

        // Si cambió el email, validar que no choque con otro usuario
        if (!usuarioExistente.getEmail().equalsIgnoreCase(datosNuevos.getEmail())
                && usuarioRepository.existsByEmail(datosNuevos.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nuevo email ya está en uso por otro usuario"
            );
        }

        // Actualización de campos permitidos
        usuarioExistente.setNombre(datosNuevos.getNombre());
        usuarioExistente.setEmail(datosNuevos.getEmail());
        if (datosNuevos.getRol() != null) {
            usuarioExistente.setRol(datosNuevos.getRol().trim().toUpperCase());
        }
        if (datosNuevos.getActivo() != null) {
            usuarioExistente.setActivo(datosNuevos.getActivo());
        }

        return usuarioRepository.save(usuarioExistente);
    }

    // ========================================================================
    // 5. ELIMINAR UN USUARIO
    // ========================================================================
    /**
     * Elimina el usuario por ID tras verificar su existencia.
     */
    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se puede eliminar: usuario con ID " + id + " no encontrado"
            );
        }
        usuarioRepository.deleteById(id);
    }

    // ========================================================================
    // 6. MÉTODOS DE APOYO (Consultas especializadas)
    // ========================================================================

    /**
     * Obtener usuarios por rol (ej: solo "ALUMNO" o solo "PROFESOR")
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerPorRol(String rol) {
        return usuarioRepository.findByRol(rol.toUpperCase());
    }

    /**
     * Obtener únicamente los usuarios habilitados para préstamos (activo == true)
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerActivos() {
        return usuarioRepository.findByActivo(true);
    }

    /**
     * Obtener usuarios filtrando por rol y estado simultáneamente
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerPorRolYActivo(String rol, Boolean activo) {
        return usuarioRepository.findByRolAndActivo(rol.toUpperCase(), activo);
    }

    /**
     * Suspender o reactivar membresía (útil para sanciones por retraso de devolución)
     */
    @Transactional
    public Usuario cambiarEstado(Long id, boolean activo) {
        Usuario usuario = obtenerPorId(id);
        usuario.setActivo(activo);
        return usuarioRepository.save(usuario);
    }
}

