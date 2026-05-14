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

    @Override
    public float obtenerDescuento() {
        return 15;
    }
}
