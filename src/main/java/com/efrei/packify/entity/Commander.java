package com.efrei.packify.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Commander")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commander {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_commander")
    private Long idCommander;

    @ManyToOne
    @JoinColumn(name = "id_typePack", nullable = false)
    private TypePack typePack;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "id_facture", nullable = false)
    private Facture facture;

    @Column(name = "quantite", nullable = false)
    private Integer quantite;

    @Column(name = "prix_achat", nullable = false)
    private Double prixAchat;

    public Long getIdCommander() {
        return idCommander;
    }

    public void setIdCommander(Long idCommander) {
        this.idCommander = idCommander;
    }

    public TypePack getTypePack() {
        return typePack;
    }

    public void setTypePack(TypePack typePack) {
        this.typePack = typePack;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Facture getFacture() {
        return facture;
    }

    public void setFacture(Facture facture) {
        this.facture = facture;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Double getPrixAchat() {
        return prixAchat;
    }

    public void setPrixAchat(Double prixAchat) {
        this.prixAchat = prixAchat;
    }
}