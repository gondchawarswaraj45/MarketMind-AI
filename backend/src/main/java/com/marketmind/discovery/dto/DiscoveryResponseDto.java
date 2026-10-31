package com.marketmind.discovery.dto;

import com.marketmind.discovery.model.BuyerSearch;
import com.marketmind.discovery.model.BuyingSignal;
import com.marketmind.discovery.model.DecisionMakerRole;
import com.marketmind.discovery.model.Lead;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class DiscoveryResponseDto {
    private String searchId;
    private String queryContext;
    private String searchStatus;
    private Boolean isLiveTavily;
    private List<LeadDto> leads;
    private LocalDateTime createdAt;

    public static class BuyingSignalDto {
        private String id;
        private String signalType;
        private String headline;
        private String evidenceSnippet;
        private String sourceUrl;
        private LocalDateTime signalDate;
        private Double confidenceScore;
        private Boolean isVerifiedFact;

        public static BuyingSignalDto fromEntity(BuyingSignal signal) {
            BuyingSignalDto dto = new BuyingSignalDto();
            dto.setId(signal.getId());
            dto.setSignalType(signal.getSignalType());
            dto.setHeadline(signal.getHeadline());
            dto.setEvidenceSnippet(signal.getEvidenceSnippet());
            dto.setSourceUrl(signal.getSourceUrl());
            dto.setSignalDate(signal.getSignalDate());
            dto.setConfidenceScore(signal.getConfidenceScore());
            dto.setIsVerifiedFact(signal.getIsVerifiedFact());
            return dto;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
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

    public static class DecisionMakerRoleDto {
        private String id;
        private String roleTitle;
        private String department;
        private String responsibilityScope;
        private Boolean publicEvidenceFound;

        public static DecisionMakerRoleDto fromEntity(DecisionMakerRole role) {
            DecisionMakerRoleDto dto = new DecisionMakerRoleDto();
            dto.setId(role.getId());
            dto.setRoleTitle(role.getRoleTitle());
            dto.setDepartment(role.getDepartment());
            dto.setResponsibilityScope(role.getResponsibilityScope());
            dto.setPublicEvidenceFound(role.getPublicEvidenceFound());
            return dto;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getRoleTitle() { return roleTitle; }
        public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public String getResponsibilityScope() { return responsibilityScope; }
        public void setResponsibilityScope(String responsibilityScope) { this.responsibilityScope = responsibilityScope; }
        public Boolean getPublicEvidenceFound() { return publicEvidenceFound; }
        public void setPublicEvidenceFound(Boolean publicEvidenceFound) { this.publicEvidenceFound = publicEvidenceFound; }
    }

    public static class LeadDto {
        private String id;
        private String companyName;
        private String domain;
        private String industry;
        private String companySize;
        private Integer relevanceScore;
        private String relevanceRationale;
        private Boolean isVerified;
        private List<BuyingSignalDto> signals;
        private List<DecisionMakerRoleDto> decisionMakerRoles;

        public static LeadDto fromEntity(Lead lead) {
            LeadDto dto = new LeadDto();
            dto.setId(lead.getId());
            dto.setCompanyName(lead.getCompanyName());
            dto.setDomain(lead.getDomain());
            dto.setIndustry(lead.getIndustry());
            dto.setCompanySize(lead.getCompanySize());
            dto.setRelevanceScore(lead.getRelevanceScore());
            dto.setRelevanceRationale(lead.getRelevanceRationale());
            dto.setIsVerified(lead.getIsVerified());
            dto.setSignals(lead.getSignals().stream().map(BuyingSignalDto::fromEntity).collect(Collectors.toList()));
            dto.setDecisionMakerRoles(lead.getDecisionMakerRoles().stream().map(DecisionMakerRoleDto::fromEntity).collect(Collectors.toList()));
            return dto;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
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
        public List<BuyingSignalDto> getSignals() { return signals; }
        public void setSignals(List<BuyingSignalDto> signals) { this.signals = signals; }
        public List<DecisionMakerRoleDto> getDecisionMakerRoles() { return decisionMakerRoles; }
        public void setDecisionMakerRoles(List<DecisionMakerRoleDto> decisionMakerRoles) { this.decisionMakerRoles = decisionMakerRoles; }
    }

    public static DiscoveryResponseDto fromEntity(BuyerSearch search) {
        DiscoveryResponseDto dto = new DiscoveryResponseDto();
        dto.setSearchId(search.getId());
        dto.setQueryContext(search.getQueryContext());
        dto.setSearchStatus(search.getSearchStatus());
        dto.setIsLiveTavily(search.getIsLiveTavily());
        dto.setCreatedAt(search.getCreatedAt());
        dto.setLeads(search.getLeads().stream().map(LeadDto::fromEntity).collect(Collectors.toList()));
        return dto;
    }

    public String getSearchId() { return searchId; }
    public void setSearchId(String searchId) { this.searchId = searchId; }
    public String getQueryContext() { return queryContext; }
    public void setQueryContext(String queryContext) { this.queryContext = queryContext; }
    public String getSearchStatus() { return searchStatus; }
    public void setSearchStatus(String searchStatus) { this.searchStatus = searchStatus; }
    public Boolean getIsLiveTavily() { return isLiveTavily; }
    public void setIsLiveTavily(Boolean isLiveTavily) { this.isLiveTavily = isLiveTavily; }
    public List<LeadDto> getLeads() { return leads; }
    public void setLeads(List<LeadDto> leads) { this.leads = leads; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

