package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Cliente;
import com.example.HumeniukCineSpring.repositories.ClienteRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.ClienteService;
import org.springframework.stereotype.Service;

@Service
public class ClienteServiceImpl extends BaseServiceImpl<Cliente, Long> implements ClienteService {

    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        super(clienteRepository);
    }
}
