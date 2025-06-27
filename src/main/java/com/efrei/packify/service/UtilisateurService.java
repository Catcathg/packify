package com.efrei.packify.service;

import com.efrei.packify.entity.Utilisateur;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.mongo.LogMongoRepository;
import com.efrei.packify.repository.mysql.UtilisateurRepository;
import com.efrei.packify.security.HachageMotdePasse;  // ← Import important
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
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

        utilisateur.setMdp(HachageMotdePasse.hashPassword(utilisateur.getMdp()));

        Utilisateur savedUser = utilisateurRepository.save(utilisateur);

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

    public Utilisateur createAdmin(Utilisateur utilisateur) {
        // ← HACHER LE MOT DE PASSE AVANT SAUVEGARDE
        utilisateur.setMdp(HachageMotdePasse.hashPassword(utilisateur.getMdp()));

        Utilisateur savedAdmin = utilisateurRepository.save(utilisateur);

        LogMongo log = new LogMongo(
                new Date(),
                typeAction.CREATE_ADMIN,
                savedAdmin.getIdUtilisateur().toString(),
                "Admin créé: " + savedAdmin.getPrenom() + " " + savedAdmin.getNom() +
                        " (" + savedAdmin.getEmail() + ")"
        );
        logMongoRepository.save(log);

        return savedAdmin;
    }

    public Utilisateur updateUser(Utilisateur utilisateur) {
        if (!utilisateurRepository.existsById(utilisateur.getIdUtilisateur())) {
            throw new RuntimeException("Utilisateur non trouvé");
        }

        utilisateur.setMdp(HachageMotdePasse.hashPassword(utilisateur.getMdp()));

        Utilisateur updatedUser = utilisateurRepository.save(utilisateur);

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

    public Optional<Utilisateur> findByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }

}
