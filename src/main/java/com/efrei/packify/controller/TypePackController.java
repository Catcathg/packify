package com.efrei.packify.controller;

import com.efrei.packify.entity.TypePack;
import com.efrei.packify.service.TypePackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/typePacks")
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

    @PutMapping("/update")
    public ResponseEntity<TypePack> updateTypePack(@RequestBody TypePack typePack) {
        try {
            TypePack updatedTypePack = typePackService.saveTypePack(typePack);
            return ResponseEntity.ok(updatedTypePack);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
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