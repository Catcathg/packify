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
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }
        utilisateur.setMdp(HachageMotdePasse.hashPassword(utilisateur.getMdp()));
        return this.createUser(utilisateur);
    }

    public Optional<Utilisateur> findById(Long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur updateUser(Utilisateur utilisateur) {
        if (!utilisateurRepository.existsById(utilisateur.getIdUtilisateur())) {
            throw new RuntimeException("Utilisateur non trouvé");
        }

        utilisateur.setMdp(HachageMotdePasse.hashPassword(utilisateur.getMdp()));

        Utilisateur updatedUser = utilisateurRepository.save(utilisateur);

        Date currentDate = new Date();
        LogMongo log = new LogMongo(
                currentDate, typeAction.UPDATE_USER, updatedUser.getIdUtilisateur().toString(),
                "Utilisateur mis à jour: " + updatedUser.getIdUtilisateur().toString()
        );

        logMongoRepository.save(log);

        return updatedUser;
    }

    public void deleteUser(Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur non trouvé");
        }

        utilisateurRepository.deleteById(id);

        Date currentDate = new Date();
        LogMongo log = new LogMongo(
                currentDate, typeAction.DELETE_USER, id.toString(),
                "Utilisateur supprimé: " + id.toString()
        );

        logMongoRepository.save(log);
    }


}