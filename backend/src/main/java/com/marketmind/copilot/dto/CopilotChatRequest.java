package com.marketmind.copilot.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class CopilotChatRequest {

    @NotBlank(message = "Message cannot be empty")
    private String message;

    private String productId;
    private Boolean includeMarketNews = true;
    private String platformFocus; // e.g. "ALL", "LINKEDIN", "TWITTER", "REDDIT", "INSTAGRAM"
    private List<ChatMessageDto> history = new ArrayList<>();

    public CopilotChatRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public Boolean getIncludeMarketNews() { return includeMarketNews; }
    public void setIncludeMarketNews(Boolean includeMarketNews) { this.includeMarketNews = includeMarketNews; }

    public String getPlatformFocus() { return platformFocus; }
    public void setPlatformFocus(String platformFocus) { this.platformFocus = platformFocus; }

    public List<ChatMessageDto> getHistory() { return history; }
    public void setHistory(List<ChatMessageDto> history) { this.history = history; }
}

