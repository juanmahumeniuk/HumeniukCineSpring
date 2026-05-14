package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.SalaVIP;
import com.example.HumeniukCineSpring.repositories.SalaVIPRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.SalaVIPService;
import org.springframework.stereotype.Service;

@Service
public class SalaVIPServiceImpl extends BaseServiceImpl<SalaVIP, Long> implements SalaVIPService {

    public SalaVIPServiceImpl(SalaVIPRepository salaVIPRepository) {
        super(salaVIPRepository);
    }
}
