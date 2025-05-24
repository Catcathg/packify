package com.efrei.packify.repository;

import com.efrei.packify.entity.TypePack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypePackRepository extends JpaRepository<TypePack, Long> {

}
