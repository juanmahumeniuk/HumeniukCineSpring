package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Proveedor;
import com.example.HumeniukCineSpring.services.ProveedorService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController extends BaseControllerImpl<Proveedor, Long, ProveedorService> {

    public ProveedorController(ProveedorService servicio) {
        super(servicio);
    }
}
