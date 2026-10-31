package com.marketmind.discovery.model;

import com.marketmind.common.entity.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "buying_signals")
public class BuyingSignal extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    @Column(name = "signal_type", nullable = false)
    private String signalType; // e.g. "HIRING_EXPANSION", "TOOL_COMPLAINT", "FUNDING_ANNOUNCEMENT", "TECH_STACK_MIGRATION"

    @Column(name = "headline", nullable = false, length = 1000)
    private String headline;

    @Column(name = "evidence_snippet", nullable = false, length = 3000)
    private String evidenceSnippet;

    @Column(name = "source_url", nullable = false, length = 1000)
    private String sourceUrl;

    @Column(name = "signal_date")
    private LocalDateTime signalDate;

    @Column(name = "confidence_score")
    private Double confidenceScore = 0.92;

    @Column(name = "is_verified_fact")
    private Boolean isVerifiedFact = true;

    public BuyingSignal() {}

    public Lead getLead() { return lead; }
    public void setLead(Lead lead) { this.lead = lead; }

    public String getSignalType() { return signalType; }
    public void setSignalType(String signalType) { this.signalType = signalType; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getEvidenceSnippet() { return evidenceSnippet; }
    public void setEvidenceSnippet(String evidenceSnippet) { this.evidenceSnippet = evidenceSnippet; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public LocalDateTime getSignalDate() { return signalDate; }
    public void setSignalDate(LocalDateTime signalDate) { this.signalDate = signalDate; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public Boolean getIsVerifiedFact() { return isVerifiedFact; }
    public void setIsVerifiedFact(Boolean isVerifiedFact) { this.isVerifiedFact = isVerifiedFact; }
}

