package com.marketmind.copilot.service;

import com.marketmind.ai.AiService;
import com.marketmind.ai.AiServiceFactory;
import com.marketmind.copilot.dto.ChatMessageDto;
import com.marketmind.copilot.dto.CopilotChatRequest;
import com.marketmind.copilot.dto.CopilotChatResponse;
import com.marketmind.discovery.service.TavilySearchClient;
import com.marketmind.intelligence.model.ProductAnalysis;
import com.marketmind.intelligence.repository.ProductAnalysisRepository;
import com.marketmind.product.model.Product;
import com.marketmind.product.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MarketingCopilotService {

    private static final Logger log = LoggerFactory.getLogger(MarketingCopilotService.class);

    private final AiServiceFactory aiServiceFactory;
    private final TavilySearchClient tavilyClient;
    private final ProductService productService;
    private final ProductAnalysisRepository analysisRepository;

    public MarketingCopilotService(
            AiServiceFactory aiServiceFactory,
            TavilySearchClient tavilyClient,
            ProductService productService,
            ProductAnalysisRepository analysisRepository
    ) {
        this.aiServiceFactory = aiServiceFactory;
        this.tavilyClient = tavilyClient;
        this.productService = productService;
        this.analysisRepository = analysisRepository;
    }

    public CopilotChatResponse chat(CopilotChatRequest request, String userId) {
        CopilotChatResponse response = new CopilotChatResponse();
        AiService aiService = aiServiceFactory.getActiveAiService();

        // 1. Gather Product Context if productId is provided
        Product product = null;
        ProductAnalysis analysis = null;
        if (request.getProductId() != null && !request.getProductId().isBlank()) {
            try {
                product = productService.getProductEntity(request.getProductId(), userId);
                analysis = analysisRepository.findByProductId(product.getId()).orElse(null);
            } catch (Exception e) {
                log.warn("Could not load product for copilot context: {}", e.getMessage());
            }
        }

        // 2. Gather Real-Time Market News & Platform Trends
        List<TavilySearchClient.TavilyResult> newsResults = new ArrayList<>();
        if (Boolean.TRUE.equals(request.getIncludeMarketNews())) {
            String category = product != null ? product.getCategory() : "B2B SaaS Growth";
            newsResults = tavilyClient.searchMarketNews(category, request.getMessage());

            for (TavilySearchClient.TavilyResult nr : newsResults) {
                response.getMarketNews().add(new CopilotChatResponse.NewsSnippetDto(
                        nr.title,
                        nr.url,
                        nr.content,
                        nr.publishedDate,
                        nr.source != null ? nr.source : "marketmind.ai",
                        nr.category != null ? nr.category : "Market Trend",
                        nr.impactTag != null ? nr.impactTag : "⚡ High Impact"
                ));
            }
        }

        // 3. Construct System Prompt
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("""
                You are Globe AI, an elite Chief Marketing Officer, Principal Growth Architect, and Marketing Director.
                You act as the high-level growth co-strategist for a marketer responsible for promoting, positioning, and scaling their product.

                CRITICAL BRAND IDENTITY & ACCURACY DIRECTIVES:
                1. Your name is strictly "Globe AI" (or "Globe AI Enterprise").
                2. NEVER mention, reference, or acknowledge any third-party AI provider, architecture, or model names (such as Groq, OpenAI, LLaMA, GPT, Anthropic, Claude, Gemini). You are powered by proprietary Globe AI intelligence.
                3. Professional Posture: Speak as an elite CMO, Senior Growth Partner, and Marketing Scientist. Be rigorous, commercial, articulate, and deeply tactical. Treat the user as a peer growth marketer.

                TABLE GENERATION & DATA REPRESENTATION MANDATE:
                - High-level marketers and executive decision-makers digest strategy best through structured data tables.
                - Whenever presenting channel strategies, competitor comparisons, CAC/LTV benchmarks, audience segments, content calendars, conversion metrics, or marketing experiments, YOU MUST GENERATE RICH, CLEAN MARKDOWN TABLES.
                - Table standards:
                  * Always use clear, descriptive column headers (e.g. `| Acquisition Channel | Target Audience & Angle | Algorithm / Format Strategy | Expected Benchmark / CAC | 7-Day Action Item |`).
                  * Use standard markdown table syntax with alignment colons (`| :--- | :--- | :--- | :--- | :--- |`).
                  * Provide concrete, highly specific row entries—avoid generic placeholders.

                UNIVERSAL PRODUCT SUPPORT:
                - You cater to ALL types of products across the economy:
                  1. Physical Consumer Products, Games & Toys (e.g., UNO Flip, board games, tabletop games, toys, lifestyle goods, fashion, D2C).
                     * Focus on: viral TikTok/Instagram Reels hooks, unboxing psychology, family game nights, influencer gifting, Amazon/retail channel optimization, holiday gifting guides, and passionate enthusiast communities (e.g., Reddit r/boardgames, boardgamegeek).
                  2. B2B SaaS, Developer Tools & Cloud Software.
                     * Focus on: LinkedIn thought leadership, cold outbound sequences, pain-point teardowns, ROI calculators, and product-led growth.
                  3. Digital Apps, Games & Services.
                     * Focus on: App Store Optimization (ASO), paid user acquisition, community referral loops, and viral onboarding mechanics.

                SOCIAL PLATFORM ALGORITHM OPTIMIZATION:
                - LinkedIn: Focus on the "Dwell Time" algorithm, multi-page PDF carousels, polarizing opening hooks, and first-hour comment velocity.
                - Twitter/X: Focus on 1-line contrarian hooks, 5-7 post educational threads, visual breakdowns, and high-retweet framing.
                - Reddit: Focus on zero-pitch authenticity, deep problem-solving in niche subreddits, community feedback loops, and AMAs.
                - Instagram & TikTok: Focus on 3-second visual hooks, audio trends, problem-agitation-solution pacing, and UGC creators.

                ACTIONABLE DELIVERABLES:
                Always include ready-to-publish copy, punchy headlines, email drafts, or tactical execution steps alongside your tables.
                """);

        if (product != null) {
            systemPrompt.append("\n\n--- ACTIVE PRODUCT PROFILE ---\n");
            systemPrompt.append("Name: ").append(product.getName()).append("\n");
            systemPrompt.append("Category: ").append(product.getCategory()).append("\n");
            systemPrompt.append("Tagline: ").append(product.getTagline() != null ? product.getTagline() : "N/A").append("\n");
            systemPrompt.append("Pricing: ").append(product.getPricingModel() != null ? product.getPricingModel() : "N/A").append("\n");
            systemPrompt.append("Target Geography: ").append(product.getTargetGeography() != null ? product.getTargetGeography() : "Global").append("\n");
            systemPrompt.append("Description: ").append(product.getDescription()).append("\n");

            if (analysis != null) {
                systemPrompt.append("Value Proposition: ").append(analysis.getValueProposition()).append("\n");
                systemPrompt.append("Defensible USP: ").append(analysis.getUspAnalysis()).append("\n");
            }
        }

        if (!newsResults.isEmpty()) {
            systemPrompt.append("\n\n--- LATEST MARKET NEWS & SOCIAL PLATFORM SIGNALS ---\n");
            for (TavilySearchClient.TavilyResult nr : newsResults) {
                systemPrompt.append("• [").append(nr.title).append("] (").append(nr.url).append("): ").append(nr.content).append("\n");
            }
            systemPrompt.append("Use these market signals and news items to give the marketer timely, grounded hooks and trend analyses.\n");
        }

        if (request.getPlatformFocus() != null && !request.getPlatformFocus().equalsIgnoreCase("ALL")) {
            systemPrompt.append("\nPrimary Platform Focus: ").append(request.getPlatformFocus()).append(". Tailor formatting and cadence to this specific platform's current best practices.");
        }

        // 4. Build Conversation History
        List<Map<String, String>> messages = new ArrayList<>();
        if (request.getHistory() != null) {
            for (ChatMessageDto h : request.getHistory()) {
                messages.add(Map.of("role", h.getRole(), "content", h.getContent()));
            }
        }
        messages.add(Map.of("role", "user", "content", request.getMessage()));

        // 5. Generate AI Completion
        if (aiService != null && aiService.isAvailable()) {
            try {
                String reply = aiService.generateChat(systemPrompt.toString(), messages);
                response.setReply(reply);
                response.setAiProvider(aiService.getProviderName());
            } catch (Exception e) {
                log.error("Globe AI Copilot call failed: {}", e.getMessage(), e);
                response.setReply(generateFallbackReply(request, product));
                response.setAiProvider("Globe AI Intelligence Core");
            }
        } else {
            response.setReply(generateFallbackReply(request, product));
            response.setAiProvider("Globe AI Intelligence Core");
        }

        // 6. Generate Suggested Follow-ups
        response.setSuggestedFollowUps(List.of(
                "Draft 3 viral LinkedIn hooks for this angle",
                "How can I turn this news into a Twitter/X thread?",
                "Write a 1:1 cold outreach email citing this trend",
                "What are 3 low-CAC guerrilla marketing experiments for this?"
        ));

        return response;
    }

    private String generateFallbackReply(CopilotChatRequest request, Product product) {
        String pName = product != null ? product.getName() : "your product";
        String cat = product != null ? product.getCategory() : "your space";

        return String.format("""
                ### Strategic Marketing Brief & Channel Matrix: %s

                Here is an executive growth breakdown and channel playbook tailored for **%s** in the **%s** space:

                | Marketing Channel | Target Persona & Hook | Algorithmic Distribution Play | Benchmark / CAC | 7-Day Sprint Action |
                | :--- | :--- | :--- | :--- | :--- |
                | **Viral Social (TikTok / Reels / X)** | Early Adopters & Enthusiasts: *"The hidden friction in %s nobody talks about"* | 3-second visual contrast hook; problem-agitation pacing | Low CAC ($0.15-$0.45/view) | Produce 3 short-form videos highlighting the product's unfair twist |
                | **Community Seeding (Reddit / Discord)** | Dedicated Hobbyists & Power Users: *"Honest breakdown of how we solved %s"* | Value-first post with zero promo links; engage in top 3 niche subreddits | Organic / $0 CAC | Launch an AMA or genuine teardown thread answering key community questions |
                | **High-Intent Inbound & Search** | Active Solution Seekers: *"Best alternative for %s in 2026"* | Long-tail comparison pages vs legacy solutions | High Intent / High Conversion | Publish a side-by-side comparison matrix on your landing page |
                | **Targeted Outbound & Partnerships** | Key Distributors, Retailers & Creators | Personalized micro-pitch referencing their recent audience discussions | 15-25%% Reply Rate | Send 20 customized partnership pitches to high-relevance influencers |

                #### Ready-to-Publish Promotional Hook:
                > *"Most solutions in %s settle for the status quo. %s was engineered with one mission: eliminate the tedious friction and bring back pure excitement. Here is how it flips the game."*

                Would you like me to expand this into a full 30-day promotional calendar, or write specific ad scripts for Meta and Google?
                """, pName, pName, cat, cat, cat, cat, cat, pName);
    }
}

