package com.efrei.packify.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenConfig jwtTokenConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");

        String email = null;  // Changé username en email pour correspondre à votre modèle
        String token = null;

        // Token JWT commence par "Bearer "
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            token = requestTokenHeader.substring(7);
            try {
                // Récupérer l'email depuis le token
                email = jwtTokenConfig.getUsernameFromToken(token);  // Cette méthode retourne en fait l'email
            } catch (IllegalArgumentException e) {
                logger.warn("Impossible de récupérer le token JWT");
            } catch (ExpiredJwtException e) {
                logger.warn("Token JWT expiré");
            } catch (SignatureException | MalformedJwtException | UnsupportedJwtException e) {
                logger.warn("Token JWT invalide");
            }
        } else {
            logger.warn("Le token JWT ne commence pas par Bearer");
        }

        // Une fois que nous avons le token, validons-le
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

            // Si le token est valide, configurez Spring Security
            if (jwtTokenConfig.validateToken(token, userDetails.getUsername())) {  // userDetails.getUsername() retourne l'email
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        chain.doFilter(request, response);
    }
}