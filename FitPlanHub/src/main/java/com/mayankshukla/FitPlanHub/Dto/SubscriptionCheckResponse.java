package com.mayankshukla.FitPlanHub.Dto;

public class SubscriptionCheckResponse {
    private boolean isSubscribed;

    public SubscriptionCheckResponse() {}

    public SubscriptionCheckResponse(boolean isSubscribed) {
        this.isSubscribed = isSubscribed;
    }

    public boolean isSubscribed() {
        return isSubscribed;
    }

    public void setSubscribed(boolean subscribed) {
        isSubscribed = subscribed;
    }
}