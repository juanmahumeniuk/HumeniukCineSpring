package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Insumo;
import com.example.HumeniukCineSpring.services.InsumoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insumos")
public class InsumoController extends BaseControllerImpl<Insumo, Long, InsumoService> {

    public InsumoController(InsumoService servicio) {
        super(servicio);
    }
}
