package com.example.HumeniukCineSpring.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import org.hibernate.envers.Audited;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "funcion")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Funcion extends Base {

    private String horario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pelicula_id")
    private Pelicula pelicula;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_id")
    private Sala sala;

    @OneToMany(mappedBy = "funcion", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 25)
    private List<Entrada> entradas = new ArrayList<>();

    @ManyToMany(mappedBy = "funciones")
    @JsonIgnore
    private List<Venta> ventas = new ArrayList<>();

    public void addEntradas(Entrada entrada) {
        entradas.add(entrada);
        entrada.setFuncion(this);
    }
}
