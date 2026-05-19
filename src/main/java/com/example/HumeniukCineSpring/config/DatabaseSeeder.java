package com.example.HumeniukCineSpring.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

/**
 * Carga el seed SQL al arrancar si la tabla {@code pelicula} está vacía.
 */
@Component
public class DatabaseSeeder {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);
    private static final String SEED_SCRIPT = "db/seed-db-cine.sql";

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    public DatabaseSeeder(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seedIfEmpty() {
        if (!seedEnabled) {
            log.debug("Seed deshabilitado (app.seed.enabled=false)");
            return;
        }

        long peliculas;
        try {
            peliculas = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM pelicula", Long.class);
        } catch (DataAccessException e) {
            log.warn("No se pudo comprobar si hay datos; omitiendo seed: {}", e.getMessage());
            return;
        }

        if (peliculas > 0) {
            log.info("Seed omitido: la base ya contiene {} película(s).", peliculas);
            return;
        }

        log.info("Base sin películas; ejecutando seed ({})...", SEED_SCRIPT);
        var populator = new ResourceDatabasePopulator(
                false,
                false,
                "UTF-8",
                new ClassPathResource(SEED_SCRIPT));
        populator.execute(dataSource);

        long peliculasCargadas = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM pelicula", Long.class);
        long cines = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM cine", Long.class);
        long funciones = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM funcion", Long.class);
        log.info(
                "Seed completado: {} películas, {} cines, {} funciones.",
                peliculasCargadas,
                cines,
                funciones);
    }
}
