package com.sharib.BMS.controller;


import com.sharib.BMS.dto.SeatRequest;
import com.sharib.BMS.dto.ShowRequest;
import com.sharib.BMS.entity.Seat;
import com.sharib.BMS.entity.Show;
import com.sharib.BMS.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {
    private final SeatService seatService;
    @PostMapping("/addSeat")
    public ResponseEntity<Seat> addShow(@RequestBody SeatRequest seatRequest){
        return  ResponseEntity.ok(seatService.addSeat(seatRequest));
    }
    @GetMapping("/screen/{screenId}")
    public ResponseEntity<List<Seat>> getSeatByScreen(@PathVariable Long screenId)
    {
        return ResponseEntity.ok(seatService.getSeatsByScreen(screenId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Seat> getSeatById(@PathVariable Long id)
    {
        return ResponseEntity.ok(seatService.getSeatById(id));
    }
}
