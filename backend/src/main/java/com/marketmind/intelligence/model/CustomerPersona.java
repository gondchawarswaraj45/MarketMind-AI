package com.marketmind.intelligence.model;

import com.marketmind.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "customer_personas")
public class CustomerPersona extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id", nullable = false)
    private ProductAnalysis analysis;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "seniority_level")
    private String seniorityLevel;

    @Column(name = "pain_points", length = 2000)
    private String painPoints; // stored as pipe-separated or json

    @Column(name = "buying_triggers", length = 2000)
    private String buyingTriggers;

    @Column(name = "objections", length = 2000)
    private String objections;

    @Column(name = "fit_score")
    private Integer fitScore = 90;

    public CustomerPersona() {}

    public ProductAnalysis getAnalysis() { return analysis; }
    public void setAnalysis(ProductAnalysis analysis) { this.analysis = analysis; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSeniorityLevel() { return seniorityLevel; }
    public void setSeniorityLevel(String seniorityLevel) { this.seniorityLevel = seniorityLevel; }

    public String getPainPoints() { return painPoints; }
    public void setPainPoints(String painPoints) { this.painPoints = painPoints; }

    public String getBuyingTriggers() { return buyingTriggers; }
    public void setBuyingTriggers(String buyingTriggers) { this.buyingTriggers = buyingTriggers; }

    public String getObjections() { return objections; }
    public void setObjections(String objections) { this.objections = objections; }

    public Integer getFitScore() { return fitScore; }
    public void setFitScore(Integer fitScore) { this.fitScore = fitScore; }
}

