package com.efrei.packify.controller;

import com.efrei.packify.entity.TypePack;
import com.efrei.packify.service.TypePackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/typePacks")
@CrossOrigin(origins =  {"http://localhost:3000", "http://localhost:3001"})
public class TypePackController {

    @Autowired
    private TypePackService typePackService;

    @GetMapping("/getAll")
    public ResponseEntity<List<TypePack>> getAllTypePacks() {
        List<TypePack> typePacks = typePackService.getAllTypePacks();
        return ResponseEntity.ok(typePacks);
    }

    @GetMapping("/findById")
    public ResponseEntity<TypePack> findById(@RequestParam Long id) {
        TypePack typePack = typePackService.getTypePackById(id);
        if (typePack != null) {
            return ResponseEntity.ok(typePack);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<TypePack> saveTypePack(@RequestBody TypePack typePack) {
        try {
            TypePack savedTypePack = typePackService.saveTypePack(typePack);
            return ResponseEntity.ok(savedTypePack);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TypePack> updateTypePackById(
            @PathVariable Long id,
            @RequestBody TypePack typePack
    ) {
        try {
            TypePack existingPack = typePackService.getTypePackById(id);
            if (existingPack == null) {
                return ResponseEntity.notFound().build();
            }

            typePack.setIdTypePack(id);

            TypePack updatedTypePack = typePackService.saveTypePack(typePack);

            return ResponseEntity.ok(updatedTypePack);

        } catch (Exception e) {
            System.err.println("Erreur: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); // 500 au lieu de 400
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteTypePack(@RequestParam Long id) {
        try {
            typePackService.deleteTypePack(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}