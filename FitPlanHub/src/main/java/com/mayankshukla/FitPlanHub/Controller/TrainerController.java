package com.mayankshukla.FitPlanHub.Controller;


import com.mayankshukla.FitPlanHub.Dto.*;
import com.mayankshukla.FitPlanHub.Service.PlanService;
import com.mayankshukla.FitPlanHub.Service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainer")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainerController {

    @Autowired
    private PlanService planService;

    @Autowired
    private TrainerService trainerService;

    @PostMapping("/plans")
    public ResponseEntity<?> createPlan(
            @RequestBody CreatePlanRequest request,
            Authentication authentication) {
        try {
            String trainerEmail = authentication.getName();
            PlanDTO plan = planService.createPlan(request, trainerEmail);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<?> updatePlan(
            @PathVariable Long id,
            @RequestBody UpdatePlanRequest request,
            Authentication authentication) {
        try {
            String trainerEmail = authentication.getName();
            PlanDTO plan = planService.updatePlan(id, request, trainerEmail);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<?> deletePlan(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String trainerEmail = authentication.getName();
            planService.deletePlan(id, trainerEmail);
            return ResponseEntity.ok(new MessageResponse("Plan deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/plans")
    public ResponseEntity<?> getMyPlans(Authentication authentication) {
        try {
            String trainerEmail = authentication.getName();
            List<PlanDTO> plans = planService.getTrainerPlans(trainerEmail);
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(Authentication authentication) {
        try {
            String trainerEmail = authentication.getName();
            TrainerStatsDTO stats = trainerService.getTrainerStats(trainerEmail);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}