package com.marketmind.intelligence.model;

import com.marketmind.common.entity.BaseEntity;
import com.marketmind.product.model.Product;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_analyses")
public class ProductAnalysis extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(name = "value_proposition", length = 4000)
    private String valueProposition;

    @Column(name = "target_market_summary", length = 4000)
    private String targetMarketSummary;

    @Column(name = "usp_analysis", length = 4000)
    private String uspAnalysis;

    @Column(name = "blue_ocean_opportunities", length = 4000)
    private String blueOceanOpportunities;

    @Column(name = "market_readiness_score")
    private Integer marketReadinessScore = 85;

    @Column(name = "ai_provider_used")
    private String aiProviderUsed;

    @Column(name = "is_live_ai")
    private Boolean isLiveAi = true;

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CustomerPersona> personas = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Competitor> competitors = new ArrayList<>();

    public ProductAnalysis() {}

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getValueProposition() { return valueProposition; }
    public void setValueProposition(String valueProposition) { this.valueProposition = valueProposition; }

    public String getTargetMarketSummary() { return targetMarketSummary; }
    public void setTargetMarketSummary(String targetMarketSummary) { this.targetMarketSummary = targetMarketSummary; }

    public String getUspAnalysis() { return uspAnalysis; }
    public void setUspAnalysis(String uspAnalysis) { this.uspAnalysis = uspAnalysis; }

    public String getBlueOceanOpportunities() { return blueOceanOpportunities; }
    public void setBlueOceanOpportunities(String blueOceanOpportunities) { this.blueOceanOpportunities = blueOceanOpportunities; }

    public Integer getMarketReadinessScore() { return marketReadinessScore; }
    public void setMarketReadinessScore(Integer marketReadinessScore) { this.marketReadinessScore = marketReadinessScore; }

    public String getAiProviderUsed() { return aiProviderUsed; }
    public void setAiProviderUsed(String aiProviderUsed) { this.aiProviderUsed = aiProviderUsed; }

    public Boolean getIsLiveAi() { return isLiveAi; }
    public void setIsLiveAi(Boolean isLiveAi) { this.isLiveAi = isLiveAi; }

    public List<CustomerPersona> getPersonas() { return personas; }
    public void setPersonas(List<CustomerPersona> personas) { this.personas = personas; }

    public List<Competitor> getCompetitors() { return competitors; }
    public void setCompetitors(List<Competitor> competitors) { this.competitors = competitors; }
}

