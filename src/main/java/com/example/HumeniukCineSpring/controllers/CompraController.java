package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Compra;
import com.example.HumeniukCineSpring.services.CompraService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/compras")
public class CompraController extends BaseControllerImpl<Compra, Long, CompraService> {

    public CompraController(CompraService servicio) {
        super(servicio);
    }
}
