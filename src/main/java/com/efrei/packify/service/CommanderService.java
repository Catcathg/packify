package com.efrei.packify.service;

import com.efrei.packify.entity.Commander;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.CommanderRepository;
import com.efrei.packify.repository.LogMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommanderService {

    @Autowired
    private CommanderRepository commanderRepository;

    @Autowired
    private LogMongoRepository logMongoRepository;

    public Commander getCommanderById(Long id) {
        return commanderRepository.findById(id).orElse(null);
    }

    public List<Commander> getAllCommanders() {
        return commanderRepository.findAll();
    }

    public Commander saveCommander(Commander commander) {
        boolean isUpdate = commander.getIdCommander() != null &&
                commanderRepository.existsById(commander.getIdCommander());

        Commander savedCommander = commanderRepository.save(commander);

        Date currentDate = new Date();
        String logMessage = (isUpdate ? "Commande mise à jour: " : "Commande créée: ") +
                "ID " + savedCommander.getIdCommander() +
                " - Client: " + savedCommander.getUtilisateur().getIdUtilisateur() +
                " - Pack: " + savedCommander.getTypePack().getNom() +
                " - Quantité: " + savedCommander.getQuantite() +
                " - Prix: " + savedCommander.getPrixAchat() + "€";

        LogMongo log = new LogMongo(
                currentDate,
                isUpdate ? typeAction.UPDATE_ORDER : typeAction.CREATE_ORDER,
                savedCommander.getIdCommander().toString(),
                logMessage
        );

        logMongoRepository.save(log);

        return savedCommander;
    }

    public void deleteCommander(Long id) {
        Optional<Commander> commanderOpt = commanderRepository.findById(id);

        commanderRepository.deleteById(id);

        Date currentDate = new Date();
        String logMessage = "Commande supprimée: ID " + id;

        if (commanderOpt.isPresent()) {
            Commander commander = commanderOpt.get();
            logMessage += " - Client: " + commander.getUtilisateur().getIdUtilisateur() +
                    " - Pack: " + commander.getTypePack().getNom() +
                    " - Montant: " + commander.getPrixAchat() + "€";
        }

        LogMongo log = new LogMongo(
                currentDate,
                typeAction.CANCEL_ORDER,
                id.toString(),
                logMessage
        );

        logMongoRepository.save(log);
    }

    public Optional<Commander> getCommanderByIdOptional(Long id) {
        return commanderRepository.findById(id);
    }

    public boolean existsById(Long id) {
        return commanderRepository.existsById(id);
    }

    public List<Commander> getCommandersByUtilisateur(Long utilisateurId) {
        return commanderRepository.findByUtilisateur_IdUtilisateur(utilisateurId);
    }

    public List<Commander> getCommandersByTypePack(Long typePackId) {
        return commanderRepository.findByTypePack_IdTypePack(typePackId);
    }

    public List<Commander> getCommandersByFacture(Long factureId) {
        return commanderRepository.findByFacture_IdFacture(factureId);
    }
}