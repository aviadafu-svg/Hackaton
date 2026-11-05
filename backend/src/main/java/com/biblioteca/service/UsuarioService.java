package com.biblioteca.service;

import com.biblioteca.model.Usuario;
import com.biblioteca.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Slf4j
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerTodos() {
        log.info("[USUARIOS] Consultando listado general de usuarios escolares");
        List<Usuario> usuarios = usuarioRepository.findAll();
        log.info("[USUARIOS] Se recuperaron {} usuarios", usuarios.size());
        return usuarios;
    }

    @Transactional(readOnly = true)
    public Usuario obtenerPorId(Long id) {
        log.info("[USUARIOS] Buscando usuario con ID: {}", id);
        return usuarioRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[USUARIOS] Usuario no encontrado con ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + id);
                });
    }

    @Transactional
    public Usuario guardar(Usuario usuario) {
        log.info("[USUARIOS] Solicitud para registrar usuario: '{}' ({}) - Email: {}",
                usuario.getNombre(), usuario.getRol(), usuario.getEmail());

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            log.warn("[USUARIOS] Registro rechazado: El email '{}' ya está en uso", usuario.getEmail());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El email '" + usuario.getEmail() + "' ya está registrado en el sistema"
            );
        }

        if (usuario.getEstado() == null || usuario.getEstado().isBlank()) {
            usuario.setEstado(Boolean.FALSE.equals(usuario.getActivo()) ? "Inactivo" : "Activo");
        }
        if (usuario.getActivo() == null) {
            usuario.setActivo("Activo".equalsIgnoreCase(usuario.getEstado()));
        }

        Usuario guardado = usuarioRepository.save(usuario);
        log.info("[USUARIOS] Usuario creado exitosamente con ID: {} y matrícula: {}", guardado.getId(), guardado.getMatricula());
        return guardado;
    }

    @Transactional
    public Usuario actualizar(Long id, Usuario datosNuevos) {
        log.info("[USUARIOS] Actualizando datos de usuario con ID: {}", id);
        Usuario usuarioExistente = obtenerPorId(id);

        if (!usuarioExistente.getEmail().equalsIgnoreCase(datosNuevos.getEmail())
                && usuarioRepository.existsByEmail(datosNuevos.getEmail())) {
            log.warn("[USUARIOS] Actualización fallida: El email '{}' ya pertenece a otro usuario", datosNuevos.getEmail());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nuevo email ya está en uso por otro usuario"
            );
        }

        usuarioExistente.setNombre(datosNuevos.getNombre());
        usuarioExistente.setEmail(datosNuevos.getEmail());
        if (datosNuevos.getMatricula() != null) {
            usuarioExistente.setMatricula(datosNuevos.getMatricula());
        }
        if (datosNuevos.getRol() != null) {
            usuarioExistente.setRol(datosNuevos.getRol());
        }
        if (datosNuevos.getCurso() != null) {
            usuarioExistente.setCurso(datosNuevos.getCurso());
        }
        if (datosNuevos.getTelefono() != null) {
            usuarioExistente.setTelefono(datosNuevos.getTelefono());
        }
        if (datosNuevos.getEstado() != null) {
            usuarioExistente.setEstado(datosNuevos.getEstado());
            usuarioExistente.setActivo("Activo".equalsIgnoreCase(datosNuevos.getEstado()));
        } else if (datosNuevos.getActivo() != null) {
            usuarioExistente.setActivo(datosNuevos.getActivo());
            usuarioExistente.setEstado(datosNuevos.getActivo() ? "Activo" : "Inactivo");
        }

        Usuario actualizado = usuarioRepository.save(usuarioExistente);
        log.info("[USUARIOS] Usuario ID {} actualizado correctamente", actualizado.getId());
        return actualizado;
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("[USUARIOS] Solicitud para eliminar usuario con ID: {}", id);
        if (!usuarioRepository.existsById(id)) {
            log.warn("[USUARIOS] No se pudo eliminar: Usuario con ID {} no existe", id);
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se puede eliminar: usuario con ID " + id + " no encontrado"
            );
        }
        usuarioRepository.deleteById(id);
        log.info("[USUARIOS] Usuario ID {} eliminado con éxito", id);
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerPorRol(String rol) {
        log.info("[USUARIOS] Filtrando usuarios por rol: {}", rol);
        return usuarioRepository.findByRol(rol);
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerActivos() {
        log.info("[USUARIOS] Consultando usuarios activos");
        return usuarioRepository.findByActivo(true);
    }
}
