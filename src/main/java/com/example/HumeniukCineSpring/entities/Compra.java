package com.example.HumeniukCineSpring.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "compra")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Compra extends Base {

    private LocalDateTime fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cine_id")
    @JsonIgnore
    private Cine cine;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "compra_insumo",
            joinColumns = @JoinColumn(name = "compra_id"),
            inverseJoinColumns = @JoinColumn(name = "insumo_id"))
    private List<Insumo> insumos = new ArrayList<>();

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "compra_proveedor",
            joinColumns = @JoinColumn(name = "compra_id"),
            inverseJoinColumns = @JoinColumn(name = "proveedor_id"))
    private List<Proveedor> proveedores = new ArrayList<>();

    public void addInsumos(Insumo insumo) {
        insumos.add(insumo);
    }

    public void addProveedores(Proveedor proveedor) {
        proveedores.add(proveedor);
    }
}
