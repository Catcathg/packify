package com.efrei.packify;

//import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PackifyApplication {
    public static void main(String[] args) {
        //Dotenv dotenv = Dotenv.load();
        //System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI"));
        //System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));

        SpringApplication.run(PackifyApplication.class, args);
    }
}



