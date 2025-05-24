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

    @GetMapping("/findById")
    public ResponseEntity<Commander> findById(@RequestParam Long id) {
        Commander commander = commanderService.getCommanderById(id);
        if (commander != null) {
            return ResponseEntity.ok(commander);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<Commander> saveCommander(@RequestBody Commander commander) {
        try {
            Commander savedCommander = commanderService.saveCommander(commander);
            return ResponseEntity.ok(savedCommander);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Commander> updateCommander(@RequestBody Commander commander) {
        try {
            Commander updatedCommander = commanderService.saveCommander(commander);
            return ResponseEntity.ok(updatedCommander);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteCommander(@RequestParam Long id) {
        try {
            commanderService.deleteCommander(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}