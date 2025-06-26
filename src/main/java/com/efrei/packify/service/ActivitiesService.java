package com.efrei.packify.service;

import com.efrei.packify.entity.Activities;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.mysql.ActivitiesRepository;
import com.efrei.packify.repository.mongo.LogMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ActivitiesService {

    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Autowired
    private LogMongoRepository logMongoRepository;

    public List<Activities> findAllActivities() {
        return activitiesRepository.findAll();
    }

    public Activities findByIdActivities(Long id) {
        return activitiesRepository.findById(id).orElse(null);
    }

    public Activities save(Activities activities) {
        boolean isUpdate = activities.getIdActivities() != null &&
                activitiesRepository.existsById(activities.getIdActivities());

        Activities savedActivity = activitiesRepository.save(activities);

        LogMongo log = new LogMongo(
                new Date(),
                isUpdate ? typeAction.UPDATE_ACTIVITY : typeAction.CREATE_ACTIVITY,
                savedActivity.getIdActivities().toString(),
                (isUpdate ? "Activité mise à jour: " : "Activité créée: ") + savedActivity.getNom()
        );
        logMongoRepository.save(log);

        return savedActivity;
    }

    public void deleteByIdActivities(Long id) {
        Optional<Activities> activityOpt = activitiesRepository.findById(id);
        activitiesRepository.deleteById(id);

        String activityName = activityOpt.map(Activities::getNom).orElse("ID " + id);
        LogMongo log = new LogMongo(
                new Date(),
                typeAction.DELETE_ACTIVITY,
                id.toString(),
                "Activité supprimée: " + activityName
        );
        logMongoRepository.save(log);
    }
}