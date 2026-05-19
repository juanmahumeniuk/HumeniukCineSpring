package com.example.HumeniukCineSpring.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cine")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Cine extends Base {

    private String nombre;
    private String direccion;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "cine_pelicula",
            joinColumns = @JoinColumn(name = "cine_id"),
            inverseJoinColumns = @JoinColumn(name = "pelicula_id"))
    private List<Pelicula> peliculas = new ArrayList<>();

    @OneToMany(mappedBy = "cine", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Venta> ventas = new ArrayList<>();

    @OneToMany(mappedBy = "cine", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sala> salas = new ArrayList<>();

    @OneToMany(mappedBy = "cine", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Compra> compras = new ArrayList<>();

    @ManyToMany(mappedBy = "cines")
    private List<Empleado> empleados = new ArrayList<>();

    public void addPeliculas(Pelicula pelicula) {
        peliculas.add(pelicula);
    }

    public void addVenta(Venta venta) {
        ventas.add(venta);
        venta.setCine(this);
    }

    public void addSalaVip(SalaVIP salaVip) {
        salas.add(salaVip);
        salaVip.setCine(this);
    }

    public void addSala(Sala sala) {
        salas.add(sala);
        sala.setCine(this);
    }

    public void addCompra(Compra compra) {
        compras.add(compra);
        compra.setCine(this);
    }

    public void addEmpleado(Empleado empleado) {
        empleados.add(empleado);
        empleado.getCines().add(this);
    }
}
