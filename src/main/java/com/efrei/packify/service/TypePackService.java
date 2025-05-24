package com.efrei.packify.service;

import com.efrei.packify.entity.TypePack;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.LogMongoRepository;
import com.efrei.packify.repository.TypePackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TypePackService {

    @Autowired
    private TypePackRepository typePackRepository;

    @Autowired
    private LogMongoRepository logMongoRepository;

    public List<TypePack> getAllTypePacks() {
        return typePackRepository.findAll();
    }

    public TypePack getTypePackById(Long id) {
        return typePackRepository.findById(id).orElse(null);
    }

    public TypePack saveTypePack(TypePack typePack) {
        boolean isUpdate = typePack.getIdTypePack() != null &&
                typePackRepository.existsById(typePack.getIdTypePack());

        TypePack savedTypePack = typePackRepository.save(typePack);

        // Log
        String logMessage = (isUpdate ? "Pack mis à jour: " : "Pack créé: ") +
                savedTypePack.getNom() +
                " - Prix: " + savedTypePack.getPrix() + "€";

        LogMongo log = new LogMongo(
                new Date(),
                isUpdate ? typeAction.UPDATE_PACK : typeAction.CREATE_PACK,
                savedTypePack.getIdTypePack().toString(),
                logMessage
        );
        logMongoRepository.save(log);

        return savedTypePack;
    }

    public void deleteTypePack(Long id) {
        Optional<TypePack> typePackOpt = typePackRepository.findById(id);
        typePackRepository.deleteById(id);

        // Log
        String logMessage = "Pack supprimé: ";
        if (typePackOpt.isPresent()) {
            TypePack typePack = typePackOpt.get();
            logMessage += typePack.getNom() + " - Prix: " + typePack.getPrix() + "€";
        } else {
            logMessage += "ID " + id;
        }

        LogMongo log = new LogMongo(
                new Date(),
                typeAction.DELETE_PACK,
                id.toString(),
                logMessage
        );
        logMongoRepository.save(log);
    }
}