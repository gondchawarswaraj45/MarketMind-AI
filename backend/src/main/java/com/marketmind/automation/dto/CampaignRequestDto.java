package com.marketmind.automation.dto;

import jakarta.validation.constraints.NotBlank;

public class CampaignRequestDto {

    @NotBlank(message = "Campaign title is required")
    private String title;

    private String campaignType; // "MULTI_CHANNEL_GTM", "COLD_OUTREACH", "PRODUCT_LAUNCH", "PAID_ADVERTISING"
    private String targetPersona;
    private String customAngle;

    public CampaignRequestDto() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCampaignType() { return campaignType; }
    public void setCampaignType(String campaignType) { this.campaignType = campaignType; }

    public String getTargetPersona() { return targetPersona; }
    public void setTargetPersona(String targetPersona) { this.targetPersona = targetPersona; }

    public String getCustomAngle() { return customAngle; }
    public void setCustomAngle(String customAngle) { this.customAngle = customAngle; }
}

