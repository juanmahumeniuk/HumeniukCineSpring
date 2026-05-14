package com.example.HumeniukCineSpring.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venta")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Venta extends Base {

    private LocalDateTime fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cine_id")
    private Cine cine;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "pago_id", unique = true)
    private Pago pago;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "venta_funcion",
            joinColumns = @JoinColumn(name = "venta_id"),
            inverseJoinColumns = @JoinColumn(name = "funcion_id"))
    private List<Funcion> funciones = new ArrayList<>();

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "venta_cliente",
            joinColumns = @JoinColumn(name = "venta_id"),
            inverseJoinColumns = @JoinColumn(name = "cliente_id"))
    private List<Cliente> clientes = new ArrayList<>();

    public void addFunciones(Funcion funcion) {
        funciones.add(funcion);
        funcion.getVentas().add(this);
    }

    public void addClientes(Cliente cliente) {
        clientes.add(cliente);
    }
}
