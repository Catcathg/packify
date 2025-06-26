package com.efrei.packify.repository.mysql;

import com.efrei.packify.entity.Activities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivitiesRepository extends JpaRepository<Activities, Long> {
    List<Activities> findAll();
}
