package com.efrei.packify.model;

import com.efrei.packify.enums.typeAction;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "utilisateurs-logs")
public class LogMongo {
    @Id
    private String id;

    private Date timestamp;
    private typeAction typeAction;
    private String utilisateurId;
    private String details;


    public LogMongo(Date timestamp, typeAction typeAction, String utilisateurId, String details) {
        this.timestamp = timestamp;
        this.typeAction = typeAction;
        this.utilisateurId = utilisateurId;
        this.details = details;
    }
}