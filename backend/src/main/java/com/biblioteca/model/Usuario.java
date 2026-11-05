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
 * ¿QUÉ ES Y CUÁL ES SU ROL?
 * Esta clase representa la tabla "usuarios" en la base de datos (H2 / SQLite).
 * Mapea tanto a los Alumnos como a los Profesores que pueden solicitar préstamos
 * de libros en la biblioteca escolar.
 * 
 * TRUCO DE HACKATHON:
 * Gracias a Spring Data JPA y 'spring.jpa.hibernate.ddl-auto=update', Hibernate
 * creará automáticamente la tabla SQL en la base de datos a partir de esta clase,
 * sin necesidad de escribir sentencias 'CREATE TABLE'.
 */

// @Entity:
// Le dice a JPA/Hibernate que esta clase es una entidad persistente y debe
// mapearse contra una tabla en la base de datos.
@Entity

// @Table(name = "usuarios"):
// Especifica el nombre exacto de la tabla en la base de datos relacional.
@Table(name = "usuarios")

// ANOTACIONES DE LOMBOK (Para ahorrar tiempo en el hackathon):
// @Data: Genera automáticamente Getters, Setters, toString, equals y hashCode.
// @NoArgsConstructor: Genera el constructor vacío (obligatorio para que JPA funcione).
// @AllArgsConstructor: Genera un constructor con todos los atributos.
// @Builder: Permite instanciar objetos usando el patrón Builder (Usuario.builder().nombre(...).build()).
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    /**
     * CLAVE PRIMARIA (PRIMARY KEY - PK)
     * @Id: Marca este campo como la clave primaria única de la tabla.
     * @GeneratedValue(strategy = GenerationType.IDENTITY):
     * Configura la columna como autoincremental (1, 2, 3...) delegando la
     * generación del ID directamente al motor de la base de datos.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * NOMBRE COMPLETO
     * @NotBlank: Validación que impide valores nulos ("") o cadenas de espacios en blanco ("   ").
     * @Column(nullable = false): Restricción a nivel de base de datos SQL (NOT NULL).
     */
    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, length = 100)
    private String nombre;

    /**
     * CORREO ELECTRÓNICO (Identificador institucional)
     * @Email: Valida que tenga una estructura correcta de correo (ejemplo: alumno@colegio.es).
     * unique = true: Garantiza en la base de datos que no existan dos usuarios con el mismo email.
     */
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato de correo no es válido")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /**
     * ROL EN EL CENTRO EDUCATIVO
     * Valores habituales: "ALUMNO" o "PROFESOR".
     * En el servicio de Préstamos se usa este campo para aplicar reglas de negocio
     * (por ejemplo: los profesores tienen hasta 30 días de préstamo y los alumnos 7 días).
     */
    @NotBlank(message = "El rol es obligatorio (ALUMNO o PROFESOR)")
    @Column(nullable = false, length = 20)
    private String rol;

    /**
     * ESTADO DE MEMBRESÍA
     * true = ACTIVO (Puede solicitar préstamos de libros).
     * false = INACTIVO / SUSPENDIDO (Bloqueado por retrasos o baja escolar).
     * 
     * REGLA DE NEGOCIO CRÍTICA (40% de la nota):
     * El servicio de préstamos DEBE validar que 'activo == true' antes de prestar un libro.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    /**
     * @PrePersist:
     * Método de ciclo de vida JPA que se ejecuta justo antes de hacer el primer INSERT.
     * Si no se especificó el estado 'activo', por defecto se da de alta en 'true'.
     */
    @PrePersist
    public void prePersist() {
        if (this.activo == null) {
            this.activo = true;
        }
    }
}

