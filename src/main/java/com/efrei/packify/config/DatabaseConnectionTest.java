package com.efrei.packify.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;


import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.Set;

@Component
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource; // MySQL

    @Autowired(required = false)
    private MongoTemplate mongoTemplate; // MongoDB

    @PostConstruct
    public void testConnections() {
        System.out.println("🔍 Test des connexions de base de données...");

        // Test MySQL
        testMySQLConnection();

        // Test MongoDB
        testMongoDBConnection();
    }

    private void testMySQLConnection() {
        try {
            System.out.println("\n📊 Test MySQL...");
            Connection connection = dataSource.getConnection();
            DatabaseMetaData metaData = connection.getMetaData();

            System.out.println("✅ MySQL connecté !");
            System.out.println("   URL: " + metaData.getURL());
            System.out.println("   Version: " + metaData.getDatabaseProductVersion());

            connection.close();
        } catch (Exception e) {
            System.err.println("❌ Erreur MySQL: " + e.getMessage());
        }
    }

    private void testMongoDBConnection() {
        try {
            if (mongoTemplate == null) {
                System.out.println("⚠️  MongoTemplate non disponible");
                return;
            }

            System.out.println("\n🍃 Test MongoDB...");

            // Test simple
            mongoTemplate.getCollection("test").countDocuments();

            System.out.println("✅ MongoDB connecté !");

            // Collections disponibles
            Set<String> collections = mongoTemplate.getCollectionNames();
            System.out.println("   Collections: " + collections);

        } catch (Exception e) {
            System.err.println("❌ Erreur MongoDB: " + e.getMessage());
            e.printStackTrace();
        }
    }
}