package com.marketmind.automation.controller;

import com.marketmind.auth.model.User;
import com.marketmind.automation.dto.CampaignRequestDto;
import com.marketmind.automation.dto.CampaignResponseDto;
import com.marketmind.automation.service.MarketingAutomationService;
import com.marketmind.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products/{productId}/campaigns")
@Tag(name = "Marketing Automation", description = "Engine 3: Generate multi-channel campaigns, email drip sequences, and 1:1 outreach")
@SecurityRequirement(name = "bearerAuth")
public class CampaignController {

    private final MarketingAutomationService automationService;

    public CampaignController(MarketingAutomationService automationService) {
        this.automationService = automationService;
    }

    @GetMapping
    @Operation(summary = "List all saved campaigns for a product")
    public ResponseEntity<ApiResponse<List<CampaignResponseDto>>> listCampaigns(
            @PathVariable String productId,
            @AuthenticationPrincipal User user
    ) {
        List<CampaignResponseDto> list = automationService.getCampaigns(productId, user.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate a new marketing campaign and assets")
    public ResponseEntity<ApiResponse<CampaignResponseDto>> generateCampaign(
            @PathVariable String productId,
            @Valid @RequestBody CampaignRequestDto request,
            @AuthenticationPrincipal User user
    ) {
        CampaignResponseDto campaign = automationService.generateCampaign(productId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Campaign generated successfully", campaign));
    }

    @DeleteMapping("/{campaignId}")
    @Operation(summary = "Delete a campaign by ID")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(
            @PathVariable String productId,
            @PathVariable String campaignId,
            @AuthenticationPrincipal User user
    ) {
        automationService.deleteCampaign(campaignId, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Campaign deleted successfully", null));
    }
}

