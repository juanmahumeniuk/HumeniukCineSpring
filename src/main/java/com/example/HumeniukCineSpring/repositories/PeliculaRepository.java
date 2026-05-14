package com.example.HumeniukCineSpring.repositories;

import com.example.HumeniukCineSpring.entities.Pelicula;
import org.springframework.stereotype.Repository;

@Repository
public interface PeliculaRepository extends BaseRepository<Pelicula, Long> {
}
