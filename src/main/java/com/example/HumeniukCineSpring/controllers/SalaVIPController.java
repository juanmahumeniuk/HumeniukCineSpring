package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.SalaVIP;
import com.example.HumeniukCineSpring.services.SalaVIPService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/salas-vip")
public class SalaVIPController extends BaseControllerImpl<SalaVIP, Long, SalaVIPService> {

    public SalaVIPController(SalaVIPService servicio) {
        super(servicio);
    }
}
