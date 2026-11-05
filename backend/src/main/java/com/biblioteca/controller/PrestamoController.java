package com.biblioteca.controller;

import com.biblioteca.model.Prestamo;
import com.biblioteca.service.PrestamoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/loans", "/api/prestamos"})
@CrossOrigin(origins = "*")
@Tag(name = "Préstamos", description = "Endpoints para la gestión de préstamos, devoluciones y control de stock")
public class PrestamoController {

    private final PrestamoService prestamoService;

    public PrestamoController(PrestamoService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los préstamos")
    public ResponseEntity<List<Prestamo>> listarTodos() {
        return ResponseEntity.ok(prestamoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener préstamo por ID")
    public ResponseEntity<Prestamo> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo préstamo (descuenta automáticamente una copia del stock)")
    public ResponseEntity<Prestamo> crearPrestamo(@Valid @RequestBody Prestamo prestamo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(prestamoService.crearPrestamo(prestamo));
    }

    @PutMapping("/{id}/return")
    @Operation(summary = "Registrar devolución activa (reincorpora la copia al stock)")
    public ResponseEntity<Prestamo> devolverLibro(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.devolverPrestamo(id));
    }

    @PatchMapping("/{id}/return")
    @Operation(summary = "Registrar devolución (método alternativo PATCH)")
    public ResponseEntity<Prestamo> devolverLibroPatch(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.devolverPrestamo(id));
    }
}
