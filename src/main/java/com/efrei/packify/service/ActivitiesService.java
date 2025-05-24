package com.efrei.packify.service;

import com.efrei.packify.entity.Activities;
import com.efrei.packify.enums.typeAction;
import com.efrei.packify.model.LogMongo;
import com.efrei.packify.repository.ActivitiesRepository;
import com.efrei.packify.repository.LogMongoRepository;
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

    public Activities save(Activities activities) {
        boolean isUpdate = activities.getIdActivities() != null &&
                activitiesRepository.existsById(activities.getIdActivities());

        Activities savedActivity = activitiesRepository.save(activities);

        Date currentDate = new Date();
        LogMongo log = new LogMongo(
                currentDate,
                isUpdate ? typeAction.UPDATE_ACTIVITY : typeAction.CREATE_ACTIVITY,
                savedActivity.getIdActivities().toString(),
                (isUpdate ? "Activité mise à jour: " : "Activité créée: ") +
                        savedActivity.getNom() + " à " + savedActivity.getVille()
        );

        logMongoRepository.save(log);

        return savedActivity;
    }

    public void deleteByIdActivities(Long id) {
        Optional<Activities> activityOpt = activitiesRepository.findById(id);
        activitiesRepository.deleteById(id);

        Date currentDate = new Date();
        String activityInfo = activityOpt.map(activity ->
                        activity.getNom() + " à " + activity.getVille())
                .orElse("ID " + id);

        LogMongo log = new LogMongo(
                currentDate,
                typeAction.DELETE_ACTIVITY,
                id.toString(),
                "Activité supprimée: " + activityInfo
        );

        logMongoRepository.save(log);
    }

    public Activities findByIdActivities(Long id) {
        Optional<Activities> activities = activitiesRepository.findById(id);
        return activities.orElse(null);
    }

    public List<Activities> findByNomActivities(String nom) {
        return activitiesRepository.findByNom(nom);
    }

    public List<Activities> findByVilleActivities(String ville) {
        return activitiesRepository.findByVille(ville);
    }

}