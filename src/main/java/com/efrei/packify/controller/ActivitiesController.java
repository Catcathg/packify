package com.efrei.packify.controller;

import com.efrei.packify.entity.Activities;
import com.efrei.packify.service.ActivitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivitiesController {

    @Autowired
    private ActivitiesService activitiesService;

    @PostMapping("/add")
    public ResponseEntity<Activities> save(@RequestBody Activities activities) {
        Activities savedActivity = activitiesService.save(activities);
        return ResponseEntity.ok(savedActivity);
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<Activities>> findAllActivities() {
        List<Activities> activities = activitiesService.findAllActivities();
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/findById")
    public ResponseEntity<Activities> findByIdActivities(@RequestParam Long id) {
        Activities activity = activitiesService.findByIdActivities(id);
        if (activity != null) {
            return ResponseEntity.ok(activity);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/deleteById")
    public ResponseEntity<Void> deleteById(@RequestParam Long id) {
        activitiesService.deleteByIdActivities(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/findByNom")
    public ResponseEntity<List<Activities>> findByNom(@RequestParam String nom) {
        List<Activities> activities = activitiesService.findByNomActivities(nom);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/findByVille")
    public ResponseEntity<List<Activities>> findByVille(@RequestParam String ville) {
        List<Activities> activities = activitiesService.findByVilleActivities(ville);
        return ResponseEntity.ok(activities);
    }

}