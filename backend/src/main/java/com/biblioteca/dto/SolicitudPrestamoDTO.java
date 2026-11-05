package com.biblioteca.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudPrestamoDTO {
    @NotNull(message = "El id del libro es obligatorio")
    private Long libroId;

    @NotNull(message = "El id del usuario es obligatorio")
    private Long usuarioId;

    private Integer diasPrestamo; // opcional: si no se envía, se calcula por rol
    private String observaciones;
}
