package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Venta;
import com.example.HumeniukCineSpring.repositories.VentaRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.VentaService;
import org.springframework.stereotype.Service;

@Service
public class VentaServiceImpl extends BaseServiceImpl<Venta, Long> implements VentaService {

    public VentaServiceImpl(VentaRepository ventaRepository) {
        super(ventaRepository);
    }
}
