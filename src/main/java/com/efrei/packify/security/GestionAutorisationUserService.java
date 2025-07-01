package com.efrei.packify.security;

import com.efrei.packify.entity.Utilisateur;
import com.efrei.packify.repository.mysql.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class GestionAutorisationUserService implements UserDetailsService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);
        Utilisateur utilisateur = utilisateurOpt.orElseThrow(() -> 
            new UsernameNotFoundException("Utilisateur non trouvé : " + email));

        String roleName = (utilisateur.getRole() == 0) ? "ADMIN" : "USER";

        return User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMdp())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleName)))
                .build();
    }
}
