package com.efrei.packify.controller;


import com.efrei.packify.entity.Utilisateur;
import com.efrei.packify.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/add")
    public Utilisateur addUser(@RequestBody Utilisateur user) {
        return utilisateurService.createUser(user);
    }


}
