package com.efrei.packify.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/v1/typePacks/**").permitAll()
                        .requestMatchers("/api/v1/activities/**").permitAll()
                        .requestMatchers("/api/v1/motcle/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/utilisateurs/getAll").permitAll()
                        .requestMatchers("/api/v1/utilisateurs/findById").permitAll()
                        .requestMatchers("/api/v1/utilisateurs/update").permitAll()
                        .requestMatchers("/api/v1/utilisateurs/delete").permitAll()
                        .requestMatchers("/api/v1/utilisateurs/add").permitAll()
                        .requestMatchers("/api/v1/utilisateurs/create").permitAll()
                        .requestMatchers("api/v1/commandes/getAll").permitAll()
                        .requestMatchers("api/v1/activities/getAll").permitAll()
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/v1/utilisateurs/initAdmin").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}