package com.efrei.packify.controller;

import com.efrei.packify.entity.MotCle;
import com.efrei.packify.service.MotCleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/motcle")
public class MotCleController {

    @Autowired
    private MotCleService motCleService;

    @GetMapping("/getAll")
    public ResponseEntity<List<MotCle>> getAllMotCle() {
        List<MotCle> motCles = motCleService.getAllMotCle();
        return ResponseEntity.ok(motCles);
    }

    @GetMapping("/findById")
    public ResponseEntity<MotCle> findById(@RequestParam Long id) {
        Optional<MotCle> motCle = motCleService.findMotCleById(id);
        return motCle.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/save")
    public ResponseEntity<MotCle> saveMotCle(@RequestBody MotCle motCle) {
        MotCle savedMotCle = motCleService.saveMotCle(motCle);
        return ResponseEntity.ok(savedMotCle);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteMotCle(@RequestParam Long id) {
        motCleService.deleteMotCle(id);
        return ResponseEntity.ok().build();
    }
}