package com.marketmind.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProductRequestDto {

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @Size(max = 255, message = "Tagline must be less than 255 characters")
    private String tagline;

    @NotBlank(message = "Product description is required")
    @Size(min = 20, max = 4000, message = "Description should be between 20 and 4000 characters")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private String websiteUrl;
    private String pricingModel;
    private String targetGeography;

    public ProductRequestDto() {}

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

