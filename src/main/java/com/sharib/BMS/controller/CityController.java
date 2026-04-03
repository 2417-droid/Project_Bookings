package com.sharib.BMS.controller;


import com.sharib.BMS.entity.City;
import com.sharib.BMS.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {
    private final CityService cityService;
    @GetMapping
    public ResponseEntity<List<City>> getAllCities()
    {
        return ResponseEntity.ok(cityService.getAllCities());
    }

    @GetMapping("{id}")
    public ResponseEntity<City> getAllCities(@PathVariable Long id)
    {
        return ResponseEntity.ok(cityService.getCityById(id));
    }
}
