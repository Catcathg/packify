package com.efrei.packify.service;

import com.efrei.packify.entity.Commander;
import com.efrei.packify.repository.CommanderRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommanderService {

    @Autowired
    private CommanderRespository commanderRespository;

    public Commander getCommanderById(Long id) {
        return commanderRespository.findById(id).orElse(null) ;
    }

    public List<Commander> getAllCommanders() {
        return commanderRespository.findAll();
    }
}
