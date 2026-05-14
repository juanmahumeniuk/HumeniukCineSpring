package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Sala;
import com.example.HumeniukCineSpring.repositories.SalaRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.SalaService;
import org.springframework.stereotype.Service;

@Service
public class SalaServiceImpl extends BaseServiceImpl<Sala, Long> implements SalaService {

    public SalaServiceImpl(SalaRepository salaRepository) {
        super(salaRepository);
    }
}
