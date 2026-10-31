package com.marketmind.intelligence.dto;

import com.marketmind.intelligence.model.Competitor;
import com.marketmind.intelligence.model.CustomerPersona;
import com.marketmind.intelligence.model.ProductAnalysis;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class AnalysisResponseDto {
    private String id;
    private String productId;
    private String valueProposition;
    private String targetMarketSummary;
    private String uspAnalysis;
    private List<String> blueOceanOpportunities;
    private Integer marketReadinessScore;
    private String aiProviderUsed;
    private Boolean isLiveAi;
    private List<PersonaDto> personas;
    private List<CompetitorDto> competitors;
    private LocalDateTime createdAt;

    public static class PersonaDto {
        private String id;
        private String title;
        private String seniorityLevel;
        private List<String> painPoints;
        private List<String> buyingTriggers;
        private List<String> objections;
        private Integer fitScore;

        public static PersonaDto fromEntity(CustomerPersona persona) {
            PersonaDto dto = new PersonaDto();
            dto.setId(persona.getId());
            dto.setTitle(persona.getTitle());
            dto.setSeniorityLevel(persona.getSeniorityLevel());
            dto.setFitScore(persona.getFitScore());
            dto.setPainPoints(splitItems(persona.getPainPoints()));
            dto.setBuyingTriggers(splitItems(persona.getBuyingTriggers()));
            dto.setObjections(splitItems(persona.getObjections()));
            return dto;
        }

        private static List<String> splitItems(String text) {
            if (text == null || text.isBlank()) return List.of();
            return Arrays.stream(text.split(";;"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getSeniorityLevel() { return seniorityLevel; }
        public void setSeniorityLevel(String seniorityLevel) { this.seniorityLevel = seniorityLevel; }
        public List<String> getPainPoints() { return painPoints; }
        public void setPainPoints(List<String> painPoints) { this.painPoints = painPoints; }
        public List<String> getBuyingTriggers() { return buyingTriggers; }
        public void setBuyingTriggers(List<String> buyingTriggers) { this.buyingTriggers = buyingTriggers; }
        public List<String> getObjections() { return objections; }
        public void setObjections(List<String> objections) { this.objections = objections; }
        public Integer getFitScore() { return fitScore; }
        public void setFitScore(Integer fitScore) { this.fitScore = fitScore; }
    }

    public static class CompetitorDto {
        private String id;
        private String name;
        private String website;
        private List<String> strengths;
        private List<String> weaknesses;
        private String ourDifferentiation;

        public static CompetitorDto fromEntity(Competitor comp) {
            CompetitorDto dto = new CompetitorDto();
            dto.setId(comp.getId());
            dto.setName(comp.getName());
            dto.setWebsite(comp.getWebsite());
            dto.setOurDifferentiation(comp.getOurDifferentiation());
            dto.setStrengths(splitItems(comp.getStrengths()));
            dto.setWeaknesses(splitItems(comp.getWeaknesses()));
            return dto;
        }

        private static List<String> splitItems(String text) {
            if (text == null || text.isBlank()) return List.of();
            return Arrays.stream(text.split(";;"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getWebsite() { return website; }
        public void setWebsite(String website) { this.website = website; }
        public List<String> getStrengths() { return strengths; }
        public void setStrengths(List<String> strengths) { this.strengths = strengths; }
        public List<String> getWeaknesses() { return weaknesses; }
        public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }
        public String getOurDifferentiation() { return ourDifferentiation; }
        public void setOurDifferentiation(String ourDifferentiation) { this.ourDifferentiation = ourDifferentiation; }
    }

    public static AnalysisResponseDto fromEntity(ProductAnalysis analysis) {
        AnalysisResponseDto dto = new AnalysisResponseDto();
        dto.setId(analysis.getId());
        dto.setProductId(analysis.getProduct().getId());
        dto.setValueProposition(analysis.getValueProposition());
        dto.setTargetMarketSummary(analysis.getTargetMarketSummary());
        dto.setUspAnalysis(analysis.getUspAnalysis());
        dto.setMarketReadinessScore(analysis.getMarketReadinessScore());
        dto.setAiProviderUsed(analysis.getAiProviderUsed());
        dto.setIsLiveAi(analysis.getIsLiveAi());
        dto.setCreatedAt(analysis.getCreatedAt());

        if (analysis.getBlueOceanOpportunities() != null) {
            dto.setBlueOceanOpportunities(Arrays.stream(analysis.getBlueOceanOpportunities().split(";;"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList()));
        } else {
            dto.setBlueOceanOpportunities(List.of());
        }

        dto.setPersonas(analysis.getPersonas().stream()
                .map(PersonaDto::fromEntity)
                .collect(Collectors.toList()));

        dto.setCompetitors(analysis.getCompetitors().stream()
                .map(CompetitorDto::fromEntity)
                .collect(Collectors.toList()));

        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getValueProposition() { return valueProposition; }
    public void setValueProposition(String valueProposition) { this.valueProposition = valueProposition; }
    public String getTargetMarketSummary() { return targetMarketSummary; }
    public void setTargetMarketSummary(String targetMarketSummary) { this.targetMarketSummary = targetMarketSummary; }
    public String getUspAnalysis() { return uspAnalysis; }
    public void setUspAnalysis(String uspAnalysis) { this.uspAnalysis = uspAnalysis; }
    public List<String> getBlueOceanOpportunities() { return blueOceanOpportunities; }
    public void setBlueOceanOpportunities(List<String> blueOceanOpportunities) { this.blueOceanOpportunities = blueOceanOpportunities; }
    public Integer getMarketReadinessScore() { return marketReadinessScore; }
    public void setMarketReadinessScore(Integer marketReadinessScore) { this.marketReadinessScore = marketReadinessScore; }
    public String getAiProviderUsed() { return aiProviderUsed; }
    public void setAiProviderUsed(String aiProviderUsed) { this.aiProviderUsed = aiProviderUsed; }
    public Boolean getIsLiveAi() { return isLiveAi; }
    public void setIsLiveAi(Boolean isLiveAi) { this.isLiveAi = isLiveAi; }
    public List<PersonaDto> getPersonas() { return personas; }
    public void setPersonas(List<PersonaDto> personas) { this.personas = personas; }
    public List<CompetitorDto> getCompetitors() { return competitors; }
    public void setCompetitors(List<CompetitorDto> competitors) { this.competitors = competitors; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

