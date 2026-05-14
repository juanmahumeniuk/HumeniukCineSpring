package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Pelicula;
import com.example.HumeniukCineSpring.services.PeliculaService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/peliculas")
public class PeliculaController extends BaseControllerImpl<Pelicula, Long, PeliculaService> {

    public PeliculaController(PeliculaService servicio) {
        super(servicio);
    }
}
