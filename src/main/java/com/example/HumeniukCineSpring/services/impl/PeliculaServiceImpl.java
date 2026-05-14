package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Pelicula;
import com.example.HumeniukCineSpring.repositories.PeliculaRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.PeliculaService;
import org.springframework.stereotype.Service;

@Service
public class PeliculaServiceImpl extends BaseServiceImpl<Pelicula, Long> implements PeliculaService {

    public PeliculaServiceImpl(PeliculaRepository peliculaRepository) {
        super(peliculaRepository);
    }
}
