package com.example.HumeniukCineSpring.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "sala_vip")
@PrimaryKeyJoinColumn(name = "sala_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class SalaVIP extends Sala {

    private String beneficios;
}
