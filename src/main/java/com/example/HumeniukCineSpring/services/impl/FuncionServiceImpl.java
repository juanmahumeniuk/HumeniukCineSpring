package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Funcion;
import com.example.HumeniukCineSpring.repositories.FuncionRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.FuncionService;
import org.springframework.stereotype.Service;

@Service
public class FuncionServiceImpl extends BaseServiceImpl<Funcion, Long> implements FuncionService {

    public FuncionServiceImpl(FuncionRepository funcionRepository) {
        super(funcionRepository);
    }
}
