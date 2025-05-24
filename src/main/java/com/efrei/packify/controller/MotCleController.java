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
        try {
            MotCle savedMotCle = motCleService.saveMotCle(motCle);
            return ResponseEntity.ok(savedMotCle);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<MotCle> updateMotCle(@RequestBody MotCle motCle) {
        try {
            MotCle updatedMotCle = motCleService.saveMotCle(motCle);
            return ResponseEntity.ok(updatedMotCle);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteMotCle(@RequestParam Long id) {
        try {
            motCleService.deleteMotCle(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}