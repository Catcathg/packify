package com.efrei.packify.controller;

import com.efrei.packify.entity.Commander;
import com.efrei.packify.service.CommanderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/commandes")
public class CommanderController {

    @Autowired
    private CommanderService commanderService;

    @GetMapping("/getAll")
    public ResponseEntity<List<Commander>> getAllCommanders() {
        List<Commander> commanders = commanderService.getAllCommanders();
        return ResponseEntity.ok(commanders);
    }

    @PostMapping("/save")
    public ResponseEntity<Commander> save(@RequestBody Commander commander) {
        Commander savedCommander = commanderService.saveCommander(commander);
        return ResponseEntity.ok(savedCommander);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteByIdCommanders(@RequestParam Long id) {
        commanderService.deleteCommander(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/findById")
    public ResponseEntity<Commander> findByIdCommanders(@RequestParam Long id) {
        Commander commander = commanderService.getCommanderById(id);
        if (commander != null) {
            return ResponseEntity.ok(commander);
        }
        return ResponseEntity.notFound().build();
    }
}