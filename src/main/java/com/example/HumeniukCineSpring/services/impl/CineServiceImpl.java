package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Cine;
import com.example.HumeniukCineSpring.repositories.CineRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.CineService;
import org.springframework.stereotype.Service;

@Service
public class CineServiceImpl extends BaseServiceImpl<Cine, Long> implements CineService {

    public CineServiceImpl(CineRepository cineRepository) {
        super(cineRepository);
    }
}
