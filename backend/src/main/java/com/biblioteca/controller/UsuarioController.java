package com.biblioteca.controller;

import com.biblioteca.model.Usuario;
import com.biblioteca.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================================
 * CONTROLADOR REST DE USUARIOS (UsuarioController)
 * ============================================================================
 * 
 * ¿QUÉ ES Y CUÁL ES SU ROL?
 * Actúa como la "puerta de entrada" o "recepcionista" de la API para gestionar
 * Alumnos y Profesores de la biblioteca escolar.
 * 
 * PRINCIPIO DE RESPONSABILIDAD ÚNICA:
 * El controlador NO contiene lógica de negocio ni sentencias SQL. Su único fin es:
 *   1. Recibir la petición HTTP que envía el cliente (Frontend React / Postman).
 *   2. Validar el formato de los datos que llegan en la petición (@Valid).
 *   3. Delegar la operación al servicio correspondiente (UsuarioService).
 *   4. Devolver la respuesta en formato JSON con el código de estado HTTP correcto.
 * 
 * FLUJO DE LA INFORMACIÓN:
 *   [React :5173] ➔ [UsuarioController] ➔ [UsuarioService] ➔ [UsuarioRepository] ➔ [Base de Datos]
 */

// @RestController:
// Indica a Spring que esta clase es un controlador REST. Combina @Controller + @ResponseBody.
// Esto significa que cualquier objeto que devuelvan los métodos (List, Usuario, etc.)
// se serializará y convertirá AUTOMÁTICAMENTE a formato JSON para enviarse al cliente.
@RestController

// @RequestMapping("/api/usuarios"):
// Establece la ruta base (URL prefijo) para todos los endpoints definidos en esta clase.
// Ejemplo: una petición a "http://localhost:8080/api/usuarios" llegará aquí.
@RequestMapping("/api/usuarios")

// @CrossOrigin(origins = "*"):
// SOLUCIÓN AL PROBLEMA DE CORS (Cross-Origin Resource Sharing):
// El frontend (React con Vite) corre en http://localhost:5173 y el backend en http://localhost:8080.
// Los navegadores bloquean por seguridad peticiones entre puertos distintos.
// Esta anotación añade las cabeceras necesarias para permitir la comunicación sin bloqueos.
@CrossOrigin(origins = "*")
public class UsuarioController {

    /**
     * INYECCIÓN DE DEPENDENCIAS:
     * Declaramos el servicio como 'final' para garantizar la inmutabilidad
     * (una vez asignado no puede cambiar ni ser null).
     */
    private final UsuarioService usuarioService;

    /**
     * CONSTRUCTOR PARA INYECCIÓN (Buena Práctica Profesional):
     * En lugar de usar @Autowired sobre la variable (antipatrón con reflexión),
     * inyectamos UsuarioService a través del constructor.
     * Ventajas:
     *   - Facilita pruebas unitarias con JUnit (permite pasar un Mock fácilmente).
     *   - Spring 4.3+ detecta e inyecta el constructor automáticamente sin necesidad de anotarlo.
     */
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ========================================================================
    // 1. LISTAR USUARIOS (Con soporte para filtros opcionales de rol y estado)
    // ========================================================================
    /**
     * Endpoint: GET /api/usuarios
     * 
     * Admite query params opcionales para facilitar la vida al Frontend:
     *   - GET /api/usuarios                  (Devuelve todos)
     *   - GET /api/usuarios?rol=ALUMNO       (Solo alumnos)
     *   - GET /api/usuarios?rol=PROFESOR     (Solo profesores)
     *   - GET /api/usuarios?activo=true      (Solo habilitados para préstamos)
     *   - GET /api/usuarios?rol=ALUMNO&activo=true
     * 
     * RESPUESTA HTTP:
     *   Status: 200 OK
     *   Body: [ { "id": 1, "nombre": "Sergi", "rol": "ALUMNO", "activo": true, ... } ]
     */
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos(
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) Boolean activo) {
        
        if (rol != null && activo != null) {
            return ResponseEntity.ok(usuarioService.obtenerPorRolYActivo(rol, activo));
        } else if (rol != null) {
            return ResponseEntity.ok(usuarioService.obtenerPorRol(rol));
        } else if (activo != null && activo) {
            return ResponseEntity.ok(usuarioService.obtenerActivos());
        }
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    // ========================================================================
    // 2. BUSCAR UN USUARIO POR SU ID
    // ========================================================================
    /**
     * Endpoint: GET /api/usuarios/{id}
     * Ejemplo: GET /api/usuarios/3
     * 
     * ¿CÓMO FUNCIONA?
     *   - @GetMapping("/{id}"): Define una variable dinámica en la URL llamada "{id}".
     *   - @PathVariable Long id: Le indica a Spring que extraiga el valor que viene en la
     *     URL (por ejemplo, el 3) y lo asigne directamente a la variable 'id'.
     *   - Si el usuario existe, devuelve 200 OK con el objeto. Si no existe, el servicio
     *     lanzará una excepción que resultará en un 404 Not Found.
     * 
     * RESPUESTA HTTP:
     *   Status: 200 OK
     *   Body: { "id": 3, "nombre": "Ana Pérez", "rol": "PROFESOR", ... }
     */
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(usuario);
    }

    // ========================================================================
    // 3. CREAR UN NUEVO USUARIO
    // ========================================================================
    /**
     * Endpoint: POST /api/usuarios
     * 
     * ¿CÓMO FUNCIONA?
     *   - @PostMapping: Atiende peticiones HTTP POST (creación de recursos).
     *   - @RequestBody: Lee el cuerpo JSON enviado por el cliente y lo deserializa
     *     a una instancia de la clase Java Usuario.
     *   - @Valid: Activa las validaciones declaradas en la entidad/DTO (como @NotBlank,
     *     @Email, @NotNull). Si los datos son inválidos, Spring rechaza la petición
     *     inmediatamente con un error 400 Bad Request antes de tocar el servicio.
     *   - HttpStatus.CREATED: Código semántico 201 (Created) que indica que un nuevo
     *     recurso se ha creado exitosamente en la base de datos.
     * 
     * RESPUESTA HTTP:
     *   Status: 201 CREATED
     *   Body: { "id": 4, "nombre": "Carlos", "matricula": "ALU-102", ... }
     */
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.guardar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    // ========================================================================
    // 4. ACTUALIZAR UN USUARIO EXISTENTE
    // ========================================================================
    /**
     * Endpoint: PUT /api/usuarios/{id}
     * Ejemplo: PUT /api/usuarios/4
     * 
     * ¿CÓMO FUNCIONA?
     *   - @PutMapping("/{id}"): Atiende peticiones HTTP PUT para actualización total/idempotente.
     *   - Combina @PathVariable (para saber cuál registro modificar) y @RequestBody (con los
     *     nuevos datos validados que se deben sobreescribir).
     *   - Llama a usuarioService.actualizar(...) que fusiona los cambios y los persiste.
     * 
     * RESPUESTA HTTP:
     *   Status: 200 OK
     *   Body: Objeto Usuario con sus campos actualizados.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody Usuario usuarioActualizado) {
        Usuario usuario = usuarioService.actualizar(id, usuarioActualizado);
        return ResponseEntity.ok(usuario);
    }

    // ========================================================================
    // 5. ELIMINAR UN USUARIO
    // ========================================================================
    /**
     * Endpoint: DELETE /api/usuarios/{id}
     * Ejemplo: DELETE /api/usuarios/4
     * 
     * ¿CÓMO FUNCIONA?
     *   - @DeleteMapping("/{id}"): Atiende peticiones HTTP DELETE.
     *   - ResponseEntity<Void>: Indicamos que la respuesta no contiene ningún cuerpo (cero bytes).
     *   - ResponseEntity.noContent().build(): Construye una respuesta con código 204 No Content.
     *     En el estándar REST, 204 significa: "La operación fue exitosa, pero no hay nada que
     *     devolver en el cuerpo porque el elemento ha sido eliminado".
     * 
     * RESPUESTA HTTP:
     *   Status: 204 NO CONTENT
     *   Body: (vacío)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ========================================================================
    // 6. CAMBIAR ESTADO DE MEMBRESÍA (Activar o Suspender)
    // ========================================================================
    /**
     * Endpoint: PATCH /api/usuarios/{id}/estado?activo=false
     * Ejemplo: PATCH /api/usuarios/1/estado?activo=false
     * 
     * ¿CÓMO FUNCIONA?
     *   - Permite que desde la UI de React se pueda suspender o rehabilitar a un
     *     usuario con un solo botón/switch, sin necesidad de reenviar todo el JSON.
     * 
     * RESPUESTA HTTP:
     *   Status: 200 OK
     *   Body: Objeto Usuario con el nuevo valor en 'activo'.
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Usuario> cambiarEstado(
            @PathVariable Long id,
            @RequestParam Boolean activo) {
        Usuario usuario = usuarioService.cambiarEstado(id, activo);
        return ResponseEntity.ok(usuario);
    }
}
