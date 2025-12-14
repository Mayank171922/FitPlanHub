package com.mayankshukla.FitPlanHub.Controller;


import com.mayankshukla.FitPlanHub.Dto.ErrorResponse;
import com.mayankshukla.FitPlanHub.Dto.PlanDetailDTO;
import com.mayankshukla.FitPlanHub.Dto.PlanPreviewDTO;
import com.mayankshukla.FitPlanHub.Service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "http://localhost:3000")
public class PlanController {

    @Autowired
    private PlanService planService;

    @GetMapping("/preview")
    public ResponseEntity<List<PlanPreviewDTO>> getAllPlansPreview() {
        List<PlanPreviewDTO> plans = planService.getAllPlansPreview();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlanDetails(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            PlanDetailDTO plan = planService.getPlanDetails(id, userEmail);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<PlanPreviewDTO>> getPlansByTrainer(
            @PathVariable Long trainerId) {
        List<PlanPreviewDTO> plans = planService.getPlansByTrainer(trainerId);
        return ResponseEntity.ok(plans);
    }
}