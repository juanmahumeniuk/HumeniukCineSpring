package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Funcion;
import com.example.HumeniukCineSpring.services.FuncionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/funciones")
public class FuncionController extends BaseControllerImpl<Funcion, Long, FuncionService> {

    public FuncionController(FuncionService servicio) {
        super(servicio);
    }
}
