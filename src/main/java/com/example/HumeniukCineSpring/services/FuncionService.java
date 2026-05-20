package com.example.HumeniukCineSpring.services;

import com.example.HumeniukCineSpring.entities.Funcion;

import java.util.Map;

public interface FuncionService extends BaseService<Funcion, Long> {

    Map<Long, Long> countFuncionesByPeliculaId() throws Exception;
}
