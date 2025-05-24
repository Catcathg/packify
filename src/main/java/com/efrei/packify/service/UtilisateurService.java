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

    public Optional<Utilisateur> findById(Long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur createUser(Utilisateur utilisateur) {
        Utilisateur savedUser = utilisateurRepository.save(utilisateur);

        // Log
        LogMongo log = new LogMongo(
                new Date(),
                typeAction.CREATE_USER,
                savedUser.getIdUtilisateur().toString(),
                "Utilisateur créé: " + savedUser.getPrenom() + " " + savedUser.getNom() +
                        " (" + savedUser.getEmail() + ")"
        );
        logMongoRepository.save(log);

        return savedUser;
    }

    public Utilisateur updateUser(Utilisateur utilisateur) {
        if (!utilisateurRepository.existsById(utilisateur.getIdUtilisateur())) {
            throw new RuntimeException("Utilisateur non trouvé");
        }

        utilisateur.setMdp(HachageMotdePasse.hashPassword(utilisateur.getMdp()));
        Utilisateur updatedUser = utilisateurRepository.save(utilisateur);

        // Log
        LogMongo log = new LogMongo(
                new Date(),
                typeAction.UPDATE_USER,
                updatedUser.getIdUtilisateur().toString(),
                "Utilisateur mis à jour: " + updatedUser.getPrenom() + " " + updatedUser.getNom()
        );
        logMongoRepository.save(log);

        return updatedUser;
    }

    public void deleteUser(Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur non trouvé");
        }

        Optional<Utilisateur> userOpt = utilisateurRepository.findById(id);
        utilisateurRepository.deleteById(id);

        // Log
        String userName = userOpt.map(u -> u.getPrenom() + " " + u.getNom()).orElse("ID " + id);
        LogMongo log = new LogMongo(
                new Date(),
                typeAction.DELETE_USER,
                id.toString(),
                "Utilisateur supprimé: " + userName
        );
        logMongoRepository.save(log);
    }

    public Utilisateur registerUser(Utilisateur utilisateur) {
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        utilisateur.setMdp(HachageMotdePasse.hashPassword(utilisateur.getMdp()));
        Utilisateur savedUser = this.createUser(utilisateur);

        // Log spécifique pour l'inscription
        LogMongo log = new LogMongo(
                new Date(),
                typeAction.REGISTER_USER,
                savedUser.getIdUtilisateur().toString(),
                "Inscription utilisateur: " + savedUser.getEmail()
        );
        logMongoRepository.save(log);

        return savedUser;
    }

}