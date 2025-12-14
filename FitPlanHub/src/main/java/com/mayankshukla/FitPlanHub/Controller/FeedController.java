package com.mayankshukla.FitPlanHub.Controller;


import com.mayankshukla.FitPlanHub.Dto.ErrorResponse;
import com.mayankshukla.FitPlanHub.Dto.FeedResponseDTO;
import com.mayankshukla.FitPlanHub.Service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedController {

    @Autowired
    private FeedService feedService;

    @GetMapping
    public ResponseEntity<?> getPersonalizedFeed(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            FeedResponseDTO feed = feedService.getPersonalizedFeed(userEmail);
            return ResponseEntity.ok(feed);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}