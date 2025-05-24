package com.efrei.packify.controller;

import com.efrei.packify.entity.Commander;
import com.efrei.packify.service.CommanderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/commandes")
public class CommanderController {
    @Autowired
    private CommanderService commanderService;

    @GetMapping("/getAll")
    public List<Commander> getAll() {
        return commanderService.getAllCommanders();
    }

    @GetMapping("/getOne")
    public Commander getOne(Long id) {
        return commanderService.getCommanderById(id);
    }
}

