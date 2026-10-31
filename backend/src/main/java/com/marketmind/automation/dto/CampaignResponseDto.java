package com.marketmind.automation.dto;

import com.marketmind.automation.model.Campaign;
import com.marketmind.automation.model.CampaignAsset;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class CampaignResponseDto {
    private String id;
    private String productId;
    private String title;
    private String campaignType;
    private String status;
    private String targetPersona;
    private List<AssetDto> assets;
    private LocalDateTime createdAt;

    public static class AssetDto {
        private String id;
        private String assetType;
        private String title;
        private String content;
        private String channel;

        public static AssetDto fromEntity(CampaignAsset asset) {
            AssetDto dto = new AssetDto();
            dto.setId(asset.getId());
            dto.setAssetType(asset.getAssetType());
            dto.setTitle(asset.getTitle());
            dto.setContent(asset.getContent());
            dto.setChannel(asset.getChannel());
            return dto;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getAssetType() { return assetType; }
        public void setAssetType(String assetType) { this.assetType = assetType; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getChannel() { return channel; }
        public void setChannel(String channel) { this.channel = channel; }
    }

    public static CampaignResponseDto fromEntity(Campaign campaign) {
        CampaignResponseDto dto = new CampaignResponseDto();
        dto.setId(campaign.getId());
        dto.setProductId(campaign.getProduct().getId());
        dto.setTitle(campaign.getTitle());
        dto.setCampaignType(campaign.getCampaignType());
        dto.setStatus(campaign.getStatus());
        dto.setTargetPersona(campaign.getTargetPersona());
        dto.setCreatedAt(campaign.getCreatedAt());
        dto.setAssets(campaign.getAssets().stream().map(AssetDto::fromEntity).collect(Collectors.toList()));
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCampaignType() { return campaignType; }
    public void setCampaignType(String campaignType) { this.campaignType = campaignType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTargetPersona() { return targetPersona; }
    public void setTargetPersona(String targetPersona) { this.targetPersona = targetPersona; }
    public List<AssetDto> getAssets() { return assets; }
    public void setAssets(List<AssetDto> assets) { this.assets = assets; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

