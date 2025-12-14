package com.mayankshukla.FitPlanHub.Dto;

import java.util.List;

public class FeedResponseDTO {
    private List<FeedItemDTO> feedItems;
    private int totalItems;

    public FeedResponseDTO() {}

    public List<FeedItemDTO> getFeedItems() {
        return feedItems;
    }

    public void setFeedItems(List<FeedItemDTO> feedItems) {
        this.feedItems = feedItems;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }
}