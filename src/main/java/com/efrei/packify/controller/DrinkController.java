package com.efrei.packify.controller;

import com.efrei.packify.model.DrinkMongo;
import com.efrei.packify.service.DrinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/drinks")
public class DrinkController {

    @Autowired
    private DrinkService drinkService;

    @GetMapping
    public List<DrinkMongo> getAllDrinks() {
        return drinkService.getAllDrinks();
    }

    @PostMapping
    public DrinkMongo addDrink(@RequestBody DrinkMongo drink) {
        return drinkService.addDrink(drink);
    }

    @GetMapping("/{id}")
    public DrinkMongo getDrinkById(@PathVariable String id) {
        return drinkService.getDrinkById(id);
    }

    @PutMapping("/{id}")
    public DrinkMongo updateDrink(@PathVariable String id, @RequestBody DrinkMongo drink) {
        return drinkService.updateDrink(id, drink);
    }

    @DeleteMapping("/{id}")
    public boolean deleteDrink(@PathVariable String id) {
        return drinkService.deleteDrink(id);
    }
}
