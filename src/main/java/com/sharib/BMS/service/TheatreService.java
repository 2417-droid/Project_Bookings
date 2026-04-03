package com.sharib.BMS.service;

import com.sharib.BMS.dto.TheatreRequest;
import com.sharib.BMS.entity.City;
import com.sharib.BMS.entity.Theatre;
import com.sharib.BMS.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TheatreService {
    private final TheatreRepository theatreRepository;
    private final CityService cityService;

    public Theatre addTheatre(TheatreRequest theatreRequest){
        City city = cityService.getCityById(theatreRequest.getCityId());
        Theatre theatre = Theatre.builder()
                .name(theatreRequest.getName())
                .address(theatreRequest.getAddress())
                .city(city)
                .build();
        return theatreRepository.save(theatre);
    }
    public List<Theatre> getAllTheatres()
    {
        return theatreRepository.findAll();
    }

    public Theatre getTheatreById(Long id)
    {
        return theatreRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Theatre not found with id: "+id));

    }

    public List<Theatre> getTheatreByCity(Long cityId)
    {
        return theatreRepository.findByCityId(cityId);
    }


}
