package com.sharib.BMS.controller;


import com.sharib.BMS.dto.TheatreRequest;
import com.sharib.BMS.entity.Theatre;
import com.sharib.BMS.service.TheatreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/theatres")
public class TheatreController {
    private final TheatreService theatreService;
    @PostMapping("/addTheatre")
    public ResponseEntity<Theatre> addTheatre(@RequestBody TheatreRequest theatreRequest){
        return  ResponseEntity.ok(theatreService.addTheatre(theatreRequest));
    }
    @GetMapping
    public ResponseEntity<List<Theatre>> getAllTheatres()
    {
        return ResponseEntity.ok(theatreService.getAllTheatres());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Theatre> getTheatreById(@PathVariable Long id)
    {
        return ResponseEntity.ok(theatreService.getTheatreById(id));
    }

    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<Theatre>> getTheatreByCity(@PathVariable Long cityId)
    {
        return ResponseEntity.ok(theatreService.getTheatreByCity(cityId));
    }
}
