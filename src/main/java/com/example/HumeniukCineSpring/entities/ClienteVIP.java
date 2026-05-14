package com.example.HumeniukCineSpring.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "cliente_vip")
@PrimaryKeyJoinColumn(name = "cliente_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class ClienteVIP extends Cliente {

    private float descuento;
}
