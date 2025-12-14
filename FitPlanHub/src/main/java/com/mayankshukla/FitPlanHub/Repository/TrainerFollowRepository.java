package com.mayankshukla.FitPlanHub.Repository;


import com.mayankshukla.FitPlanHub.Entity.TrainerFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainerFollowRepository extends JpaRepository<TrainerFollow, Long> {
    List<TrainerFollow> findByUserId(Long userId);
    List<TrainerFollow> findByTrainerId(Long trainerId);
    Optional<TrainerFollow> findByUserIdAndTrainerId(Long userId, Long trainerId);
    boolean existsByUserIdAndTrainerId(Long userId, Long trainerId);
    long countByTrainerId(Long trainerId);
}