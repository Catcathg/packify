package com.efrei.packify.service;

import com.efrei.packify.entity.Utilisateur;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.LogMongoRepository;
import com.efrei.packify.repository.UtilisateurRepository;
import com.efrei.packify.security.HachageMotdePasse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class UtilisateurService {
    @Autowired
    private LogMongoRepository logMongoRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public Utilisateur createUser(Utilisateur u) {
        Utilisateur savedUser = utilisateurRepository.save(u);

        Date currentDate = new Date();
        LogMongo log = new LogMongo(
                currentDate, typeAction.CREATE_USER, savedUser.getIdUtilisateur().toString(),
                "Utilisateur créé: " + savedUser.getIdUtilisateur().toString()
        );

        logMongoRepository.save(log);

        return savedUser;
    }

    public Optional<Utilisateur> findByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return utilisateurRepository.existsByEmail(email);
    }

    public Utilisateur registerUser(Utilisateur utilisateur) {
        // Vérifier si l'utilisateur existe déjà
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        // Hacher le mot de passe avant de l'enregistrer
        utilisateur.setMdp(HachageMotdePasse.hashPassword(utilisateur.getMdp()));

        // Utiliser la méthode createUser existante
        return this.createUser(utilisateur);
    }
}