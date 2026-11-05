package com.biblioteca.service;

import com.biblioteca.model.Libro;
import com.biblioteca.model.Prestamo;
import com.biblioteca.model.Usuario;
import com.biblioteca.repository.LibroRepository;
import com.biblioteca.repository.PrestamoRepository;
import com.biblioteca.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final LibroRepository libroRepository;
    private final UsuarioRepository usuarioRepository;

    public PrestamoService(PrestamoRepository prestamoRepository,
                           LibroRepository libroRepository,
                           UsuarioRepository usuarioRepository) {
        this.prestamoRepository = prestamoRepository;
        this.libroRepository = libroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public List<Prestamo> obtenerTodos() {
        log.info("[PRÉSTAMOS] Consultando listado completo de préstamos");
        actualizarRetrasados();
        List<Prestamo> prestamos = prestamoRepository.findAll();
        log.info("[PRÉSTAMOS] Total de préstamos en historial: {}", prestamos.size());
        return prestamos;
    }

    @Transactional(readOnly = true)
    public Prestamo obtenerPorId(Long id) {
        log.info("[PRÉSTAMOS] Buscando préstamo con ID: {}", id);
        return prestamoRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[PRÉSTAMOS] Préstamo no encontrado con ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Préstamo no encontrado con ID: " + id);
                });
    }

    @Transactional
    public Prestamo crearPrestamo(Prestamo solicitud) {
        log.info("[PRÉSTAMOS] Iniciando proceso de préstamo. Libro ID: {}, Usuario ID: {}",
                solicitud.getLibroId(), solicitud.getUsuarioId());

        // 1. Validar libro y stock
        Libro libro = libroRepository.findById(solicitud.getLibroId())
                .orElseThrow(() -> {
                    log.warn("[PRÉSTAMOS] Rechazado: El libro ID {} no existe", solicitud.getLibroId());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "El libro seleccionado no existe (ID: " + solicitud.getLibroId() + ")");
                });

        if (libro.getCopiasDisponibles() == null || libro.getCopiasDisponibles() <= 0) {
            log.warn("[PRÉSTAMOS] Rechazado: Stock agotado para el libro '{}' (Copias disponibles: {})",
                    libro.getTitulo(), libro.getCopiasDisponibles());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No hay copias disponibles para préstamo del libro '" + libro.getTitulo() + "'"
            );
        }

        // 2. Validar usuario
        Usuario usuario = usuarioRepository.findById(solicitud.getUsuarioId())
                .orElseThrow(() -> {
                    log.warn("[PRÉSTAMOS] Rechazado: El usuario ID {} no existe", solicitud.getUsuarioId());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario seleccionado no existe (ID: " + solicitud.getUsuarioId() + ")");
                });

        if ("Sancionado".equalsIgnoreCase(usuario.getEstado()) || "Inactivo".equalsIgnoreCase(usuario.getEstado())) {
            log.warn("[PRÉSTAMOS] Rechazado: Usuario '{}' no habilitado para préstamos. Estado: {}",
                    usuario.getNombre(), usuario.getEstado());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El usuario '" + usuario.getNombre() + "' no puede solicitar préstamos (" + usuario.getEstado() + ")"
            );
        }

        // 3. Descontar copia del stock disponible (Regla de Negocio Crítica)
        int stockAnterior = libro.getCopiasDisponibles();
        libro.setCopiasDisponibles(stockAnterior - 1);
        libroRepository.save(libro);
        log.info("[STOCK] Stock decrementado para libro '{}'. Anterior: {} -> Nuevo: {}",
                libro.getTitulo(), stockAnterior, libro.getCopiasDisponibles());

        // 4. Completar campos del préstamo
        solicitud.setLibroTitulo(libro.getTitulo());
        solicitud.setLibroIsbn(libro.getIsbn());
        solicitud.setUsuarioNombre(usuario.getNombre());
        solicitud.setUsuarioRol(usuario.getRol());

        LocalDate hoy = LocalDate.now();
        if (solicitud.getFechaPrestamo() == null || solicitud.getFechaPrestamo().isBlank()) {
            solicitud.setFechaPrestamo(hoy.toString());
        }

        if (solicitud.getFechaDevolucionEsperada() == null || solicitud.getFechaDevolucionEsperada().isBlank()) {
            int dias = "Profesor".equalsIgnoreCase(usuario.getRol()) ? 30 : 14;
            solicitud.setFechaDevolucionEsperada(hoy.plusDays(dias).toString());
        }

        solicitud.setFechaDevolucionReal(null);
        solicitud.setEstado("Activo");

        Prestamo guardado = prestamoRepository.save(solicitud);
        log.info("[PRÉSTAMOS] Préstamo registrado exitosamente. ID: {}, Vence el: {}",
                guardado.getId(), guardado.getFechaDevolucionEsperada());
        return guardado;
    }

    @Transactional
    public Prestamo devolverPrestamo(Long id) {
        log.info("[DEVOLUCIÓN] Procesando devolución de préstamo con ID: {}", id);
        Prestamo prestamo = obtenerPorId(id);

        if ("Devuelto".equalsIgnoreCase(prestamo.getEstado()) || prestamo.getFechaDevolucionReal() != null) {
            log.warn("[DEVOLUCIÓN] Operación duplicada: El préstamo ID {} ya figura como devuelto", id);
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Este libro ya fue devuelto con anterioridad"
            );
        }

        // 1. Restaurar copia al stock disponible (Regla de Negocio Crítica)
        Libro libro = libroRepository.findById(prestamo.getLibroId()).orElse(null);
        if (libro != null) {
            int maxTotal = libro.getTotalCopias() != null ? libro.getTotalCopias() : 100;
            int actuales = libro.getCopiasDisponibles() != null ? libro.getCopiasDisponibles() : 0;
            int nuevoStock = Math.min(actuales + 1, maxTotal);
            libro.setCopiasDisponibles(nuevoStock);
            libroRepository.save(libro);
            log.info("[STOCK] Stock reincorporado para libro '{}'. Anterior: {} -> Nuevo: {}",
                    libro.getTitulo(), actuales, nuevoStock);
        }

        // 2. Marcar devolución activa
        prestamo.setFechaDevolucionReal(LocalDate.now().toString());
        prestamo.setEstado("Devuelto");

        Prestamo devuelto = prestamoRepository.save(prestamo);
        log.info("[DEVOLUCIÓN] Préstamo ID {} marcado como 'Devuelto' con fecha {}",
                devuelto.getId(), devuelto.getFechaDevolucionReal());
        return devuelto;
    }

    @Transactional
    public void actualizarRetrasados() {
        List<Prestamo> prestamos = prestamoRepository.findAll();
        LocalDate hoy = LocalDate.now();
        int retrasadosDetectados = 0;
        for (Prestamo p : prestamos) {
            if (p.getFechaDevolucionReal() == null && p.getFechaDevolucionEsperada() != null) {
                try {
                    LocalDate fechaEsperada = LocalDate.parse(p.getFechaDevolucionEsperada());
                    if (fechaEsperada.isBefore(hoy) && !"Devuelto".equalsIgnoreCase(p.getEstado())) {
                        if (!"Retrasado".equalsIgnoreCase(p.getEstado())) {
                            p.setEstado("Retrasado");
                            prestamoRepository.save(p);
                            retrasadosDetectados++;
                        }
                    }
                } catch (Exception ignored) {
                }
            }
        }
        if (retrasadosDetectados > 0) {
            log.warn("[ALERTAS] Se detectaron y actualizaron {} préstamos en estado 'Retrasado'", retrasadosDetectados);
        }
    }
}
