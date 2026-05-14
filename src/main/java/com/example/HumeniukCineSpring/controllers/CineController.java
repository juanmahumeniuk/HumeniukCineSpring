package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Cine;
import com.example.HumeniukCineSpring.services.CineService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cines")
public class CineController extends BaseControllerImpl<Cine, Long, CineService> {

    public CineController(CineService servicio) {
        super(servicio);
    }
}
