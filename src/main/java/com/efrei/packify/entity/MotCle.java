package com.efrei.packify.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "MotCle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MotCle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_motCle")
    private Long idMotCle;

    @Column(name = "nom", nullable = false, length = 50)
    private String nom;

}