package com.example.HumeniukCineSpring.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "pago")
@Getter
@Setter
@NoArgsConstructor
@Audited
public class Pago extends Base {

    private double monto;

    @Enumerated(EnumType.STRING)
    private TipoPago tipo;
}
