package com.example.HumeniukCineSpring.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sala")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Sala extends Base {

    protected int numero;
    protected int capacidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cine_id")
    private Cine cine;

    @OneToMany(mappedBy = "sala", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Funcion> funciones = new ArrayList<>();

    public void addFunciones(Funcion funcion) {
        funciones.add(funcion);
        funcion.setSala(this);
    }
}
