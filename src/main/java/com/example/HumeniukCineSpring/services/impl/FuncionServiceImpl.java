package com.example.HumeniukCineSpring.services.impl;

import com.example.HumeniukCineSpring.entities.Funcion;
import com.example.HumeniukCineSpring.repositories.FuncionRepository;
import com.example.HumeniukCineSpring.services.BaseServiceImpl;
import com.example.HumeniukCineSpring.services.FuncionService;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class FuncionServiceImpl extends BaseServiceImpl<Funcion, Long> implements FuncionService {

    private final FuncionRepository funcionRepository;

    public FuncionServiceImpl(FuncionRepository funcionRepository) {
        super(funcionRepository);
        this.funcionRepository = funcionRepository;
    }

    @Override
    public Map<Long, Long> countFuncionesByPeliculaId() throws Exception {
        try {
            Map<Long, Long> counts = new LinkedHashMap<>();
            for (Object[] row : funcionRepository.countByPeliculaId()) {
                Long peliculaId = ((Number) row[0]).longValue();
                Long total = ((Number) row[1]).longValue();
                counts.put(peliculaId, total);
            }
            return counts;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}
