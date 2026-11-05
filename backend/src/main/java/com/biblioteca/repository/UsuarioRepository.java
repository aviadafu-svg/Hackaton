package com.biblioteca.repository;

import com.biblioteca.model.EstadoUsuario;
import com.biblioteca.model.RolUsuario;
import com.biblioteca.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByMatricula(String matricula);
    boolean existsByEmail(String email);
    boolean existsByMatricula(String matricula);
    List<Usuario> findByEstado(EstadoUsuario estado);
    List<Usuario> findByRol(RolUsuario rol);
}
