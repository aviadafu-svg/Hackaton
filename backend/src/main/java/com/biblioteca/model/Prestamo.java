package com.biblioteca.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "prestamos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID del libro es obligatorio")
    @Column(nullable = false)
    private Long libroId;

    @Column(length = 200)
    private String libroTitulo;

    @Column(length = 30)
    private String libroIsbn;

    @NotNull(message = "El ID del usuario es obligatorio")
    @Column(nullable = false)
    private Long usuarioId;

    @Column(length = 100)
    private String usuarioNombre;

    @Column(length = 20)
    private String usuarioRol;

    @Column(length = 20)
    private String fechaPrestamo;

    @Column(length = 20)
    private String fechaDevolucionEsperada;

    @Column(length = 20)
    private String fechaDevolucionReal;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "Activo";

    @Column(length = 255)
    private String observaciones;

    @PrePersist
    public void prePersist() {
        if (this.fechaPrestamo == null || this.fechaPrestamo.isBlank()) {
            this.fechaPrestamo = LocalDate.now().toString();
        }
        if (this.estado == null || this.estado.isBlank()) {
            this.estado = "Activo";
        }
    }
}
