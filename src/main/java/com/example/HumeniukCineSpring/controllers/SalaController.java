package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Sala;
import com.example.HumeniukCineSpring.services.SalaService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/salas")
public class SalaController extends BaseControllerImpl<Sala, Long, SalaService> {

    public SalaController(SalaService servicio) {
        super(servicio);
    }
}
