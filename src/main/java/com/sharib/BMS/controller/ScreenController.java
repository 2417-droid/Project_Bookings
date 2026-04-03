package com.sharib.BMS.controller;


import com.sharib.BMS.dto.ScreenRequest;
import com.sharib.BMS.dto.ShowRequest;
import com.sharib.BMS.entity.Screen;
import com.sharib.BMS.entity.Show;
import com.sharib.BMS.service.ScreenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/screens")
@RequiredArgsConstructor
public class ScreenController {
   private final ScreenService screenService;
    @PostMapping("/addScreen")
    public ResponseEntity<Screen> addScreen(@RequestBody ScreenRequest screenRequest){
        return  ResponseEntity.ok(screenService.addScreen(screenRequest));
    }
    @GetMapping
    public ResponseEntity<List<Screen>> getAllScreens()
    {
        return ResponseEntity.ok(screenService.getAllScreen());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Screen> getScreenById(@PathVariable Long id)
    {
        return ResponseEntity.ok(screenService.getScreenById(id));
    }

    @GetMapping("/theatre/{theatreId}")
    public ResponseEntity<List<Screen>>  getScreenByTheatreId(@PathVariable Long theatreId)
    {
        return ResponseEntity.ok(screenService.getScreenByTheatre(theatreId));
    }
}
