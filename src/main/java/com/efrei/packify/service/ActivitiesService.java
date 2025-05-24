package com.efrei.packify.service;

import com.efrei.packify.entity.Activities;
import com.efrei.packify.entity.Utilisateur;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.ActivitiesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ActivitiesService {

    @Autowired
    private ActivitiesRepository activitiesRepository;

    public List<Activities> findAll() {
        return activitiesRepository.findAll();
    }

    public Activities save(Activities activities) {
        return activitiesRepository.save(activities);
    }

}
