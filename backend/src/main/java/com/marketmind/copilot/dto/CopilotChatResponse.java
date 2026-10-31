package com.marketmind.copilot.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CopilotChatResponse {
    private String reply;
    private String aiProvider;
    private List<NewsSnippetDto> marketNews = new ArrayList<>();
    private List<String> suggestedFollowUps = new ArrayList<>();
    private LocalDateTime timestamp;

    public static class NewsSnippetDto {
        private String title;
        private String url;
        private String snippet;
        private String publishedDate;
        private String source;
        private String category;
        private String impactTag;

        public NewsSnippetDto() {}

        public NewsSnippetDto(String title, String url, String snippet, String publishedDate, String source, String category, String impactTag) {
            this.title = title;
            this.url = url;
            this.snippet = snippet;
            this.publishedDate = publishedDate;
            this.source = source;
            this.category = category;
            this.impactTag = impactTag;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public String getSnippet() { return snippet; }
        public void setSnippet(String snippet) { this.snippet = snippet; }
        public String getPublishedDate() { return publishedDate; }
        public void setPublishedDate(String publishedDate) { this.publishedDate = publishedDate; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getImpactTag() { return impactTag; }
        public void setImpactTag(String impactTag) { this.impactTag = impactTag; }
    }

    public CopilotChatResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getAiProvider() { return aiProvider; }
    public void setAiProvider(String aiProvider) { this.aiProvider = aiProvider; }

    public List<NewsSnippetDto> getMarketNews() { return marketNews; }
    public void setMarketNews(List<NewsSnippetDto> marketNews) { this.marketNews = marketNews; }

    public List<String> getSuggestedFollowUps() { return suggestedFollowUps; }
    public void setSuggestedFollowUps(List<String> suggestedFollowUps) { this.suggestedFollowUps = suggestedFollowUps; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

