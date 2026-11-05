package com.biblioteca.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibroDTO {
    private Long id;

    @NotBlank(message = "El ISBN no puede estar vacío")
    private String isbn;

    @NotBlank(message = "El título no puede estar vacío")
    private String titulo;

    @NotBlank(message = "El autor no puede estar vacío")
    private String autor;

    private String categoria;

    @NotNull(message = "El stock total es obligatorio")
    @Min(value = 0, message = "El stock total debe ser mayor o igual a 0")
    private Integer stockTotal;

    private Integer stockDisponible;
    private String descripcion;
    private String portadaUrl;
}
