package com.biblioteca.repository;

import com.biblioteca.model.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Long> {
    Optional<Libro> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
    List<Libro> findByStockDisponibleGreaterThan(int stock);

    @Query("SELECT l FROM Libro l WHERE LOWER(l.titulo) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
           "OR LOWER(l.autor) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
           "OR LOWER(l.isbn) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
           "OR LOWER(l.categoria) LIKE LOWER(CONCAT('%', :filtro, '%'))")
    List<Libro> buscarPorCriterio(@Param("filtro") String filtro);
}
