package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Insumo;
import com.example.HumeniukCineSpring.repositories.InsumoRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.InsumoService;
import org.springframework.stereotype.Service;

@Service
public class InsumoServiceImpl extends BaseServiceImpl<Insumo, Long> implements InsumoService {

    public InsumoServiceImpl(InsumoRepository insumoRepository) {
        super(insumoRepository);
    }
}
