package com.marketmind.product.dto;

import com.marketmind.product.model.Product;
import java.time.LocalDateTime;

public class ProductResponseDto {
    private String id;
    private String name;
    private String tagline;
    private String description;
    private String category;
    private String websiteUrl;
    private String pricingModel;
    private String targetGeography;
    private LocalDateTime createdAt;

    public ProductResponseDto() {}

    public static ProductResponseDto fromEntity(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setTagline(product.getTagline());
        dto.setDescription(product.getDescription());
        dto.setCategory(product.getCategory());
        dto.setWebsiteUrl(product.getWebsiteUrl());
        dto.setPricingModel(product.getPricingModel());
        dto.setTargetGeography(product.getTargetGeography());
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

