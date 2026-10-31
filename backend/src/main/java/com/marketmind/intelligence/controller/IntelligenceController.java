package com.marketmind.intelligence.controller;

import com.marketmind.auth.model.User;
import com.marketmind.common.api.ApiResponse;
import com.marketmind.intelligence.dto.AnalysisResponseDto;
import com.marketmind.intelligence.service.ProductIntelligenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products/{productId}/intelligence")
@Tag(name = "Product Intelligence", description = "Engine 1: AI product analysis, personas, competitors, and USP synthesis")
@SecurityRequirement(name = "bearerAuth")
public class IntelligenceController {

    private final ProductIntelligenceService intelligenceService;

    public IntelligenceController(ProductIntelligenceService intelligenceService) {
        this.intelligenceService = intelligenceService;
    }

    @GetMapping
    @Operation(summary = "Get intelligence analysis for a product (auto-generates if none exists)")
    public ResponseEntity<ApiResponse<AnalysisResponseDto>> getAnalysis(
            @PathVariable String productId,
            @AuthenticationPrincipal User user
    ) {
        AnalysisResponseDto analysis = intelligenceService.getAnalysisForProduct(productId, user.getId());
        return ResponseEntity.ok(ApiResponse.ok(analysis));
    }

    @PostMapping("/reanalyze")
    @Operation(summary = "Re-run AI market intelligence analysis on demand")
    public ResponseEntity<ApiResponse<AnalysisResponseDto>> reanalyze(
            @PathVariable String productId,
            @AuthenticationPrincipal User user
    ) {
        AnalysisResponseDto analysis = intelligenceService.generateIntelligence(productId, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Intelligence generated successfully", analysis));
    }
}

