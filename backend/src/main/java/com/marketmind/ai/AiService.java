package com.marketmind.ai;

import java.util.List;
import java.util.Map;

public interface AiService {
    String generateContent(String systemPrompt, String userPrompt);
    String generateChat(String systemPrompt, List<Map<String, String>> conversationHistory);
    String getProviderName();
    boolean isAvailable();
}
