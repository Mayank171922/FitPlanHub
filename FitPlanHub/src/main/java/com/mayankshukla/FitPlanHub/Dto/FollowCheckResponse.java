package com.mayankshukla.FitPlanHub.Dto;

public class FollowCheckResponse {
    private boolean isFollowing;

    public FollowCheckResponse() {}

    public FollowCheckResponse(boolean isFollowing) {
        this.isFollowing = isFollowing;
    }

    public boolean isFollowing() {
        return isFollowing;
    }

    public void setFollowing(boolean following) {
        isFollowing = following;
    }
}