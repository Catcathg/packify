package com.efrei.packify.controller;

import com.efrei.packify.entity.Activities;
import com.efrei.packify.service.ActivitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivitiesController {
    @Autowired
    private ActivitiesService activitiesService;

    @PostMapping("/add")
    public Activities save(@RequestBody Activities activities) {
        return activitiesService.save(activities);
    }

    @GetMapping("/findAll")
    public List<Activities> findAll() {
        return activitiesService.findAll();
    }

}
