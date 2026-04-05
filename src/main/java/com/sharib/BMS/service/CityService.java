package com.sharib.BMS.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sharib.BMS.entity.City;
import com.sharib.BMS.repository.CityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CityService {
    private final CityRepository cityRepository;

    public City addCity(City city)
    {
        return cityRepository.save(city);
    }

    public List<City> getAllCities()
    {
        return cityRepository.findAll();
    }

    public City getCityById(Long id)
    {
        return cityRepository.findById(id)
                .orElseThrow(()->new RuntimeException("City not found with id: "+id));
    }
}
