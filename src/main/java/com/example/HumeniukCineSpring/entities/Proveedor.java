package com.example.HumeniukCineSpring.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "proveedor")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Proveedor extends Base {

    private String nombre;
    private String telefono;
    private String direccion;
}
