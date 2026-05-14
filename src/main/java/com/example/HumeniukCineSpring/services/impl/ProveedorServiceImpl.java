package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Proveedor;
import com.example.HumeniukCineSpring.repositories.ProveedorRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.ProveedorService;
import org.springframework.stereotype.Service;

@Service
public class ProveedorServiceImpl extends BaseServiceImpl<Proveedor, Long> implements ProveedorService {

    public ProveedorServiceImpl(ProveedorRepository proveedorRepository) {
        super(proveedorRepository);
    }
}
