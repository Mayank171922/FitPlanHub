package com.mayankshukla.FitPlanHub.Service;


import com.mayankshukla.FitPlanHub.Dto.*;
import com.mayankshukla.FitPlanHub.Entity.FitnessPlan;
import com.mayankshukla.FitPlanHub.Entity.Role;
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
public class PlanService {

    @Autowired
    private FitnessPlanRepository planRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public List<PlanPreviewDTO> getAllPlansPreview() {
        return planRepository.findAll().stream()
                .map(this::convertToPreviewDTO)
                .collect(Collectors.toList());
    }

    public PlanDetailDTO getPlanDetails(Long planId, String userEmail) {
        FitnessPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isSubscribed = subscriptionRepository
                .existsByUserIdAndPlanIdAndIsActive(user.getId(), planId, true);

        PlanDetailDTO dto = new PlanDetailDTO();
        dto.setId(plan.getId());
        dto.setTitle(plan.getTitle());
        dto.setPrice(plan.getPrice());
        dto.setTrainerName(plan.getTrainer().getFullName());
        dto.setTrainerId(plan.getTrainer().getId());
        dto.setSubscribed(isSubscribed);

        if (isSubscribed) {
            dto.setDescription(plan.getDescription());
            dto.setDuration(plan.getDuration());
        }

        return dto;
    }

    public PlanDTO createPlan(CreatePlanRequest request, String trainerEmail) {
        User trainer = userRepository.findByEmail(trainerEmail)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        if (trainer.getRole() != Role.TRAINER) {
            throw new RuntimeException("Only trainers can create plans");
        }

        FitnessPlan plan = new FitnessPlan();
        plan.setTitle(request.getTitle());
        plan.setDescription(request.getDescription());
        plan.setPrice(request.getPrice());
        plan.setDuration(request.getDuration());
        plan.setTrainer(trainer);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());

        FitnessPlan savedPlan = planRepository.save(plan);
        return convertToFullDTO(savedPlan);
    }

    public PlanDTO updatePlan(Long planId, UpdatePlanRequest request, String trainerEmail) {
        FitnessPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        User trainer = userRepository.findByEmail(trainerEmail)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        if (!plan.getTrainer().getId().equals(trainer.getId())) {
            throw new RuntimeException("You can only update your own plans");
        }

        plan.setTitle(request.getTitle());
        plan.setDescription(request.getDescription());
        plan.setPrice(request.getPrice());
        plan.setDuration(request.getDuration());
        plan.setUpdatedAt(LocalDateTime.now());

        FitnessPlan updatedPlan = planRepository.save(plan);
        return convertToFullDTO(updatedPlan);
    }

    public void deletePlan(Long planId, String trainerEmail) {
        FitnessPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        User trainer = userRepository.findByEmail(trainerEmail)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        if (!plan.getTrainer().getId().equals(trainer.getId())) {
            throw new RuntimeException("You can only delete your own plans");
        }

        planRepository.delete(plan);
    }

    public List<PlanDTO> getTrainerPlans(String trainerEmail) {
        User trainer = userRepository.findByEmail(trainerEmail)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        return planRepository.findByTrainerId(trainer.getId()).stream()
                .map(this::convertToFullDTO)
                .collect(Collectors.toList());
    }

    public List<PlanPreviewDTO> getPlansByTrainer(Long trainerId) {
        return planRepository.findByTrainerId(trainerId).stream()
                .map(this::convertToPreviewDTO)
                .collect(Collectors.toList());
    }

    private PlanPreviewDTO convertToPreviewDTO(FitnessPlan plan) {
        PlanPreviewDTO dto = new PlanPreviewDTO();
        dto.setId(plan.getId());
        dto.setTitle(plan.getTitle());
        dto.setPrice(plan.getPrice());
        dto.setTrainerName(plan.getTrainer().getFullName());
        dto.setTrainerId(plan.getTrainer().getId());
        return dto;
    }

    private PlanDTO convertToFullDTO(FitnessPlan plan) {
        PlanDTO dto = new PlanDTO();
        dto.setId(plan.getId());
        dto.setTitle(plan.getTitle());
        dto.setDescription(plan.getDescription());
        dto.setPrice(plan.getPrice());
        dto.setDuration(plan.getDuration());
        dto.setTrainerId(plan.getTrainer().getId());
        dto.setTrainerName(plan.getTrainer().getFullName());
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());
        return dto;
    }
}