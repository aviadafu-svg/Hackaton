package com.biblioteca.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * ENTIDAD DE DOMINIO: Usuario
 * ============================================================================
 * 
 * Representa la tabla "usuarios" en la base de datos PostgreSQL.
 * Mapea tanto a Alumnos como a Profesores del centro escolar.
 */

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String matricula;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato de correo no es válido")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "El rol es obligatorio (Alumno o Profesor)")
    @Column(nullable = false, length = 20)
    private String rol;

    @Column(length = 50)
    private String curso;

    @Column(length = 20)
    private String telefono;

    @Column(length = 20)
    @Builder.Default
    private String estado = "Activo";

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @PrePersist
    public void prePersist() {
        if (this.activo == null) {
            this.activo = true;
        }
        if (this.estado == null || this.estado.isBlank()) {
            this.estado = "Activo";
        }
    }
}
