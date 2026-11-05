package com.biblioteca.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "libros")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Libro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El ISBN es obligatorio")
    @Column(nullable = false, unique = true, length = 30)
    private String isbn;

    @NotBlank(message = "El título es obligatorio")
    @Column(nullable = false, length = 200)
    private String titulo;

    @NotBlank(message = "El autor es obligatorio")
    @Column(nullable = false, length = 150)
    private String autor;

    @Column(length = 100)
    private String categoria;

    @Column(length = 100)
    private String editorial;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalCopias = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer copiasDisponibles = 1;

    @Column(length = 100)
    private String ubicacion;

    @PrePersist
    public void prePersist() {
        if (this.totalCopias == null) {
            this.totalCopias = 1;
        }
        if (this.copiasDisponibles == null) {
            this.copiasDisponibles = this.totalCopias;
        }
    }
}
