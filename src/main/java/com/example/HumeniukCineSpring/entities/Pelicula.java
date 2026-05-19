package com.example.HumeniukCineSpring.entities;

import org.hibernate.envers.Audited;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    
    private Double puntaje;

    private Integer anio;

    private Integer duracionMinutos;

    private String director;

    
    private String clasificacion;

    @Override
    public float obtenerDescuento() {
        return 15;
    }
}
