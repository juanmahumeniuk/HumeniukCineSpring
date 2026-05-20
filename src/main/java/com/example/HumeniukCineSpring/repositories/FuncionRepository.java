package com.example.HumeniukCineSpring.repositories;

import com.example.HumeniukCineSpring.entities.Funcion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuncionRepository extends BaseRepository<Funcion, Long> {

    @EntityGraph(attributePaths = { "pelicula", "sala" })
    @Override
    List<Funcion> findAll();

    @EntityGraph(attributePaths = { "pelicula", "sala" })
    @Override
    Optional<Funcion> findById(Long id);

    @Query("""
            SELECT f.pelicula.id, COUNT(f)
            FROM Funcion f
            WHERE f.pelicula.id IS NOT NULL
            GROUP BY f.pelicula.id
            """)
    List<Object[]> countByPeliculaId();
}
