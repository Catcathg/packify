package com.efrei.packify.controller;

import com.efrei.packify.entity.Facture;
import com.efrei.packify.service.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/factures")
@CrossOrigin(origins =  {"http://localhost:3000", "http://localhost:3001"})
public class FactureController {

    @Autowired
    private FactureService factureService;

    @GetMapping("/getAll")
    public ResponseEntity<List<Facture>> getAllFactures() {
        List<Facture> factures = factureService.getAllFactures();
        return ResponseEntity.ok(factures);
    }

    @GetMapping("/findById")
    public ResponseEntity<Facture> findById(@RequestParam Long id) {
        Facture facture = factureService.findByIdFactures(id);
        if (facture != null) {
            return ResponseEntity.ok(facture);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<Facture> saveFacture(@RequestBody Facture facture) {
        try {
            Facture savedFacture = factureService.saveFacture(facture);
            return ResponseEntity.ok(savedFacture);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Facture> updateFacture(@RequestBody Facture facture) {
        try {
            Facture updatedFacture = factureService.saveFacture(facture);
            return ResponseEntity.ok(updatedFacture);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteFacture(@RequestParam Long id) {
        try {
            factureService.deleteByIdFactures(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}