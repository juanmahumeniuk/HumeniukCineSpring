package com.example.HumeniukCineSpring.controllers;

import com.example.HumeniukCineSpring.entities.ClienteVIP;
import com.example.HumeniukCineSpring.services.ClienteVIPService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes-vip")
public class ClienteVIPController extends BaseControllerImpl<ClienteVIP, Long, ClienteVIPService> {

    public ClienteVIPController(ClienteVIPService servicio) {
        super(servicio);
    }
}
