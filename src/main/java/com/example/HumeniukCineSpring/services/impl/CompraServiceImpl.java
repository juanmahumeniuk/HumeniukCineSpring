package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Compra;
import com.example.HumeniukCineSpring.repositories.CompraRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.CompraService;
import org.springframework.stereotype.Service;

@Service
public class CompraServiceImpl extends BaseServiceImpl<Compra, Long> implements CompraService {

    public CompraServiceImpl(CompraRepository compraRepository) {
        super(compraRepository);
    }
}
