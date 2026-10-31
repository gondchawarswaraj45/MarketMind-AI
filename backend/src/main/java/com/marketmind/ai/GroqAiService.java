package com.marketmind.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketmind.common.exception.AiServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroqAiService implements AiService {

    private static final Logger log = LoggerFactory.getLogger(GroqAiService.class);

    private final String apiKey;
    private final String model;
    private final String fallbackModel;
    private final String baseUrl;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GroqAiService(
            @Value("${marketmind.ai.groq.api-key:}") String apiKey,
            @Value("${marketmind.ai.groq.model:openai/gpt-oss-120b}") String model,
            @Value("${marketmind.ai.groq.fallback-model:qwen/qwen3.8-27b}") String fallbackModel,
            @Value("${marketmind.ai.groq.base-url:https://api.groq.com/openai/v1}") String baseUrl,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.model = model != null && !model.isBlank() ? model : "openai/gpt-oss-120b";
        this.fallbackModel = fallbackModel != null && !fallbackModel.isBlank() ? fallbackModel : "qwen/qwen3.8-27b";
        this.baseUrl = baseUrl;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(this.baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public boolean isAvailable() {
        return !apiKey.isBlank();
    }

    @Override
    public String getProviderName() {
        return "Globe AI Intelligence Core";
    }

    @Override
    public String generateContent(String systemPrompt, String userPrompt) {
        if (!isAvailable()) {
            throw new AiServiceException("Groq API key is not configured.");
        }

        try {
            return executeCompletion(systemPrompt, List.of(Map.of("role", "user", "content", userPrompt)), true, model);
        } catch (Exception e) {
            log.warn("Groq completion with primary model {} failed ({}), trying fallback model {}", model, e.getMessage(), fallbackModel);
            try {
                return executeCompletion(systemPrompt, List.of(Map.of("role", "user", "content", userPrompt)), true, fallbackModel);
            } catch (Exception ex) {
                log.error("Groq AI completion failed on fallback: {}", ex.getMessage(), ex);
                throw new AiServiceException("Groq AI completion failed: " + ex.getMessage(), ex);
            }
        }
    }

    @Override
    public String generateChat(String systemPrompt, List<Map<String, String>> conversationHistory) {
        if (!isAvailable()) {
            throw new AiServiceException("Groq API key is not configured.");
        }

        try {
            return executeCompletion(systemPrompt, conversationHistory, false, model);
        } catch (Exception e) {
            log.warn("Groq chat with primary model {} failed ({}), trying fallback model {}", model, e.getMessage(), fallbackModel);
            try {
                return executeCompletion(systemPrompt, conversationHistory, false, fallbackModel);
            } catch (Exception ex) {
                log.error("Groq chat completion failed: {}", ex.getMessage(), ex);
                throw new AiServiceException("Groq chat failed: " + ex.getMessage(), ex);
            }
        }
    }

    private String executeCompletion(String systemPrompt, List<Map<String, String>> messages, boolean forceJson, String targetModel) throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", targetModel);
        requestBody.put("temperature", 0.7);

        if (forceJson) {
            requestBody.put("response_format", Map.of("type", "json_object"));
            requestBody.put("temperature", 0.3);
        }

        List<Map<String, String>> fullMessages = new ArrayList<>();
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            fullMessages.add(Map.of("role", "system", "content", systemPrompt));
        }
        fullMessages.addAll(messages);

        requestBody.put("messages", fullMessages);

        String rawResponse = restClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        JsonNode rootNode = objectMapper.readTree(rawResponse);
        JsonNode choices = rootNode.path("choices");
        if (choices.isArray() && !choices.isEmpty()) {
            return choices.get(0).path("message").path("content").asText();
        }

        throw new AiServiceException("Empty response received from Groq API");
    }
}
