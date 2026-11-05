package com.biblioteca.controller;

import com.biblioteca.model.Libro;
import com.biblioteca.service.LibroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/books", "/api/libros"})
@CrossOrigin(origins = "*")
@Tag(name = "Libros", description = "Endpoints para la gestión del catálogo de libros y stock")
public class LibroController {

    private final LibroService libroService;

    public LibroController(LibroService libroService) {
        this.libroService = libroService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los libros")
    public ResponseEntity<List<Libro>> listarTodos() {
        return ResponseEntity.ok(libroService.obtenerTodos());
    }

    @GetMapping("/disponibles")
    @Operation(summary = "Listar libros con stock disponible")
    public ResponseEntity<List<Libro>> listarDisponibles() {
        return ResponseEntity.ok(libroService.obtenerDisponibles());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un libro por ID")
    public ResponseEntity<Libro> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(libroService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Registrar nuevo libro en el catálogo")
    public ResponseEntity<Libro> crearLibro(@Valid @RequestBody Libro libro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(libroService.guardar(libro));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar información de un libro")
    public ResponseEntity<Libro> actualizarLibro(@PathVariable Long id, @Valid @RequestBody Libro libroActualizado) {
        return ResponseEntity.ok(libroService.actualizar(id, libroActualizado));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un libro")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        libroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
