package com.mayankshukla.FitPlanHub.Repository;


import com.mayankshukla.FitPlanHub.Entity.FitnessPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FitnessPlanRepository extends JpaRepository<FitnessPlan, Long> {
    List<FitnessPlan> findByTrainerId(Long trainerId);
    List<FitnessPlan> findByTrainerIdIn(List<Long> trainerIds);
    long countByTrainerId(Long trainerId);
}