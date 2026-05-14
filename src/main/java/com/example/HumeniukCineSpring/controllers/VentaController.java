package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Venta;
import com.example.HumeniukCineSpring.services.VentaService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ventas")
public class VentaController extends BaseControllerImpl<Venta, Long, VentaService> {

    public VentaController(VentaService servicio) {
        super(servicio);
    }
}
