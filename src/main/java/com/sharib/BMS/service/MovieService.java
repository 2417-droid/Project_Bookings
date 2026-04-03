package com.sharib.BMS.service;

import com.sharib.BMS.entity.Movie;
import com.sharib.BMS.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;

    public Movie addMovie(Movie movie)
    {
        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies()
    {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id)
    {
        return movieRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Movie not found with id: "+id));

    }

    public List<Movie> searchByTitle(String title){
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Movie> getByGenre(String genre){
        return movieRepository.findByGenre(genre);
    }

    public List<Movie> getByLanguage(String language){
        return movieRepository.findByLanguage(language);
    }
    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Movie not found with id: " + id);
        }
        movieRepository.deleteById(id);
    }
    public Movie updateMovie(Long id, Movie movieDetails) {
        Movie existingMovie = getMovieById(id);

        // Update fields (assuming these fields exist in your Movie entity)
        existingMovie.setTitle(movieDetails.getTitle());
        existingMovie.setGenre(movieDetails.getGenre());
        existingMovie.setLanguage(movieDetails.getLanguage());
        existingMovie.setReleaseDate(movieDetails.getReleaseDate());

        return movieRepository.save(existingMovie);
    }
    //update movie
    //delete movie


}
