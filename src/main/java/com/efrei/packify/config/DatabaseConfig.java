package com.efrei.packify.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.efrei.packify.repository.mysql",
        entityManagerFactoryRef = "entityManagerFactory"
)
@EnableMongoRepositories(
        basePackages = "com.efrei.packify.repository.mongo"
)
@EntityScan("com.efrei.packify.entity")
public class DatabaseConfig {
}