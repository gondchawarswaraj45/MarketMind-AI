package com.marketmind;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketmind.ai.AiServiceFactory;
import com.marketmind.auth.model.Role;
import com.marketmind.auth.model.User;
import com.marketmind.automation.dto.CampaignRequestDto;
import com.marketmind.automation.dto.CampaignResponseDto;
import com.marketmind.automation.model.Campaign;
import com.marketmind.automation.repository.CampaignRepository;
import com.marketmind.automation.service.MarketingAutomationService;
import com.marketmind.discovery.dto.DiscoveryResponseDto;
import com.marketmind.discovery.model.BuyerSearch;
import com.marketmind.discovery.repository.BuyerSearchRepository;
import com.marketmind.discovery.service.BuyerDiscoveryService;
import com.marketmind.discovery.service.TavilySearchClient;
import com.marketmind.intelligence.dto.AnalysisResponseDto;
import com.marketmind.intelligence.model.ProductAnalysis;
import com.marketmind.intelligence.repository.ProductAnalysisRepository;
import com.marketmind.intelligence.service.ProductIntelligenceService;
import com.marketmind.product.model.Product;
import com.marketmind.product.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EngineServicesTest {

    @Mock
    private ProductService productService;

    @Mock
    private ProductAnalysisRepository analysisRepository;

    @Mock
    private BuyerSearchRepository searchRepository;

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private TavilySearchClient tavilyClient;

    @Mock
    private AiServiceFactory aiServiceFactory;

    private ObjectMapper objectMapper = new ObjectMapper();

    private Product sampleProduct;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        sampleUser = new User("founder@marketmind.ai", "hash", "Founder", Role.ROLE_USER);
        sampleUser.setId("user-1");

        sampleProduct = new Product(
                sampleUser,
                "OmniFlow AI",
                "AI agent orchestration",
                "Observability and failure recovery for autonomous agents",
                "Developer Tool",
                "https://omniflow.dev",
                "Subscription",
                "North America"
        );
        sampleProduct.setId("prod-1");

        when(productService.getProductEntity("prod-1", "user-1")).thenReturn(sampleProduct);
        when(aiServiceFactory.getActiveAiService()).thenReturn(null);
        when(tavilyClient.isAvailable()).thenReturn(false);
    }

    @Test
    void productIntelligence_WhenGenerated_ShouldSynthesizePersonasAndCompetitors() {
        ProductIntelligenceService service = new ProductIntelligenceService(
                analysisRepository, productService, aiServiceFactory, objectMapper
        );

        when(analysisRepository.findByProductId("prod-1")).thenReturn(Optional.empty());
        when(analysisRepository.save(any(ProductAnalysis.class))).thenAnswer(i -> {
            ProductAnalysis pa = i.getArgument(0);
            pa.setId("pa-1");
            return pa;
        });

        AnalysisResponseDto result = service.generateIntelligence("prod-1", "user-1");

        assertNotNull(result);
        assertEquals("prod-1", result.getProductId());
        assertFalse(result.getPersonas().isEmpty(), "Should generate target personas");
        assertFalse(result.getCompetitors().isEmpty(), "Should identify competitors");
        assertTrue(result.getMarketReadinessScore() >= 80);
    }

    @Test
    void buyerDiscovery_ShouldCalculateRelevanceAndProduceGroundedSignals() {
        BuyerDiscoveryService service = new BuyerDiscoveryService(
                searchRepository, productService, tavilyClient
        );

        when(searchRepository.save(any(BuyerSearch.class))).thenAnswer(i -> {
            BuyerSearch bs = i.getArgument(0);
            bs.setId("bs-1");
            return bs;
        });

        DiscoveryResponseDto result = service.executeDiscovery("prod-1", "user-1", "looking for agent evaluation");

        assertNotNull(result);
        assertFalse(result.getLeads().isEmpty(), "Should discover accounts");
        assertTrue(result.getLeads().get(0).getRelevanceScore() >= 80, "Lead score should be >= 80");
        assertFalse(result.getLeads().get(0).getSignals().isEmpty(), "Lead should be backed by buying signals");
        assertNotNull(result.getLeads().get(0).getSignals().get(0).getSourceUrl(), "Signal must have source URL");
    }

    @Test
    void marketingAutomation_ShouldGenerateMultiChannelAssets() {
        MarketingAutomationService service = new MarketingAutomationService(
                campaignRepository, productService, aiServiceFactory, objectMapper
        );

        when(campaignRepository.save(any(Campaign.class))).thenAnswer(i -> {
            Campaign c = i.getArgument(0);
            c.setId("camp-1");
            return c;
        });

        CampaignRequestDto req = new CampaignRequestDto();
        req.setTitle("Q1 Outbound Motion");
        req.setCampaignType("MULTI_CHANNEL_GTM");

        CampaignResponseDto result = service.generateCampaign("prod-1", "user-1", req);

        assertNotNull(result);
        assertEquals("Q1 Outbound Motion", result.getTitle());
        assertTrue(result.getAssets().size() >= 3, "Campaign should generate multiple channel assets");
    }
}

