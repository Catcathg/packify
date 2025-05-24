package com.efrei.packify.repository;

import com.efrei.packify.entity.MotCle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MotCleRepository extends JpaRepository<MotCle, Long> {
}
