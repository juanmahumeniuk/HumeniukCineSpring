package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.Cliente;
import com.example.HumeniukCineSpring.services.ClienteService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController extends BaseControllerImpl<Cliente, Long, ClienteService> {

    public ClienteController(ClienteService servicio) {
        super(servicio);
    }
}
