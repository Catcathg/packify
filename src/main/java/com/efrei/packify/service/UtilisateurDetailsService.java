package com.efrei.packify.service;

import com.efrei.packify.entity.Utilisateur;
import com.efrei.packify.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurDetailsService implements UserDetailsService{

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Récupérer l'utilisateur par email puisque vous n'avez pas de username
        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);

        if (!utilisateurOpt.isPresent()) {
            throw new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + email);
        }

        Utilisateur utilisateur = utilisateurOpt.get();

        // Créer la liste d'autorités en fonction du rôle
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        // Ajouter le rôle de base pour tous les utilisateurs
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        // Ajouter le rôle d'administrateur si applicable
        if ("2".equals(utilisateur.getRole())) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        // Créer et retourner l'objet UserDetails
        return new User(
                utilisateur.getEmail(),  // Utiliser l'email comme identifiant
                utilisateur.getMdp(),    // Utiliser le mot de passe
                authorities
        );


    }
}