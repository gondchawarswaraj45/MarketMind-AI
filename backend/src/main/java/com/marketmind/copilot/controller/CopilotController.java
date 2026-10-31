package com.marketmind.copilot.controller;

import com.marketmind.auth.model.User;
import com.marketmind.common.api.ApiResponse;
import com.marketmind.copilot.dto.CopilotChatRequest;
import com.marketmind.copilot.dto.CopilotChatResponse;
import com.marketmind.copilot.service.MarketingCopilotService;
import com.marketmind.discovery.service.TavilySearchClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/copilot")
@Tag(name = "Globe AI Marketing Agent", description = "Globe AI Strategic Marketing Co-Director: Strategy, Social Context, and Live Market News")
@SecurityRequirement(name = "bearerAuth")
public class CopilotController {

    private final MarketingCopilotService copilotService;
    private final TavilySearchClient tavilyClient;

    public CopilotController(
            MarketingCopilotService copilotService,
            TavilySearchClient tavilyClient
    ) {
        this.copilotService = copilotService;
        this.tavilyClient = tavilyClient;
    }

    @PostMapping("/chat")
    @Operation(summary = "Ask Globe AI for marketing strategies, channel playbooks, and market intelligence")
    public ResponseEntity<ApiResponse<CopilotChatResponse>> chat(
            @Valid @RequestBody CopilotChatRequest request,
            @AuthenticationPrincipal User user
    ) {
        CopilotChatResponse response = copilotService.chat(request, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Response generated", response));
    }

    @GetMapping("/news")
    @Operation(summary = "Fetch latest trending market news across platforms for a product category")
    public ResponseEntity<ApiResponse<List<TavilySearchClient.TavilyResult>>> getNews(
            @RequestParam(defaultValue = "B2B SaaS") String category,
            @RequestParam(required = false) String query
    ) {
        List<TavilySearchClient.TavilyResult> news = tavilyClient.searchMarketNews(category, query);
        return ResponseEntity.ok(ApiResponse.ok(news));
    }
}

