package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Funcion;
import com.example.HumeniukCineSpring.services.FuncionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/funciones")
public class FuncionController extends BaseControllerImpl<Funcion, Long, FuncionService> {

    public FuncionController(FuncionService servicio) {
        super(servicio);
    }

    @GetMapping("/conteo-por-pelicula")
    public ResponseEntity<?> conteoPorPelicula() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(servicio.countFuncionesByPeliculaId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
