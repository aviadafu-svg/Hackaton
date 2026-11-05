package com.biblioteca.service;

import com.biblioteca.model.Usuario;
import com.biblioteca.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con ID: " + id
                ));
    }

    @Transactional
    public Usuario guardar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
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

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario actualizar(Long id, Usuario datosNuevos) {
        Usuario usuarioExistente = obtenerPorId(id);

        if (!usuarioExistente.getEmail().equalsIgnoreCase(datosNuevos.getEmail())
                && usuarioRepository.existsByEmail(datosNuevos.getEmail())) {
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

        return usuarioRepository.save(usuarioExistente);
    }

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

    @Transactional(readOnly = true)
    public List<Usuario> obtenerPorRol(String rol) {
        return usuarioRepository.findByRol(rol);
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerActivos() {
        return usuarioRepository.findByActivo(true);
    }
}
