package com.biblioteca.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "La matrícula/identificación es obligatoria")
    @Column(nullable = false, unique = true, length = 30)
    private String matricula;

    @NotNull(message = "El rol es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RolUsuario rol;

    @NotNull(message = "El estado es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoUsuario estado;

    @Column(length = 20)
    private String telefono;

    @Column(name = "fecha_alta")
    private LocalDate fechaAlta;

    @PrePersist
    public void prePersist() {
        if (fechaAlta == null) {
            fechaAlta = LocalDate.now();
        }
        if (estado == null) {
            estado = EstadoUsuario.ACTIVO;
        }
        if (rol == null) {
            rol = RolUsuario.ALUMNO;
        }
    }
}
