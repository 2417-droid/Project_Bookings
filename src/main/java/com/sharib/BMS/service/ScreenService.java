package com.sharib.BMS.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.sharib.BMS.dto.ScreenRequest;
import com.sharib.BMS.entity.Screen;
import com.sharib.BMS.entity.Theatre;
import com.sharib.BMS.repository.ScreenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScreenService {
    private final ScreenRepository screenRepository;
    private final TheatreService theatreService;

    public Screen addScreen(ScreenRequest request){
        Theatre th = theatreService.getTheatreById(request.getTheatreId());
        Screen screen = Screen.builder()
                .name(request.getName())
                .totalSeats(request.getTotalSeats())
                .theatre(th)
                .build();
        return screenRepository.save(screen);
    }
    public List<Screen> getAllScreen()
    {
        return screenRepository.findAll();
    }

    public Screen getScreenById(Long id)
    {
        return screenRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Screen not found with id: "+id));

    }

    public List<Screen> getScreenByTheatre(Long theatreId)
    {
        return screenRepository.findByTheatreId(theatreId);
    }

}
