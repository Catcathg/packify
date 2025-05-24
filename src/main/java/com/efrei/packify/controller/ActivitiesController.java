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
    public ResponseEntity<Activities> saveActivity(@RequestBody Activities activity) {
        try {
            Activities savedActivity = activitiesService.save(activity);
            return ResponseEntity.ok(savedActivity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Activities> updateActivity(@RequestBody Activities activity) {
        try {
            Activities updatedActivity = activitiesService.save(activity);
            return ResponseEntity.ok(updatedActivity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteActivity(@RequestParam Long id) {
        try {
            activitiesService.deleteByIdActivities(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}