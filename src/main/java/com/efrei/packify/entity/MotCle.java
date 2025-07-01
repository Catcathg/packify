package com.efrei.packify.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "mot_cle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MotCle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mot_cle")
    private Long idMotCle;

    @Column(name = "nom", nullable = false, length = 50)
    private String nom;

    public Long getIdMotCle() {
        return idMotCle;
    }

    public void setIdMotCle(Long idMotCle) {
        this.idMotCle = idMotCle;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }
}