package com.efrei.packify.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "TypePack")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypePack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_typePack")
    private Long idTypePack;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "prix", nullable = false)
    private Double prix;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "img", nullable = false, length = 500)
    private String img;

    @OneToMany(mappedBy = "typePack", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Activities> activities;

    @OneToMany(mappedBy = "typePack", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Commander> commanders;

    public Long getIdTypePack() {
        return idTypePack;
    }

    public void setIdTypePack(Long idTypePack) {
        this.idTypePack = idTypePack;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Double getPrix() {
        return prix;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public List<Activities> getActivities() {
        return activities;
    }

    public void setActivities(List<Activities> activities) {
        this.activities = activities;
    }

    public List<Commander> getCommanders() {
        return commanders;
    }

    public void setCommanders(List<Commander> commanders) {
        this.commanders = commanders;
    }
}