package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Empleado;
import com.example.HumeniukCineSpring.services.EmpleadoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController extends BaseControllerImpl<Empleado, Long, EmpleadoService> {

    public EmpleadoController(EmpleadoService servicio) {
        super(servicio);
    }
}
