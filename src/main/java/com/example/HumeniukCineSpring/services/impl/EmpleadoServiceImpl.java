package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Empleado;
import com.example.HumeniukCineSpring.repositories.EmpleadoRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.EmpleadoService;
import org.springframework.stereotype.Service;

@Service
public class EmpleadoServiceImpl extends BaseServiceImpl<Empleado, Long> implements EmpleadoService {

    public EmpleadoServiceImpl(EmpleadoRepository empleadoRepository) {
        super(empleadoRepository);
    }
}
