package com.efrei.packify.service;

import com.efrei.packify.entity.Facture;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.FactureRepository;
import com.efrei.packify.repository.LogMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private LogMongoRepository logMongoRepository;

    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Facture findByIdFactures(Long id) {
        return factureRepository.findById(id).orElse(null);
    }

    public Facture saveFacture(Facture facture) {
        boolean isUpdate = facture.getIdFacture() != null &&
                factureRepository.existsById(facture.getIdFacture());

        Facture savedFacture = factureRepository.save(facture);

        // Log
        String logMessage = (isUpdate ? "Facture mise à jour: " : "Facture créée: ") +
                "ID " + savedFacture.getIdFacture() +
                " - Montant: " + savedFacture.getTotal() + "€" +
                " - Date: " + savedFacture.getDatePaiement();

        LogMongo log = new LogMongo(
                new Date(),
                isUpdate ? typeAction.UPDATE_INVOICE : typeAction.CREATE_INVOICE,
                savedFacture.getIdFacture().toString(),
                logMessage
        );
        logMongoRepository.save(log);

        return savedFacture;
    }

    public void deleteByIdFactures(Long id) {
        Optional<Facture> factureOpt = factureRepository.findById(id);
        factureRepository.deleteById(id);

        // Log
        String logMessage = "Facture supprimée: ID " + id;
        if (factureOpt.isPresent()) {
            Facture facture = factureOpt.get();
            logMessage += " - Montant: " + facture.getTotal() + "€";
        }

        LogMongo log = new LogMongo(
                new Date(),
                typeAction.DELETE_INVOICE,
                id.toString(),
                logMessage
        );
        logMongoRepository.save(log);
    }
}