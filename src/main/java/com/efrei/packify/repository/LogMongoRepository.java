package com.efrei.packify.repository;

import com.efrei.packify.model.LogMongo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LogMongoRepository extends MongoRepository<LogMongo, String> {
}
