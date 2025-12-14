package com.mayankshukla.FitPlanHub.Repository;


import com.mayankshukla.FitPlanHub.Entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
    List<Subscription> findByPlanId(Long planId);
    boolean existsByUserIdAndPlanIdAndIsActive(Long userId, Long planId, boolean isActive);
    long countByPlanIdAndIsActive(Long planId, boolean isActive);
}