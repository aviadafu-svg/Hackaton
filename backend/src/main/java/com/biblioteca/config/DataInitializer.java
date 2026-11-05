package com.biblioteca.config;

import com.biblioteca.model.Libro;
import com.biblioteca.model.Prestamo;
import com.biblioteca.model.Usuario;
import com.biblioteca.repository.LibroRepository;
import com.biblioteca.repository.PrestamoRepository;
import com.biblioteca.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final LibroRepository libroRepository;
    private final UsuarioRepository usuarioRepository;
    private final PrestamoRepository prestamoRepository;

    public DataInitializer(LibroRepository libroRepository,
                           UsuarioRepository usuarioRepository,
                           PrestamoRepository prestamoRepository) {
        this.libroRepository = libroRepository;
        this.usuarioRepository = usuarioRepository;
        this.prestamoRepository = prestamoRepository;
    }

    @Override
    public void run(String... args) {
        if (libroRepository.count() == 0) {
            libroRepository.saveAll(List.of(
                    Libro.builder().isbn("978-84-376-0494-7").titulo("Don Quijote de la Mancha").autor("Miguel de Cervantes").categoria("Literatura Clásica").editorial("Cátedra").totalCopias(5).copiasDisponibles(3).ubicacion("Estante A-12").build(),
                    Libro.builder().isbn("978-03-074-7472-8").titulo("Cien Años de Soledad").autor("Gabriel García Márquez").categoria("Novela").editorial("Debolsillo").totalCopias(4).copiasDisponibles(2).ubicacion("Estante B-04").build(),
                    Libro.builder().isbn("978-60-774-4530-2").titulo("Álgebra Elemental").autor("Aurelio Baldor").categoria("Matemáticas").editorial("Grupo Editorial Patria").totalCopias(6).copiasDisponibles(5).ubicacion("Estante M-01").build(),
                    Libro.builder().isbn("978-95-006-0334-8").titulo("Biología Celular y Molecular").autor("Helena Curtis").categoria("Ciencias Naturales").editorial("Médica Panamericana").totalCopias(3).copiasDisponibles(1).ubicacion("Estante C-08").build(),
                    Libro.builder().isbn("978-01-560-1398-7").titulo("El Principito").autor("Antoine de Saint-Exupéry").categoria("Literatura Juvenil").editorial("Reynal & Hitchcock").totalCopias(8).copiasDisponibles(0).ubicacion("Estante J-03").build(),
                    Libro.builder().isbn("978-60-732-3302-6").titulo("Física Conceptual").autor("Paul G. Hewitt").categoria("Física").editorial("Pearson").totalCopias(4).copiasDisponibles(4).ubicacion("Estante F-02").build(),
                    Libro.builder().isbn("978-84-788-8445-2").titulo("Harry Potter y la Piedra Filosofal").autor("J.K. Rowling").categoria("Fantasía").editorial("Salamandra").totalCopias(5).copiasDisponibles(2).ubicacion("Estante J-09").build()
            ));
        }

        if (usuarioRepository.count() == 0) {
            usuarioRepository.saveAll(List.of(
                    Usuario.builder().matricula("ALU-2026-001").nombre("Sofía Martínez Ruiz").email("sofia.martinez@colegio.edu.es").rol("Alumno").curso("4º ESO B").estado("Activo").telefono("611 223 344").activo(true).build(),
                    Usuario.builder().matricula("ALU-2026-042").nombre("Lucas Gómez Morales").email("lucas.gomez@colegio.edu.es").rol("Alumno").curso("2º Bachillerato A").estado("Activo").telefono("622 334 455").activo(true).build(),
                    Usuario.builder().matricula("PROF-2024-008").nombre("Prof. Carmen Navarro").email("carmen.navarro@colegio.edu.es").rol("Profesor").curso("Dpto. Lengua y Literatura").estado("Activo").telefono("633 445 566").activo(true).build(),
                    Usuario.builder().matricula("PROF-2023-015").nombre("Prof. Alejandro Vega").email("alejandro.vega@colegio.edu.es").rol("Profesor").curso("Dpto. Ciencias Naturales").estado("Activo").telefono("644 556 677").activo(true).build(),
                    Usuario.builder().matricula("ALU-2026-089").nombre("Mateo Fernández Torres").email("mateo.fernandez@colegio.edu.es").rol("Alumno").curso("1º ESO C").estado("Sancionado").telefono("655 667 788").activo(false).build()
            ));
        }

        if (prestamoRepository.count() == 0) {
            LocalDate hoy = LocalDate.now();
            prestamoRepository.saveAll(List.of(
                    Prestamo.builder().libroId(5L).libroTitulo("El Principito").libroIsbn("978-01-560-1398-7").usuarioId(1L).usuarioNombre("Sofía Martínez Ruiz").usuarioRol("Alumno").fechaPrestamo(hoy.minusDays(20).toString()).fechaDevolucionEsperada(hoy.minusDays(5).toString()).fechaDevolucionReal(null).estado("Retrasado").observaciones("Notificación de aviso enviada por email").build(),
                    Prestamo.builder().libroId(4L).libroTitulo("Biología Celular y Molecular").libroIsbn("978-95-006-0334-8").usuarioId(4L).usuarioNombre("Prof. Alejandro Vega").usuarioRol("Profesor").fechaPrestamo(hoy.minusDays(5).toString()).fechaDevolucionEsperada(hoy.plusDays(9).toString()).fechaDevolucionReal(null).estado("Activo").observaciones("Préstamo docente para preparación de clase").build(),
                    Prestamo.builder().libroId(1L).libroTitulo("Don Quijote de la Mancha").libroIsbn("978-84-376-0494-7").usuarioId(2L).usuarioNombre("Lucas Gómez Morales").usuarioRol("Alumno").fechaPrestamo("2026-10-10").fechaDevolucionEsperada("2026-10-24").fechaDevolucionReal("2026-10-22").estado("Devuelto").observaciones("Devuelto en perfecto estado").build()
            ));
        }
    }
}
