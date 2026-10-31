package com.marketmind.discovery.model;

import com.marketmind.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "decision_maker_roles")
public class DecisionMakerRole extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    @Column(name = "role_title", nullable = false)
    private String roleTitle;

    @Column(name = "department")
    private String department;

    @Column(name = "responsibility_scope", length = 1000)
    private String responsibilityScope;

    @Column(name = "public_evidence_found")
    private Boolean publicEvidenceFound = true;

    public DecisionMakerRole() {}

    public Lead getLead() { return lead; }
    public void setLead(Lead lead) { this.lead = lead; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getResponsibilityScope() { return responsibilityScope; }
    public void setResponsibilityScope(String responsibilityScope) { this.responsibilityScope = responsibilityScope; }

    public Boolean getPublicEvidenceFound() { return publicEvidenceFound; }
    public void setPublicEvidenceFound(Boolean publicEvidenceFound) { this.publicEvidenceFound = publicEvidenceFound; }
}

