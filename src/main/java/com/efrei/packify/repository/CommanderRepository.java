package com.efrei.packify.repository;

import com.efrei.packify.entity.Commander;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CommanderRepository extends JpaRepository<Commander, Long> {
    List<Commander> findByUtilisateur_IdUtilisateur(Long utilisateurId);
    List<Commander> findByTypePack_IdTypePack(Long typePackId);
    List<Commander> findByFacture_IdFacture(Long factureId);
}

