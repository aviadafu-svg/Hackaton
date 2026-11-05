package com.biblioteca.repository;

import com.biblioteca.model.EstadoPrestamo;
import com.biblioteca.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {
    List<Prestamo> findByEstado(EstadoPrestamo estado);
    List<Prestamo> findByUsuarioId(Long usuarioId);
    List<Prestamo> findByLibroId(Long libroId);

    // Préstamos atrasados: fecha esperada anterior a la fecha dada y en curso
    List<Prestamo> findByFechaDevolucionEsperadaBeforeAndEstado(LocalDate fecha, EstadoPrestamo estado);

    // Contar cuántos préstamos activos tiene un usuario
    long countByUsuarioIdAndEstado(Long usuarioId, EstadoPrestamo estado);

    @Query("SELECT COUNT(p) FROM Prestamo p WHERE p.estado = 'EN_CURSO'")
    long countPrestamosActivos();

    @Query("SELECT COUNT(p) FROM Prestamo p WHERE p.estado = 'EN_CURSO' AND p.fechaDevolucionEsperada < :hoy")
    long countPrestamosRetrasados(@Param("hoy") LocalDate hoy);
}
