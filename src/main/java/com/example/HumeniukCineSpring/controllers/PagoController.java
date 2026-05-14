package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Pago;
import com.example.HumeniukCineSpring.services.PagoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pagos")
public class PagoController extends BaseControllerImpl<Pago, Long, PagoService> {

    public PagoController(PagoService servicio) {
        super(servicio);
    }
}
