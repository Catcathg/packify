package com.efrei.packify.repository;

import com.efrei.packify.entity.Activities;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivitiesRepository extends JpaRepository<Activities, Long> {
    @Override
    List<Activities> findAll();


}
