package com.sharib.BMS.service;

import com.sharib.BMS.dto.ScreenRequest;
import com.sharib.BMS.dto.ShowRequest;
import com.sharib.BMS.entity.Movie;
import com.sharib.BMS.entity.Screen;
import com.sharib.BMS.entity.Show;
import com.sharib.BMS.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowService {
    private final ShowRepository showRepository;
    private final MovieService movieService;
    private final ScreenService screenService;
    public Show addShow(ShowRequest Request){
        Movie movie = movieService.getMovieById(Request.getMovieId());
        Screen screen = screenService.getScreenById(Request.getScreenId());
        Show show = Show.builder()
                .movie(movie)
                .screen(screen)
                .ticketPrice(Request.getTicketPrice())
                .showDate(Request.getShowDate())
                .endTime(Request.getEndTime())
                .startTime(Request.getStartTime())
                .build();
        return showRepository.save(show);
    }
    public List<Show> getAllShow()
    {
        return showRepository.findAll();
    }
    public Show getShowById(Long id)
    {
        return showRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Show not found with id: "+id));

    }

    public List<Show> getShowByMovie(Long movieId)
    {
        return showRepository.findByMovieId(movieId);
    }

    public List<Show> getShowByMovieAndDate(Long movieId, LocalDate date)
    {
        return showRepository.findByMovieIdAndShowDate(movieId,date);
    }
   public List<Show> getShowByScree(Long ScreenId){
        return showRepository.findByScreenId(ScreenId);
   }
}
