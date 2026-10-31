package com.marketmind.discovery.controller;

import com.marketmind.auth.model.User;
import com.marketmind.common.api.ApiResponse;
import com.marketmind.discovery.dto.DiscoveryResponseDto;
import com.marketmind.discovery.dto.SearchTriggerDto;
import com.marketmind.discovery.service.BuyerDiscoveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products/{productId}/discovery")
@Tag(name = "Buyer Discovery", description = "Engine 2: Tavily web research, buying signals, and lead relevance scoring")
@SecurityRequirement(name = "bearerAuth")
public class DiscoveryController {

    private final BuyerDiscoveryService discoveryService;

    public DiscoveryController(BuyerDiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @GetMapping
    @Operation(summary = "Get latest discovered buyer leads and public signals")
    public ResponseEntity<ApiResponse<DiscoveryResponseDto>> getLatestDiscovery(
            @PathVariable String productId,
            @AuthenticationPrincipal User user
    ) {
        DiscoveryResponseDto result = discoveryService.getLatestOrRunDiscovery(productId, user.getId(), null);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/history")
    @Operation(summary = "Get historical buyer search runs")
    public ResponseEntity<ApiResponse<List<DiscoveryResponseDto>>> getSearchHistory(
            @PathVariable String productId,
            @AuthenticationPrincipal User user
    ) {
        List<DiscoveryResponseDto> history = discoveryService.getSearchHistory(productId, user.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @PostMapping("/search")
    @Operation(summary = "Trigger a new real-time buying signal search via Tavily")
    public ResponseEntity<ApiResponse<DiscoveryResponseDto>> triggerSearch(
            @PathVariable String productId,
            @RequestBody(required = false) SearchTriggerDto triggerDto,
            @AuthenticationPrincipal User user
    ) {
        String query = triggerDto != null ? triggerDto.getCustomIntentQuery() : null;
        DiscoveryResponseDto result = discoveryService.executeDiscovery(productId, user.getId(), query);
        return ResponseEntity.ok(ApiResponse.ok("Buyer discovery completed", result));
    }
}

