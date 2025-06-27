package com.efrei.packify.controller;

import com.efrei.packify.entity.Utilisateur;
import com.efrei.packify.security.HachageMotdePasse;
import com.efrei.packify.security.JwtUtil;
import com.efrei.packify.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("mdp");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email et mot de passe requis");
            }

            Optional<Utilisateur> userOptional = utilisateurService.findByEmail(email);

            if (userOptional.isPresent() && HachageMotdePasse.checkPassword(password, userOptional.get().getMdp())) {
                Utilisateur user = userOptional.get();
                String roleName = user.getRole() == 0 ? "ADMIN" : "USER";
                String token = jwtUtil.generateToken(email, roleName);


                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", user.getRole() == 0 ? "ADMIN" : "USER");
                response.put("userId", user.getIdUtilisateur());
                response.put("email", user.getEmail());

                return ResponseEntity.ok(response);
            }

            return ResponseEntity.badRequest().body("Identifiants invalides");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la connexion : " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur utilisateur) {
        try {
            if (utilisateur.getEmail() == null || utilisateur.getMdp() == null) {
                return ResponseEntity.badRequest().body("Email et mot de passe requis");
            }

            if (utilisateurService.findByEmail(utilisateur.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Cet email est déjà utilisé");
            }

            utilisateur.setRole(1);
            Utilisateur newUser = utilisateurService.createUser(utilisateur);
            return ResponseEntity.ok("Utilisateur créé avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la création : " + e.getMessage());
        }
    }
}
