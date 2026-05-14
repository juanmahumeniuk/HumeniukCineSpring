package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Entrada;
import com.example.HumeniukCineSpring.repositories.EntradaRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.EntradaService;
import org.springframework.stereotype.Service;

@Service
public class EntradaServiceImpl extends BaseServiceImpl<Entrada, Long> implements EntradaService {

    public EntradaServiceImpl(EntradaRepository entradaRepository) {
        super(entradaRepository);
    }
}
