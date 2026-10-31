package com.marketmind.automation.model;

import com.marketmind.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "campaign_assets")
public class CampaignAsset extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @Column(name = "asset_type", nullable = false)
    private String assetType; // "EMAIL_SEQUENCE", "LINKEDIN_POST", "INSTAGRAM_CONTENT", "AD_COPY", "PERSONALIZED_OUTREACH"

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", nullable = false, length = 6000)
    private String content;

    @Column(name = "channel")
    private String channel; // "Email", "LinkedIn", "Instagram", "Google Ads"

    public CampaignAsset() {}

    public Campaign getCampaign() { return campaign; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }

    public String getAssetType() { return assetType; }
    public void setAssetType(String assetType) { this.assetType = assetType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
}

