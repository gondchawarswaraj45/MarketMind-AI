package com.marketmind.automation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketmind.ai.AiService;
import com.marketmind.ai.AiServiceFactory;
import com.marketmind.automation.dto.CampaignRequestDto;
import com.marketmind.automation.dto.CampaignResponseDto;
import com.marketmind.automation.model.Campaign;
import com.marketmind.automation.model.CampaignAsset;
import com.marketmind.automation.repository.CampaignRepository;
import com.marketmind.product.model.Product;
import com.marketmind.product.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarketingAutomationService {

    private static final Logger log = LoggerFactory.getLogger(MarketingAutomationService.class);

    private final CampaignRepository campaignRepository;
    private final ProductService productService;
    private final AiServiceFactory aiServiceFactory;
    private final ObjectMapper objectMapper;

    public MarketingAutomationService(
            CampaignRepository campaignRepository,
            ProductService productService,
            AiServiceFactory aiServiceFactory,
            ObjectMapper objectMapper
    ) {
        this.campaignRepository = campaignRepository;
        this.productService = productService;
        this.aiServiceFactory = aiServiceFactory;
        this.objectMapper = objectMapper;
    }

    public List<CampaignResponseDto> getCampaigns(String productId, String userId) {
        Product product = productService.getProductEntity(productId, userId);
        return campaignRepository.findByProductIdOrderByCreatedAtDesc(product.getId())
                .stream()
                .map(CampaignResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CampaignResponseDto generateCampaign(String productId, String userId, CampaignRequestDto dto) {
        Product product = productService.getProductEntity(productId, userId);

        Campaign campaign = new Campaign();
        campaign.setProduct(product);
        campaign.setTitle(dto.getTitle().trim());
        campaign.setCampaignType(dto.getCampaignType() != null ? dto.getCampaignType() : "MULTI_CHANNEL_GTM");
        campaign.setStatus("ACTIVE");
        campaign.setTargetPersona(dto.getTargetPersona() != null ? dto.getTargetPersona() : "VP of Growth & Decision Makers");

        AiService aiService = aiServiceFactory.getActiveAiService();

        if (aiService != null && aiService.isAvailable()) {
            try {
                log.info("Generating multi-channel marketing campaign via Globe AI: {}", aiService.getProviderName());
                String systemPrompt = """
                        You are Globe AI, a world-class growth copywriter and multi-channel marketing architect.
                        Generate a high-converting multi-channel marketing campaign in JSON format tailored to the product category (whether physical consumer goods, board game, toy, digital service, D2C brand, or B2B SaaS).
                        JSON Schema:
                        {
                          "assets": [
                            {
                              "assetType": "EMAIL_SEQUENCE",
                              "title": "Email 1: The Observation & Core Insight",
                              "channel": "Email / Newsletter",
                              "content": "Subject: ...\\n\\nBody: ..."
                            },
                            {
                              "assetType": "LINKEDIN_POST",
                              "title": "Social Thought Leadership / Founder Story Hook",
                              "channel": "LinkedIn / Professional Network",
                              "content": "..."
                            },
                            {
                              "assetType": "INSTAGRAM_CONTENT",
                              "title": "Viral Reel / Carousel Hook & Script",
                              "channel": "Instagram / TikTok",
                              "content": "..."
                            },
                            {
                              "assetType": "AD_COPY",
                              "title": "High-Intent Search & Paid Social Ads",
                              "channel": "Google / Meta / Retail Ads",
                              "content": "Headline: ...\\nPrimary Text: ...\\nCTA: ..."
                            },
                            {
                              "assetType": "PERSONALIZED_OUTREACH",
                              "title": "1:1 Signal-Grounded Outreach & Partnership Pitch",
                              "channel": "Email / DM / Partnership Outreach",
                              "content": "Hi {{FirstName}}, noticed your recent {{BuyingSignal}}..."
                            }
                          ]
                        }
                        Respond ONLY with valid JSON.
                        """;

                String userPrompt = String.format("""
                        Product: %s
                        Tagline: %s
                        Category: %s
                        Description: %s
                        Target Persona: %s
                        Specific Campaign Angle: %s
                        """,
                        product.getName(),
                        product.getTagline(),
                        product.getCategory(),
                        product.getDescription(),
                        campaign.getTargetPersona(),
                        dto.getCustomAngle() != null ? dto.getCustomAngle() : "Signal-driven acceleration"
                );

                String jsonResponse = aiService.generateContent(systemPrompt, userPrompt);
                JsonNode root = objectMapper.readTree(jsonResponse);
                JsonNode assetsArray = root.path("assets");

                if (assetsArray.isArray() && !assetsArray.isEmpty()) {
                    for (JsonNode aNode : assetsArray) {
                        CampaignAsset asset = new CampaignAsset();
                        asset.setCampaign(campaign);
                        asset.setAssetType(aNode.path("assetType").asText("EMAIL_SEQUENCE"));
                        asset.setTitle(aNode.path("title").asText("Campaign Asset"));
                        asset.setChannel(aNode.path("channel").asText("Multi-channel"));
                        asset.setContent(aNode.path("content").asText(""));
                        campaign.getAssets().add(asset);
                    }
                } else {
                    populateDefaultAssets(campaign, product);
                }

            } catch (Exception e) {
                log.warn("AI campaign generation error ({}), generating battle-tested campaign templates", e.getMessage());
                populateDefaultAssets(campaign, product);
            }
        } else {
            log.info("Generating battle-tested campaign templates for product: {}", product.getName());
            populateDefaultAssets(campaign, product);
        }

        Campaign saved = campaignRepository.save(campaign);
        return CampaignResponseDto.fromEntity(saved);
    }

    private void populateDefaultAssets(Campaign campaign, Product product) {
        // Asset 1: Cold Email Sequence
        CampaignAsset email = new CampaignAsset();
        email.setCampaign(campaign);
        email.setAssetType("EMAIL_SEQUENCE");
        email.setTitle("3-Step Signal-Based Email Sequence");
        email.setChannel("Email");
        email.setContent(String.format("""
                [STEP 1: THE RELEVANCE HOOK]
                Subject: Quick observation on {{Company}}'s %s roadmap
                
                Hi {{FirstName}},
                
                Noticed your recent expansion signal in %s. Most growth teams scaling at this stage run into the same bottleneck: manual pipeline friction and rising CAC.
                
                We built %s to solve exactly this — giving your team automated intelligence to discover high-intent buyers and win customers without cold database spam.
                
                Worth a brief 7-minute look this Thursday?
                
                Best,
                {{SenderName}}
                
                ---
                
                [STEP 2: SOCIAL PROOF FOLLOW-UP - 3 DAYS LATER]
                Subject: Re: Quick observation on {{Company}}'s %s roadmap
                
                Hi {{FirstName}},
                
                Sharing a quick metric: teams adopting %s are identifying buying signals 3x faster while cutting cost-per-lead by 42%%.
                
                Here's a 90-second walkthrough: {{DemoLink}}
                
                Would love to share how this applies to {{Company}}.
                
                ---
                
                [STEP 3: THE SOFT BREAKUP]
                Subject: Permission to close the loop?
                
                Hi {{FirstName}},
                
                I know priorities shift fast. If fixing pipeline efficiency isn't on {{Company}}'s immediate roadmap, no worries at all.
                
                Whenever you're ready to explore signal-driven customer acquisition, feel free to reply.
                """,
                product.getCategory(),
                product.getCategory(),
                product.getName(),
                product.getCategory(),
                product.getName()
        ));
        campaign.getAssets().add(email);

        // Asset 2: LinkedIn Thought Leadership Post
        CampaignAsset linkedin = new CampaignAsset();
        linkedin.setCampaign(campaign);
        linkedin.setAssetType("LINKEDIN_POST");
        linkedin.setTitle("Viral LinkedIn Authority Post");
        linkedin.setChannel("LinkedIn");
        linkedin.setContent(String.format("""
                Stop blasting 5,000 generic emails to stale ZoomInfo lists.
                
                In 2026, buyers don't ignore cold outreach because they're busy.
                They ignore it because it's completely tone-deaf to what they're actually experiencing.
                
                Here is the playbook the top 1%% of GTM teams are using today:
                
                1. 𝗧𝗿𝗮𝗰𝗸 𝗥𝗲𝗮𝗹 𝗪𝗲𝗯 𝗦𝗶𝗴𝗻𝗮𝗹𝘀: Hiring surges, tech stack churn, funding milestones.
                2. 𝗧𝗶𝗺𝗲 𝘁𝗵𝗲 𝗖𝗼𝗻𝘃𝗲𝗿𝘀𝗮𝘁𝗶𝗼𝗻: Reach out when the pain point is actively acute.
                3. 𝗦𝗽𝗲𝗮𝗸 𝘁𝗼 𝘁𝗵𝗲 𝗨𝗻𝗶𝗾𝘂𝗲 𝗦𝗼𝗹𝘂𝘁𝗶𝗼𝗻: Replace boilerplate features with verified relevance.
                
                That's why we created %s.
                
                Understand your market. Discover your buyers. Win more customers.
                
                Are you still relying on static lists, or are you listening to real market signals? 👇
                
                #GrowthHacking #B2BMarketing #OutboundSales #SaaS
                """, product.getName()));
        campaign.getAssets().add(linkedin);

        // Asset 3: Paid Ad Copy
        CampaignAsset ads = new CampaignAsset();
        ads.setCampaign(campaign);
        ads.setAssetType("AD_COPY");
        ads.setTitle("High-Conversion Ad Copy (Google & LinkedIn)");
        ads.setChannel("Paid Media");
        ads.setContent(String.format("""
                [GOOGLE SEARCH AD]
                Headline 1: %s — Intelligent Buyer Discovery
                Headline 2: Never Buy Stale B2B Lists Again
                Headline 3: Win High-Value Customers Faster
                Description: Discover active buying signals across the web. Turn public market triggers into booked meetings with %s. Start free today.
                CTA: Start Free Trial
                
                [LINKEDIN SPONSORED CONTENT]
                Primary Text: Tired of burning ad spend on unverified prospects? %s automatically discovers companies actively evaluating solutions in %s. Ground every campaign in verifiable facts.
                Headline: See The Signal. Win The Market.
                CTA Button: Get Instant Access
                """,
                product.getName(),
                product.getName(),
                product.getName(),
                product.getCategory()
        ));
        campaign.getAssets().add(ads);

        // Asset 4: 1:1 Signal Outreach
        CampaignAsset outreach = new CampaignAsset();
        outreach.setCampaign(campaign);
        outreach.setAssetType("PERSONALIZED_OUTREACH");
        outreach.setTitle("1:1 Signal-Grounded Personal Outreach");
        outreach.setChannel("Direct InMail / Email");
        outreach.setContent(String.format("""
                Hi {{DecisionMakerName}},
                
                Saw {{Company}}'s public announcement regarding {{BuyingSignalHeadline}} ({{SourceUrl}}).
                
                When companies hit this transition, scaling pipeline without inflating team headcount is usually the hardest friction point.
                
                We built %s specifically to automate buyer discovery and market intelligence for teams in %s.
                
                I put together 3 specific buyer personas actively seeking alternatives in your space right now. Could I send that over?
                
                Best,
                {{YourName}}
                """, product.getName(), product.getCategory()));
        campaign.getAssets().add(outreach);
    }

    @Transactional
    public void deleteCampaign(String campaignId, String userId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("Campaign not found: " + campaignId));
        productService.getProductEntity(campaign.getProduct().getId(), userId); // verify ownership
        campaignRepository.delete(campaign);
    }
}

