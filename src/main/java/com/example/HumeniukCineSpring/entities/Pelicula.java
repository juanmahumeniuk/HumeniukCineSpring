package com.example.HumeniukCineSpring.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "pelicula")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Pelicula extends Base implements IPromocion {

    private String titulo;

    @Enumerated(EnumType.STRING)
    private Genero genero;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    /** Puntaje de referencia (escala 0–10). */
    private Double puntaje;

    private Integer anio;

    private Integer duracionMinutos;

    private String director;

    /** Clasificación por edades (ej. ATP, +13, +16). */
    private String clasificacion;

    @Override
    public float obtenerDescuento() {
        return 15;
    }
}
