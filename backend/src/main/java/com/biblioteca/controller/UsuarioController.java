package com.biblioteca.controller;

import com.biblioteca.model.Usuario;
import com.biblioteca.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/users", "/api/usuarios"})
@CrossOrigin(origins = "*")
@Tag(name = "Usuarios", description = "Endpoints para la gestión de alumnos y profesores")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los usuarios")
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Registrar nuevo usuario")
    public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.guardar(usuario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @Valid @RequestBody Usuario usuarioActualizado) {
        return ResponseEntity.ok(usuarioService.actualizar(id, usuarioActualizado));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
