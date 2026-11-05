package com.biblioteca.config;

import com.biblioteca.model.Usuario;
import com.biblioteca.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * ============================================================================
 * CARGADOR DE DATOS INICIALES (DataLoader)
 * ============================================================================
 * 
 * ¿QUÉ ES Y PARA QUÉ SIRVE?
 * Al usar una base de datos en memoria (H2), cada vez que reinicias la aplicación
 * en IntelliJ los datos se reinician. 
 * 
 * Esta clase implementa 'CommandLineRunner', lo que significa que Spring Boot
 * ejecutará este código AUTOMÁTICAMENTE justo después de arrancar el servidor.
 * Si la tabla de usuarios está vacía, inserta datos de prueba para que tú y tu
 * equipo de Frontend tengáis alumnos y profesores listos para probar de inmediato.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;

    public DataLoader(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Solo inserta si la tabla está vacía para no duplicar datos
        if (usuarioRepository.count() == 0) {
            
            // 1. Alumnos activos
            usuarioRepository.save(Usuario.builder()
                    .nombre("Sergi Vanrell")
                    .email("sergi.vanrell@colegio.es")
                    .rol("ALUMNO")
                    .activo(true)
                    .build());

            usuarioRepository.save(Usuario.builder()
                    .nombre("Lucía Martínez")
                    .email("lucia.martinez@colegio.es")
                    .rol("ALUMNO")
                    .activo(true)
                    .build());

            usuarioRepository.save(Usuario.builder()
                    .nombre("Mateo Gómez")
                    .email("mateo.gomez@colegio.es")
                    .rol("ALUMNO")
                    .activo(true)
                    .build());

            // 2. Alumna inactiva / suspendida (útil para probar el bloqueo de préstamos)
            usuarioRepository.save(Usuario.builder()
                    .nombre("Carla Navarro")
                    .email("carla.navarro@colegio.es")
                    .rol("ALUMNO")
                    .activo(false)
                    .build());

            // 3. Profesores
            usuarioRepository.save(Usuario.builder()
                    .nombre("Prof. Javier Santos")
                    .email("javier.santos@colegio.es")
                    .rol("PROFESOR")
                    .activo(true)
                    .build());

            usuarioRepository.save(Usuario.builder()
                    .nombre("Prof. Elena Delgado")
                    .email("elena.delgado@colegio.es")
                    .rol("PROFESOR")
                    .activo(true)
                    .build());

            System.out.println(">>> [DataLoader] 6 usuarios de prueba cargados exitosamente.");
        }
    }
}

