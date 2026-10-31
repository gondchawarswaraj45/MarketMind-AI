package com.marketmind.automation.model;

import com.marketmind.common.entity.BaseEntity;
import com.marketmind.product.model.Product;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campaigns")
public class Campaign extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "campaign_type", nullable = false)
    private String campaignType; // e.g. "MULTI_CHANNEL_GTM", "COLD_OUTREACH", "PRODUCT_LAUNCH", "PAID_ADVERTISING"

    @Column(name = "status")
    private String status = "ACTIVE"; // "DRAFT", "ACTIVE", "ARCHIVED"

    @Column(name = "target_persona")
    private String targetPersona;

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CampaignAsset> assets = new ArrayList<>();

    public Campaign() {}

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCampaignType() { return campaignType; }
    public void setCampaignType(String campaignType) { this.campaignType = campaignType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTargetPersona() { return targetPersona; }
    public void setTargetPersona(String targetPersona) { this.targetPersona = targetPersona; }

    public List<CampaignAsset> getAssets() { return assets; }
    public void setAssets(List<CampaignAsset> assets) { this.assets = assets; }
}

