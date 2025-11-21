package com.efrei.packify.repository.mongo;

import com.efrei.packify.model.DrinkMongo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DrinkMongoRepository extends MongoRepository<DrinkMongo, String> {

    @Override
    List<DrinkMongo> findAll();
}
