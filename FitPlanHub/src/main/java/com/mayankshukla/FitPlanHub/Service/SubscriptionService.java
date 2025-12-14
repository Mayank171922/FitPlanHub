package com.mayankshukla.FitPlanHub.Service;


import com.mayankshukla.FitPlanHub.Dto.SubscriptionDTO;
import com.mayankshukla.FitPlanHub.Entity.FitnessPlan;
import com.mayankshukla.FitPlanHub.Entity.Subscription;
import com.mayankshukla.FitPlanHub.Entity.User;
import com.mayankshukla.FitPlanHub.Repository.FitnessPlanRepository;
import com.mayankshukla.FitPlanHub.Repository.SubscriptionRepository;
import com.mayankshukla.FitPlanHub.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FitnessPlanRepository planRepository;

    public SubscriptionDTO subscribe(Long planId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FitnessPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        if (subscriptionRepository.existsByUserIdAndPlanIdAndIsActive(
                user.getId(), planId, true)) {
            throw new RuntimeException("Already subscribed to this plan");
        }

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setPurchaseDate(LocalDateTime.now());
        subscription.setExpiryDate(LocalDateTime.now().plusDays(plan.getDuration()));
        subscription.setActive(true);

        Subscription saved = subscriptionRepository.save(subscription);
        return convertToDTO(saved);
    }

    public List<SubscriptionDTO> getUserSubscriptions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subscriptionRepository.findByUserId(user.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean isUserSubscribed(Long planId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subscriptionRepository.existsByUserIdAndPlanIdAndIsActive(
                user.getId(), planId, true);
    }

    public void cancelSubscription(Long subscriptionId, String userEmail) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!subscription.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        subscription.setActive(false);
        subscriptionRepository.save(subscription);
    }

    private SubscriptionDTO convertToDTO(Subscription subscription) {
        SubscriptionDTO dto = new SubscriptionDTO();
        dto.setId(subscription.getId());
        dto.setUserId(subscription.getUser().getId());
        dto.setPlanId(subscription.getPlan().getId());
        dto.setPlanTitle(subscription.getPlan().getTitle());
        dto.setTrainerName(subscription.getPlan().getTrainer().getFullName());
        dto.setPurchaseDate(subscription.getPurchaseDate());
        dto.setExpiryDate(subscription.getExpiryDate());
        dto.setActive(subscription.isActive());
        return dto;
    }
}