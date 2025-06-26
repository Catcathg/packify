package com.efrei.packify.repository.mysql;

import com.efrei.packify.entity.Commander;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommanderRepository extends JpaRepository<Commander, Long> {
    @Override
    List<Commander> findAll();

    @Override
    Optional<Commander> findById(Long id);

}

