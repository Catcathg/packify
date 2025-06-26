package com.efrei.packify.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activities {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_activities")
    private Long idActivities;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "adresse", nullable = false, length = 200)
    private String adresse;

    @Column(name = "ville", nullable = false, length = 100)
    private String ville;

    @Column(name = "code_postal", nullable = false, length = 10)
    private String codePostal;

    @Column(name = "img", nullable = false, length = 500)
    private String img;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_typePack", nullable = false)
    private TypePack typePack;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_motCle", nullable = false)
    private MotCle motCle;

    public Long getIdActivities() {
        return idActivities;
    }

    public void setIdActivities(Long idActivities) {
        this.idActivities = idActivities;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TypePack getTypePack() {
        return typePack;
    }

    public void setTypePack(TypePack typePack) {
        this.typePack = typePack;
    }

    public MotCle getMotCle() {
        return motCle;
    }

    public void setMotCle(MotCle motCle) {
        this.motCle = motCle;
    }
}