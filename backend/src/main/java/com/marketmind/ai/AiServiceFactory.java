package com.marketmind.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AiServiceFactory {

    private static final Logger log = LoggerFactory.getLogger(AiServiceFactory.class);

    private final GroqAiService groqAiService;
    private final GeminiAiService geminiAiService;
    private final String preferredProvider;

    public AiServiceFactory(
            GroqAiService groqAiService,
            GeminiAiService geminiAiService,
            @Value("${marketmind.ai.provider:groq}") String preferredProvider
    ) {
        this.groqAiService = groqAiService;
        this.geminiAiService = geminiAiService;
        this.preferredProvider = preferredProvider != null ? preferredProvider.toLowerCase() : "groq";
        log.info("Initialized AiServiceFactory with preferred AI provider: {}", this.preferredProvider);
    }

    public AiService getActiveAiService() {
        if ("gemini".equals(preferredProvider) && geminiAiService.isAvailable()) {
            return geminiAiService;
        }

        if (groqAiService.isAvailable()) {
            return groqAiService;
        }

        if (geminiAiService.isAvailable()) {
            return geminiAiService;
        }

        // Neither provider is configured with an active API key
        return null;
    }

    public boolean hasLiveAi() {
        return groqAiService.isAvailable() || geminiAiService.isAvailable();
    }
}

