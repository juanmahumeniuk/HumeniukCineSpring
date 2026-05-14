package com.example.HumeniukCineSpring.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "insumo")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Insumo extends Base {

    private String nombre;
    private double precio;
}
