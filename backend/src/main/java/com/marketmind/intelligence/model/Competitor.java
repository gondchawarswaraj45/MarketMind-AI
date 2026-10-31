package com.marketmind.intelligence.model;

import com.marketmind.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "competitors")
public class Competitor extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id", nullable = false)
    private ProductAnalysis analysis;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "website")
    private String website;

    @Column(name = "strengths", length = 2000)
    private String strengths;

    @Column(name = "weaknesses", length = 2000)
    private String weaknesses;

    @Column(name = "our_differentiation", length = 2000)
    private String ourDifferentiation;

    public Competitor() {}

    public ProductAnalysis getAnalysis() { return analysis; }
    public void setAnalysis(ProductAnalysis analysis) { this.analysis = analysis; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }

    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }

    public String getOurDifferentiation() { return ourDifferentiation; }
    public void setOurDifferentiation(String ourDifferentiation) { this.ourDifferentiation = ourDifferentiation; }
}

