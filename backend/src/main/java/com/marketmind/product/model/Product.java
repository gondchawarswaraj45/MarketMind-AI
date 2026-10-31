package com.marketmind.product.model;

import com.marketmind.auth.model.User;
import com.marketmind.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "tagline")
    private String tagline;

    @Column(name = "description", nullable = false, length = 4000)
    private String description;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "pricing_model")
    private String pricingModel;

    @Column(name = "target_geography")
    private String targetGeography;

    public Product() {}

    public Product(User user, String name, String tagline, String description, String category, String websiteUrl, String pricingModel, String targetGeography) {
        this.user = user;
        this.name = name;
        this.tagline = tagline;
        this.description = description;
        this.category = category;
        this.websiteUrl = websiteUrl;
        this.pricingModel = pricingModel;
        this.targetGeography = targetGeography;
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getPricingModel() { return pricingModel; }
    public void setPricingModel(String pricingModel) { this.pricingModel = pricingModel; }

    public String getTargetGeography() { return targetGeography; }
    public void setTargetGeography(String targetGeography) { this.targetGeography = targetGeography; }
}

