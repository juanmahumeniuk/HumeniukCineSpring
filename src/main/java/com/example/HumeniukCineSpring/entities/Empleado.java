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
@Table(name = "empleado")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Empleado extends Base {

    private String nombre;
    private int dni;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "empleado_cine",
            joinColumns = @JoinColumn(name = "empleado_id"),
            inverseJoinColumns = @JoinColumn(name = "cine_id"))
    @JsonIgnore
    private List<Cine> cines = new ArrayList<>();

    public void addCine(Cine cine) {
        cines.add(cine);
        cine.getEmpleados().add(this);
    }
}
