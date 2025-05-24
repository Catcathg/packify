package com.efrei.packify.security;

import org.mindrot.jbcrypt.BCrypt;

public class HachageMotdePasse {
    private static final int WORKLOAD = 12;

    public static String hashPassword(String plainTextPassword) {
        String salt = BCrypt.gensalt(WORKLOAD);
        return BCrypt.hashpw(plainTextPassword, salt);
    }

    public static boolean checkPassword(String plainTextPassword, String hashedPassword) {
        if (hashedPassword == null || !hashedPassword.startsWith("$2a$")) {
            throw new IllegalArgumentException("Format de mot de passe haché invalide");
        }
        return BCrypt.checkpw(plainTextPassword, hashedPassword);
    }
}



