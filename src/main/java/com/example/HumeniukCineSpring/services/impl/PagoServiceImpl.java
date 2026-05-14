package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Pago;
import com.example.HumeniukCineSpring.repositories.PagoRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.PagoService;
import org.springframework.stereotype.Service;

@Service
public class PagoServiceImpl extends BaseServiceImpl<Pago, Long> implements PagoService {

    public PagoServiceImpl(PagoRepository pagoRepository) {
        super(pagoRepository);
    }
}
