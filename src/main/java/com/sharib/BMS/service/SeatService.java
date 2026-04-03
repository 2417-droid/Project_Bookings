package com.sharib.BMS.service;


import com.sharib.BMS.dto.SeatRequest;
import com.sharib.BMS.entity.Screen;
import com.sharib.BMS.entity.Seat;
import com.sharib.BMS.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class SeatService {
    private final SeatRepository seatRepository;
    private final ScreenService screenService;
    public Seat addSeat(SeatRequest seatRequest){
        Screen screen = screenService.getScreenById(seatRequest.getScreenId());
        Seat seat = Seat.builder()
                .screen(screen)
                .seatType(seatRequest.getSeatType())
                .row(seatRequest.getRow())
                .col(seatRequest.getCol())
                .SeatNumber(seatRequest.getSeatNumber())
                .build();
        return seatRepository.save(seat);
    }
    public List<Seat> getSeatsByScreen(Long screenId)
    {
        return seatRepository.findByScreenId(screenId);
    }

    public Seat getSeatById(Long id)
    {
        return seatRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Seat not found with id: "+id));

    }
}
