package com.biblioteca.service;

import com.biblioteca.model.Libro;
import com.biblioteca.repository.LibroRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Slf4j
@Service
public class LibroService {

    private final LibroRepository libroRepository;

    public LibroService(LibroRepository libroRepository) {
        this.libroRepository = libroRepository;
    }

    @Transactional(readOnly = true)
    public List<Libro> obtenerTodos() {
        log.info("[LIBROS] Consultando lista completa de libros en catálogo");
        List<Libro> libros = libroRepository.findAll();
        log.info("[LIBROS] Se encontraron {} libros registrados", libros.size());
        return libros;
    }

    @Transactional(readOnly = true)
    public Libro obtenerPorId(Long id) {
        log.info("[LIBROS] Buscando libro por ID: {}", id);
        return libroRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[LIBROS] Libro no encontrado con ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado con ID: " + id);
                });
    }

    @Transactional
    public Libro guardar(Libro libro) {
        log.info("[LIBROS] Registrando nuevo libro: '{}' | ISBN: {}", libro.getTitulo(), libro.getIsbn());
        if (libroRepository.existsByIsbn(libro.getIsbn())) {
            log.warn("[LIBROS] Registro denegado: El ISBN {} ya existe en el sistema", libro.getIsbn());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ya existe un libro registrado con el ISBN '" + libro.getIsbn() + "'"
            );
        }

        if (libro.getTotalCopias() == null || libro.getTotalCopias() < 0) {
            libro.setTotalCopias(1);
        }
        if (libro.getCopiasDisponibles() == null) {
            libro.setCopiasDisponibles(libro.getTotalCopias());
        }

        Libro guardado = libroRepository.save(libro);
        log.info("[LIBROS] Libro guardado exitosamente con ID: {}, Total copias: {}, Disponibles: {}",
                guardado.getId(), guardado.getTotalCopias(), guardado.getCopiasDisponibles());
        return guardado;
    }

    @Transactional
    public Libro actualizar(Long id, Libro datosNuevos) {
        log.info("[LIBROS] Actualizando información de libro con ID: {}", id);
        Libro libroExistente = obtenerPorId(id);

        if (!libroExistente.getIsbn().equalsIgnoreCase(datosNuevos.getIsbn())
                && libroRepository.existsByIsbn(datosNuevos.getIsbn())) {
            log.warn("[LIBROS] Actualización fallida: El nuevo ISBN {} pertenece a otro ejemplar", datosNuevos.getIsbn());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nuevo ISBN ya está en uso por otro libro"
            );
        }

        libroExistente.setIsbn(datosNuevos.getIsbn());
        libroExistente.setTitulo(datosNuevos.getTitulo());
        libroExistente.setAutor(datosNuevos.getAutor());
        libroExistente.setCategoria(datosNuevos.getCategoria());
        libroExistente.setEditorial(datosNuevos.getEditorial());
        libroExistente.setTotalCopias(datosNuevos.getTotalCopias());
        libroExistente.setCopiasDisponibles(datosNuevos.getCopiasDisponibles());
        libroExistente.setUbicacion(datosNuevos.getUbicacion());

        Libro actualizado = libroRepository.save(libroExistente);
        log.info("[LIBROS] Libro ID {} actualizado con éxito", actualizado.getId());
        return actualizado;
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("[LIBROS] Solicitud de baja de libro con ID: {}", id);
        if (!libroRepository.existsById(id)) {
            log.warn("[LIBROS] No se pudo eliminar: Libro con ID {} no existe", id);
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se puede eliminar: libro con ID " + id + " no encontrado"
            );
        }
        libroRepository.deleteById(id);
        log.info("[LIBROS] Libro ID {} eliminado satisfactoriamente", id);
    }

    @Transactional(readOnly = true)
    public List<Libro> obtenerDisponibles() {
        log.info("[LIBROS] Filtrando libros con copias disponibles");
        return libroRepository.findByCopiasDisponiblesGreaterThan(0);
    }
}
