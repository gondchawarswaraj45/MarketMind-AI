package com.marketmind.discovery.model;

import com.marketmind.common.entity.BaseEntity;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "leads")
public class Lead extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "search_id", nullable = false)
    private BuyerSearch search;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "domain")
    private String domain;

    @Column(name = "industry")
    private String industry;

    @Column(name = "company_size")
    private String companySize;

    @Column(name = "relevance_score", nullable = false)
    private Integer relevanceScore = 80;

    @Column(name = "relevance_rationale", length = 3000)
    private String relevanceRationale;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = true;

    @OneToMany(mappedBy = "lead", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<BuyingSignal> signals = new ArrayList<>();

    @OneToMany(mappedBy = "lead", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DecisionMakerRole> decisionMakerRoles = new ArrayList<>();

    public Lead() {}

    public BuyerSearch getSearch() { return search; }
    public void setSearch(BuyerSearch search) { this.search = search; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getCompanySize() { return companySize; }
    public void setCompanySize(String companySize) { this.companySize = companySize; }

    public Integer getRelevanceScore() { return relevanceScore; }
    public void setRelevanceScore(Integer relevanceScore) { this.relevanceScore = relevanceScore; }

    public String getRelevanceRationale() { return relevanceRationale; }
    public void setRelevanceRationale(String relevanceRationale) { this.relevanceRationale = relevanceRationale; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public List<BuyingSignal> getSignals() { return signals; }
    public void setSignals(List<BuyingSignal> signals) { this.signals = signals; }

    public List<DecisionMakerRole> getDecisionMakerRoles() { return decisionMakerRoles; }
    public void setDecisionMakerRoles(List<DecisionMakerRole> decisionMakerRoles) { this.decisionMakerRoles = decisionMakerRoles; }
}

