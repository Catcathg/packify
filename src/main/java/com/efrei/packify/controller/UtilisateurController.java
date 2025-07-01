package com.efrei.packify.controller;

import com.efrei.packify.entity.Utilisateur;
import com.efrei.packify.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/utilisateurs")
@CrossOrigin(origins =  {"http://localhost:3000", "http://localhost:3001"})
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping("/findById")
    public ResponseEntity<Utilisateur> findById(@RequestParam Long id) {
        Optional<Utilisateur> user = utilisateurService.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<Utilisateur> addUser(@RequestBody Utilisateur user) {
        try {
            user.setRole(1);
            Utilisateur savedUser = utilisateurService.createUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @PostMapping("/addAdmin")
    @PreAuthorize("false")
    public ResponseEntity<Utilisateur> addAdmin(@RequestBody Utilisateur user) {
        try {
            user.setRole(0);

            Utilisateur savedAdmin = utilisateurService.createAdmin(user);
            return ResponseEntity.ok(savedAdmin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Utilisateur> updateUser(@RequestBody Utilisateur user) {
        try {
            Utilisateur updatedUser = utilisateurService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(@RequestParam Long id) {
        try {
            utilisateurService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/initAdmin")
    public ResponseEntity<Utilisateur> createInitialAdmin(@RequestBody Utilisateur user) {
        try {
            user.setRole(0); // 0 = ADMIN
            Utilisateur savedAdmin = utilisateurService.createAdmin(user);
            return ResponseEntity.ok(savedAdmin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Utilisateur>> getAllUsers() {
        System.out.println(" Requête GET /all reçue");
        List<Utilisateur> users = utilisateurService.findAll();
        return ResponseEntity.ok(users);
    }
}