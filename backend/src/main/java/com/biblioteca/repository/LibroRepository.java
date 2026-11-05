package com.biblioteca.repository;

import com.biblioteca.model.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Long> {
    Optional<Libro> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
    List<Libro> findByCopiasDisponiblesGreaterThan(int copias);
    List<Libro> findByCategoriaContainingIgnoreCase(String categoria);
}
