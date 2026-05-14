package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Entrada;
import com.example.HumeniukCineSpring.services.EntradaService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entradas")
public class EntradaController extends BaseControllerImpl<Entrada, Long, EntradaService> {

    public EntradaController(EntradaService servicio) {
        super(servicio);
    }
}
