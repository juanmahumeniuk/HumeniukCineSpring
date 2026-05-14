package com.example.HumeniukCineSpring.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "entrada")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Entrada extends Base {

    private double precio;
    private String asiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcion_id")
    private Funcion funcion;
}
