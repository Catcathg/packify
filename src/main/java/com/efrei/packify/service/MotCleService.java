package com.efrei.packify.service;

import com.efrei.packify.entity.MotCle;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.LogMongoRepository;
import com.efrei.packify.repository.MotCleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MotCleService {

    @Autowired
    private MotCleRepository motCleRepository;

    @Autowired
    private LogMongoRepository logMongoRepository;

    public List<MotCle> getAllMotCle() {
        return motCleRepository.findAll();
    }

    public Optional<MotCle> findMotCleById(Long id) {
        return motCleRepository.findById(id);
    }

    public MotCle saveMotCle(MotCle motCle) {
        boolean isUpdate = motCle.getIdMotCle() != null &&
                motCleRepository.existsById(motCle.getIdMotCle());

        MotCle savedMotCle = motCleRepository.save(motCle);

        // Log
        String logMessage = (isUpdate ? "Mot-clé mis à jour: " : "Mot-clé créé: ") +
                savedMotCle.getNom();

        LogMongo log = new LogMongo(
                new Date(),
                isUpdate ? typeAction.UPDATE_KEYWORD : typeAction.CREATE_KEYWORD,
                savedMotCle.getIdMotCle().toString(),
                logMessage
        );
        logMongoRepository.save(log);

        return savedMotCle;
    }

    public void deleteMotCle(Long id) {
        Optional<MotCle> motCleOpt = motCleRepository.findById(id);
        motCleRepository.deleteById(id);

        // Log
        String motCleName = motCleOpt.map(MotCle::getNom).orElse("ID " + id);
        LogMongo log = new LogMongo(
                new Date(),
                typeAction.DELETE_KEYWORD,
                id.toString(),
                "Mot-clé supprimé: " + motCleName
        );
        logMongoRepository.save(log);
    }
}