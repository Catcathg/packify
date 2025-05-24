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
}