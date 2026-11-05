package com.biblioteca.dto;

import com.biblioteca.model.EstadoUsuario;
import com.biblioteca.model.RolUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "La matrícula es obligatoria")
    private String matricula;

    @NotNull(message = "El rol es obligatorio")
    private RolUsuario rol;

    private EstadoUsuario estado;
    private String telefono;
}
