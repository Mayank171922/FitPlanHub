package com.mayankshukla.FitPlanHub.Controller;


import com.mayankshukla.FitPlanHub.Dto.ErrorResponse;
import com.mayankshukla.FitPlanHub.Dto.MessageResponse;
import com.mayankshukla.FitPlanHub.Dto.SubscriptionCheckResponse;
import com.mayankshukla.FitPlanHub.Dto.SubscriptionDTO;
import com.mayankshukla.FitPlanHub.Service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping("/{planId}")
    public ResponseEntity<?> subscribeToPlan(
            @PathVariable Long planId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            SubscriptionDTO subscription = subscriptionService.subscribe(planId, userEmail);
            return ResponseEntity.ok(subscription);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMySubscriptions(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<SubscriptionDTO> subscriptions =
                    subscriptionService.getUserSubscriptions(userEmail);
            return ResponseEntity.ok(subscriptions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/check/{planId}")
    public ResponseEntity<?> checkSubscription(
            @PathVariable Long planId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            boolean isSubscribed = subscriptionService.isUserSubscribed(planId, userEmail);
            return ResponseEntity.ok(new SubscriptionCheckResponse(isSubscribed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{subscriptionId}")
    public ResponseEntity<?> cancelSubscription(
            @PathVariable Long subscriptionId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            subscriptionService.cancelSubscription(subscriptionId, userEmail);
            return ResponseEntity.ok(new MessageResponse("Subscription cancelled"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}