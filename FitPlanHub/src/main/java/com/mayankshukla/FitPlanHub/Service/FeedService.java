package com.mayankshukla.FitPlanHub.Service;


import com.mayankshukla.FitPlanHub.Dto.FeedItemDTO;
import com.mayankshukla.FitPlanHub.Dto.FeedResponseDTO;
import com.mayankshukla.FitPlanHub.Entity.User;
import com.mayankshukla.FitPlanHub.Repository.FitnessPlanRepository;
import com.mayankshukla.FitPlanHub.Repository.SubscriptionRepository;
import com.mayankshukla.FitPlanHub.Repository.TrainerFollowRepository;
import com.mayankshukla.FitPlanHub.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerFollowRepository followRepository;

    @Autowired
    private FitnessPlanRepository planRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public FeedResponseDTO getPersonalizedFeed(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> followedTrainerIds = followRepository.findByUserId(user.getId())
                .stream()
                .map(follow -> follow.getTrainer().getId())
                .collect(Collectors.toList());

        List<FeedItemDTO> feedItems = planRepository
                .findByTrainerIdIn(followedTrainerIds)
                .stream()
                .map(plan -> {
                    FeedItemDTO item = new FeedItemDTO();
                    item.setPlanId(plan.getId());
                    item.setPlanTitle(plan.getTitle());
                    item.setPlanPrice(plan.getPrice());
                    item.setTrainerId(plan.getTrainer().getId());
                    item.setTrainerName(plan.getTrainer().getFullName());

                    boolean isSubscribed = subscriptionRepository
                            .existsByUserIdAndPlanIdAndIsActive(
                                    user.getId(), plan.getId(), true);
                    item.setSubscribed(isSubscribed);

                    if (isSubscribed) {
                        item.setDescription(plan.getDescription());
                        item.setDuration(plan.getDuration());
                    }

                    return item;
                })
                .collect(Collectors.toList());

        FeedResponseDTO response = new FeedResponseDTO();
        response.setFeedItems(feedItems);
        response.setTotalItems(feedItems.size());

        return response;
    }
}