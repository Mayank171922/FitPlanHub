package com.mayankshukla.FitPlanHub.Controller;


import com.mayankshukla.FitPlanHub.Dto.*;
import com.mayankshukla.FitPlanHub.Service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainerFollowController {

    @Autowired
    private TrainerService trainerService;

    @PostMapping("/{trainerId}/follow")
    public ResponseEntity<?> followTrainer(
            @PathVariable Long trainerId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            trainerService.followTrainer(trainerId, userEmail);
            return ResponseEntity.ok(new MessageResponse("Trainer followed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{trainerId}/unfollow")
    public ResponseEntity<?> unfollowTrainer(
            @PathVariable Long trainerId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            trainerService.unfollowTrainer(trainerId, userEmail);
            return ResponseEntity.ok(new MessageResponse("Trainer unfollowed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/following")
    public ResponseEntity<?> getFollowedTrainers(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<TrainerDTO> trainers = trainerService.getFollowedTrainers(userEmail);
            return ResponseEntity.ok(trainers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/check/{trainerId}")
    public ResponseEntity<?> checkIfFollowing(
            @PathVariable Long trainerId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            boolean isFollowing = trainerService.isFollowing(trainerId, userEmail);
            return ResponseEntity.ok(new FollowCheckResponse(isFollowing));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<TrainerDTO>> getAllTrainers() {
        List<TrainerDTO> trainers = trainerService.getAllTrainers();
        return ResponseEntity.ok(trainers);
    }

    @GetMapping("/{trainerId}")
    public ResponseEntity<?> getTrainerProfile(@PathVariable Long trainerId) {
        try {
            TrainerProfileDTO profile = trainerService.getTrainerProfile(trainerId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}