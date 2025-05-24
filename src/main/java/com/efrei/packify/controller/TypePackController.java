package com.efrei.packify.controller;

import com.efrei.packify.entity.TypePack;
import com.efrei.packify.service.TypePackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<TypePack> findById(Long id) {
        TypePack typePack = typePackService.getTypePackById(id);
        if (typePack != null) {
            return ResponseEntity.ok(typePack);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/save")
    public ResponseEntity<TypePack> saveTypePack(TypePack typePack) {
        TypePack savedTypePack = typePackService.saveTypePack(typePack);
        return ResponseEntity.ok(savedTypePack);
    }

    @GetMapping("/delete")
    public ResponseEntity<Void> deleteTypePack(Long id) {
        typePackService.deleteTypePack(id);
        return ResponseEntity.ok().build();
    }

}
