package com.sharib.BMS.service;

import com.sharib.BMS.dto.BookingRequest;
import com.sharib.BMS.entity.Booking;
import com.sharib.BMS.entity.Seat;
import com.sharib.BMS.entity.Show;
import com.sharib.BMS.entity.User;
import com.sharib.BMS.enums.BookingStatus;
import com.sharib.BMS.repository.BookingRepository;
import com.sharib.BMS.repository.SeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final UserService userService;
    private final ShowService showService;
    @Transactional
    public Booking createBooking(BookingRequest request)
    {
        User user=userService.getUserById(request.getUserId());
        Show show=showService.getShowById(request.getShowId());

        //check if any of the requested seat are already booked
        List<Long> alreadyBookedSeats=bookingRepository.findBookedSeatIdsByShowId(show.getId());
        for(Long seatId:request.getSeatIds())
        {
            if(alreadyBookedSeats.contains(seatId))
            {
                throw new RuntimeException("Seat with id "+seatId+" is already Booked");
            }
        }

        List<Seat> seats=seatRepository.findAllById(request.getSeatIds());
        if(seats.size()!=request.getSeatIds().size())
        {
            throw new RuntimeException("Some Seats Are Invalid");
        }

        double totalPrice=seats.size()*show.getTicketPrice();
        Booking booking=Booking.builder()
                .user(user)
                .show(show)
                .seats(seats)
                .totalPrice(totalPrice)
                .status(BookingStatus.CONFIRMED)
                .build();

        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id)
    {
        return bookingRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Booking not found with id: "+id));

    }

    public List<Booking> getBookingByUser(Long userId)
    {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional
    public Booking cancelbooking(Long bookingid)
    {
        Booking booking=getBookingById(bookingid);
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public List<Seat> getAvailableSeats(Long showId)
    {
        Show show=showService.getShowById(showId);
        List<Seat> allSeats=seatRepository.findByScreenId(show.getScreen().getId());
        List<Long> bookingSeatIds=bookingRepository.findBookedSeatIdsByShowId(showId);
        return allSeats.stream()
                .filter(seat -> !bookingSeatIds.contains(seat.getId()))
                .toList();
    }

}
