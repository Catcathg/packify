package com.efrei.packify.service;

import com.efrei.packify.model.DrinkMongo;
import com.efrei.packify.repository.mongo.DrinkMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DrinkService {

    @Autowired
    private DrinkMongoRepository drinkMongoRepository;

    public DrinkMongo addDrink(DrinkMongo drink) {
        return drinkMongoRepository.save(drink);
    }

    public List<DrinkMongo> getAllDrinks() {
        return drinkMongoRepository.findAll();
    }

    public DrinkMongo getDrinkById(String id) {
        return drinkMongoRepository.findById(id).orElse(null);
    }

    public DrinkMongo updateDrink(String id, DrinkMongo newDrink) {
        return drinkMongoRepository.findById(id)
                .map(drink -> {
                    drink.setBrand(newDrink.getBrand());
                    drink.setPrice(newDrink.getPrice());
                    drink.setImage(newDrink.getImage());
                    return drinkMongoRepository.save(drink);
                })
                .orElse(null);
    }

    public boolean deleteDrink(String id) {
        if (drinkMongoRepository.existsById(id)) {
            drinkMongoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
