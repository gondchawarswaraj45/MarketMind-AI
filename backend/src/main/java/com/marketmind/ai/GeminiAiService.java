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
public class GeminiAiService implements AiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiService.class);

    private final String apiKey;
    private final String model;
    private final String baseUrl;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeminiAiService(
            @Value("${marketmind.ai.gemini.api-key:}") String apiKey,
            @Value("${marketmind.ai.gemini.model:gemini-1.5-flash}") String model,
            @Value("${marketmind.ai.gemini.base-url:https://generativelanguage.googleapis.com/v1beta}") String baseUrl,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.model = model != null && !model.isBlank() ? model : "gemini-1.5-flash";
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
            throw new AiServiceException("Gemini API key is not configured.");
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(
                    Map.of("role", "user", "parts", List.of(Map.of("text", systemPrompt + "\n\n" + userPrompt)))
            ));
            requestBody.put("generationConfig", Map.of(
                    "responseMimeType", "application/json",
                    "temperature", 0.4
            ));

            return callGemini(requestBody);
        } catch (Exception e) {
            log.error("Failed to call Gemini API: {}", e.getMessage(), e);
            throw new AiServiceException("Gemini AI generation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateChat(String systemPrompt, List<Map<String, String>> conversationHistory) {
        if (!isAvailable()) {
            throw new AiServiceException("Gemini API key is not configured.");
        }

        try {
            List<Map<String, Object>> contents = new ArrayList<>();
            for (Map<String, String> msg : conversationHistory) {
                String role = "assistant".equalsIgnoreCase(msg.get("role")) ? "model" : "user";
                contents.add(Map.of("role", role, "parts", List.of(Map.of("text", msg.get("content")))));
            }

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", contents);
            requestBody.put("systemInstruction", Map.of("parts", List.of(Map.of("text", systemPrompt))));
            requestBody.put("generationConfig", Map.of("temperature", 0.7));

            return callGemini(requestBody);
        } catch (Exception e) {
            log.error("Failed to call Gemini chat API: {}", e.getMessage(), e);
            throw new AiServiceException("Gemini chat failed: " + e.getMessage(), e);
        }
    }

    private String callGemini(Map<String, Object> requestBody) throws Exception {
        String rawResponse = restClient.post()
                .uri("/models/" + model + ":generateContent?key=" + apiKey)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        JsonNode rootNode = objectMapper.readTree(rawResponse);
        JsonNode candidates = rootNode.path("candidates");
        if (candidates.isArray() && !candidates.isEmpty()) {
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                return parts.get(0).path("text").asText();
            }
        }

        throw new AiServiceException("Empty response received from Gemini API");
    }
}
