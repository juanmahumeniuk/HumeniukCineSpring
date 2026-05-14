package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.ClienteVIP;
import com.example.HumeniukCineSpring.repositories.ClienteVIPRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.ClienteVIPService;
import org.springframework.stereotype.Service;

@Service
public class ClienteVIPServiceImpl extends BaseServiceImpl<ClienteVIP, Long> implements ClienteVIPService {

    public ClienteVIPServiceImpl(ClienteVIPRepository clienteVIPRepository) {
        super(clienteVIPRepository);
    }
}
