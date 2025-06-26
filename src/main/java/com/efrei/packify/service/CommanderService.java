package com.efrei.packify.service;

import com.efrei.packify.entity.Commander;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.mysql.CommanderRepository;
import com.efrei.packify.repository.mongo.LogMongoRepository;
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

    public List<Commander> getAllCommanders() {
        return commanderRepository.findAll();
    }

    public Commander getCommanderById(Long id) {
        return commanderRepository.findById(id).orElse(null);
    }

    public Commander saveCommander(Commander commander) {
        boolean isUpdate = commander.getIdCommander() != null &&
                commanderRepository.existsById(commander.getIdCommander());

        Commander savedCommander = commanderRepository.save(commander);

        String logMessage = (isUpdate ? "Commande mise à jour: " : "Commande créée: ") +
                "ID " + savedCommander.getIdCommander() +
                " - Quantité: " + savedCommander.getQuantite() +
                " - Prix: " + savedCommander.getPrixAchat() + "€";

        LogMongo log = new LogMongo(
                new Date(),
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

        String logMessage = "Commande supprimée: ID " + id;
        if (commanderOpt.isPresent()) {
            Commander commander = commanderOpt.get();
            logMessage += " - Montant: " + commander.getPrixAchat() + "€";
        }

        LogMongo log = new LogMongo(
                new Date(),
                typeAction.CANCEL_ORDER,
                id.toString(),
                logMessage
        );
        logMongoRepository.save(log);
    }
}