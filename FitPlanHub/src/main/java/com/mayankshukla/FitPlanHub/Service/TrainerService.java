package com.mayankshukla.FitPlanHub.Service;


import com.mayankshukla.FitPlanHub.Dto.TrainerDTO;
import com.mayankshukla.FitPlanHub.Dto.TrainerProfileDTO;
import com.mayankshukla.FitPlanHub.Dto.TrainerStatsDTO;
import com.mayankshukla.FitPlanHub.Entity.Role;
import com.mayankshukla.FitPlanHub.Entity.TrainerFollow;
import com.mayankshukla.FitPlanHub.Entity.User;
import com.mayankshukla.FitPlanHub.Repository.FitnessPlanRepository;
import com.mayankshukla.FitPlanHub.Repository.SubscriptionRepository;
import com.mayankshukla.FitPlanHub.Repository.TrainerFollowRepository;
import com.mayankshukla.FitPlanHub.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainerService {

    @Autowired
    private TrainerFollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FitnessPlanRepository planRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public void followTrainer(Long trainerId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        if (trainer.getRole() != Role.TRAINER) {
            throw new RuntimeException("User is not a trainer");
        }

        if (followRepository.existsByUserIdAndTrainerId(user.getId(), trainerId)) {
            throw new RuntimeException("Already following this trainer");
        }

        TrainerFollow follow = new TrainerFollow();
        follow.setUser(user);
        follow.setTrainer(trainer);
        follow.setFollowedAt(LocalDateTime.now());

        followRepository.save(follow);
    }

    public void unfollowTrainer(Long trainerId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrainerFollow follow = followRepository
                .findByUserIdAndTrainerId(user.getId(), trainerId)
                .orElseThrow(() -> new RuntimeException("Not following this trainer"));

        followRepository.delete(follow);
    }

    public List<TrainerDTO> getFollowedTrainers(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return followRepository.findByUserId(user.getId()).stream()
                .map(follow -> convertToTrainerDTO(follow.getTrainer()))
                .collect(Collectors.toList());
    }

    public boolean isFollowing(Long trainerId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return followRepository.existsByUserIdAndTrainerId(user.getId(), trainerId);
    }

    public List<TrainerDTO> getAllTrainers() {
        return userRepository.findByRole(Role.TRAINER).stream()
                .map(this::convertToTrainerDTO)
                .collect(Collectors.toList());
    }

    public TrainerProfileDTO getTrainerProfile(Long trainerId) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        if (trainer.getRole() != Role.TRAINER) {
            throw new RuntimeException("User is not a trainer");
        }

        TrainerProfileDTO profile = new TrainerProfileDTO();
        profile.setId(trainer.getId());
        profile.setFullName(trainer.getFullName());
        profile.setEmail(trainer.getEmail());

        long planCount = planRepository.countByTrainerId(trainerId);
        long followerCount = followRepository.countByTrainerId(trainerId);

        profile.setTotalPlans(planCount);
        profile.setFollowers(followerCount);

        return profile;
    }

    public TrainerStatsDTO getTrainerStats(String trainerEmail) {
        User trainer = userRepository.findByEmail(trainerEmail)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        TrainerStatsDTO stats = new TrainerStatsDTO();
        stats.setTotalPlans(planRepository.countByTrainerId(trainer.getId()));
        stats.setTotalFollowers(followRepository.countByTrainerId(trainer.getId()));

        long totalSubscriptions = planRepository.findByTrainerId(trainer.getId())
                .stream()
                .mapToLong(plan -> subscriptionRepository
                        .countByPlanIdAndIsActive(plan.getId(), true))
                .sum();

        stats.setTotalSubscriptions(totalSubscriptions);

        return stats;
    }

    private TrainerDTO convertToTrainerDTO(User trainer) {
        TrainerDTO dto = new TrainerDTO();
        dto.setId(trainer.getId());
        dto.setFullName(trainer.getFullName());
        dto.setEmail(trainer.getEmail());
        return dto;
    }
}