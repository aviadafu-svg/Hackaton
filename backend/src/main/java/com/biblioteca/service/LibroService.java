package com.biblioteca.service;

import com.biblioteca.model.Libro;
import com.biblioteca.repository.LibroRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LibroService {

    private final LibroRepository libroRepository;

    public LibroService(LibroRepository libroRepository) {
        this.libroRepository = libroRepository;
    }

    @Transactional(readOnly = true)
    public List<Libro> obtenerTodos() {
        return libroRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Libro obtenerPorId(Long id) {
        return libroRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Libro no encontrado con ID: " + id
                ));
    }

    @Transactional
    public Libro guardar(Libro libro) {
        if (libroRepository.existsByIsbn(libro.getIsbn())) {
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

        return libroRepository.save(libro);
    }

    @Transactional
    public Libro actualizar(Long id, Libro datosNuevos) {
        Libro libroExistente = obtenerPorId(id);

        if (!libroExistente.getIsbn().equalsIgnoreCase(datosNuevos.getIsbn())
                && libroRepository.existsByIsbn(datosNuevos.getIsbn())) {
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

        return libroRepository.save(libroExistente);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!libroRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se puede eliminar: libro con ID " + id + " no encontrado"
            );
        }
        libroRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Libro> obtenerDisponibles() {
        return libroRepository.findByCopiasDisponiblesGreaterThan(0);
    }
}
