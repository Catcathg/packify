package com.efrei.packify.controller;

import com.efrei.packify.entity.Activities;
import com.efrei.packify.service.ActivitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // ✅ Ajout du port 3001
public class ActivitiesController {

    @Autowired
    private ActivitiesService activitiesService;

    @GetMapping("/getAll")
    public ResponseEntity<List<Activities>> getAllActivities() {
        List<Activities> activities = activitiesService.findAllActivities();
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/findById")
    public ResponseEntity<Activities> findById(@RequestParam Long id) {
        Activities activity = activitiesService.findByIdActivities(id);
        if (activity != null) {
            return ResponseEntity.ok(activity);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveActivity(@RequestBody Activities activity) {
        try {
            System.out.println("📥 Données reçues: " + activity.toString()); // ✅ Log pour debug
            Activities savedActivity = activitiesService.save(activity);
            System.out.println("✅ Activité sauvegardée: " + savedActivity.toString());
            return ResponseEntity.ok(savedActivity);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la sauvegarde: " + e.getMessage()); // ✅ Log détaillé
            e.printStackTrace(); // ✅ Stack trace complète
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la création: " + e.getMessage()); // ✅ Message d'erreur détaillé
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateActivity(@RequestBody Activities activity) {
        try {
            System.out.println("📝 Mise à jour de l'activité: " + activity.toString());
            Activities updatedActivity = activitiesService.save(activity);
            System.out.println("✅ Activité mise à jour: " + updatedActivity.toString());
            return ResponseEntity.ok(updatedActivity);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la mise à jour: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteActivity(@RequestParam Long id) {
        try {
            System.out.println("🗑️ Suppression de l'activité ID: " + id);
            activitiesService.deleteByIdActivities(id);
            System.out.println("✅ Activité supprimée avec succès");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la suppression: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateActivity(@PathVariable Long id, @RequestBody Activities activity) {
        try {
            activity.setIdActivities(id); // s'assurer que l'ID est bien défini
            Activities updatedActivity = activitiesService.save(activity);
            return ResponseEntity.ok(updatedActivity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }


}