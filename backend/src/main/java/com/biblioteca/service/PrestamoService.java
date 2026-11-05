package com.biblioteca.service;

import com.biblioteca.model.Libro;
import com.biblioteca.model.Prestamo;
import com.biblioteca.model.Usuario;
import com.biblioteca.repository.LibroRepository;
import com.biblioteca.repository.PrestamoRepository;
import com.biblioteca.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

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
        actualizarRetrasados();
        return prestamoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Prestamo obtenerPorId(Long id) {
        return prestamoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Préstamo no encontrado con ID: " + id
                ));
    }

    @Transactional
    public Prestamo crearPrestamo(Prestamo solicitud) {
        // 1. Validar libro y stock
        Libro libro = libroRepository.findById(solicitud.getLibroId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El libro seleccionado no existe (ID: " + solicitud.getLibroId() + ")"
                ));

        if (libro.getCopiasDisponibles() == null || libro.getCopiasDisponibles() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No hay copias disponibles para préstamo del libro '" + libro.getTitulo() + "'"
            );
        }

        // 2. Validar usuario
        Usuario usuario = usuarioRepository.findById(solicitud.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El usuario seleccionado no existe (ID: " + solicitud.getUsuarioId() + ")"
                ));

        if ("Sancionado".equalsIgnoreCase(usuario.getEstado()) || "Inactivo".equalsIgnoreCase(usuario.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El usuario '" + usuario.getNombre() + "' no puede solicitar préstamos (" + usuario.getEstado() + ")"
            );
        }

        // 3. Descontar copia del stock disponible
        libro.setCopiasDisponibles(libro.getCopiasDisponibles() - 1);
        libroRepository.save(libro);

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

        return prestamoRepository.save(solicitud);
    }

    @Transactional
    public Prestamo devolverPrestamo(Long id) {
        Prestamo prestamo = obtenerPorId(id);

        if ("Devuelto".equalsIgnoreCase(prestamo.getEstado()) || prestamo.getFechaDevolucionReal() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Este libro ya fue devuelto con anterioridad"
            );
        }

        // 1. Restaurar copia al stock disponible
        Libro libro = libroRepository.findById(prestamo.getLibroId()).orElse(null);
        if (libro != null) {
            int maxTotal = libro.getTotalCopias() != null ? libro.getTotalCopias() : 100;
            int actuales = libro.getCopiasDisponibles() != null ? libro.getCopiasDisponibles() : 0;
            libro.setCopiasDisponibles(Math.min(actuales + 1, maxTotal));
            libroRepository.save(libro);
        }

        // 2. Marcar devolución
        prestamo.setFechaDevolucionReal(LocalDate.now().toString());
        prestamo.setEstado("Devuelto");

        return prestamoRepository.save(prestamo);
    }

    @Transactional
    public void actualizarRetrasados() {
        List<Prestamo> prestamos = prestamoRepository.findAll();
        LocalDate hoy = LocalDate.now();
        for (Prestamo p : prestamos) {
            if (p.getFechaDevolucionReal() == null && p.getFechaDevolucionEsperada() != null) {
                try {
                    LocalDate fechaEsperada = LocalDate.parse(p.getFechaDevolucionEsperada());
                    if (fechaEsperada.isBefore(hoy) && !"Devuelto".equalsIgnoreCase(p.getEstado())) {
                        p.setEstado("Retrasado");
                        prestamoRepository.save(p);
                    }
                } catch (Exception ignored) {
                }
            }
        }
    }
}
