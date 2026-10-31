export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  category: string;
  websiteUrl?: string;
  pricingModel?: string;
  targetGeography?: string;
  createdAt: string;
}

export interface Persona {
  id?: string;
  title: string;
  seniorityLevel: string;
  painPoints: string[];
  buyingTriggers: string[];
  objections: string[];
  fitScore: number;
}

export interface Competitor {
  id?: string;
  name: string;
  website?: string;
  strengths: string[];
  weaknesses: string[];
  ourDifferentiation: string;
}

export interface ProductIntelligence {
  id?: string;
  productId: string;
  valueProposition: string;
  targetMarketSummary: string;
  uspAnalysis: string;
  blueOceanOpportunities: string[];
  personas: Persona[];
  competitors: Competitor[];
  marketReadinessScore: number;
  isLiveAi?: boolean;
  aiProviderUsed?: string;
}

export interface BuyingSignal {
  id?: string;
  signalType: string;
  headline: string;
  evidenceSnippet: string;
  sourceUrl: string;
  signalDate: string;
  confidenceScore: number;
  isVerifiedFact: boolean;
}

export interface DecisionMakerRole {
  roleTitle: string;
  department: string;
  responsibilityScope: string;
  publicEvidenceFound: boolean;
}

export interface DiscoveredLead {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  companySize: string;
  relevanceScore: number;
  relevanceRationale: string;
  isVerified: boolean;
  signals: BuyingSignal[];
  decisionMakerRoles: DecisionMakerRole[];
  createdAt: string;
}

export interface CampaignAsset {
  id?: string;
  assetType: 'EMAIL_SEQUENCE' | 'LINKEDIN_POST' | 'INSTAGRAM_CONTENT' | 'AD_COPY' | 'PERSONALIZED_OUTREACH';
  title: string;
  content: string;
  channel?: string;
  metadata?: Record<string, any>;
}

export interface Campaign {
  id: string;
  productId: string;
  title: string;
  campaignType: string;
  status: string;
  targetPersona?: string;
  assets: CampaignAsset[];
  createdAt: string;
}

export interface NewsSnippet {
  title: string;
  url: string;
  snippet: string;
  publishedDate: string;
  source?: string;
  category?: string;
  impactScore?: number;
  impactTag?: string;
}

export interface ChatAttachment {
  name: string;
  size: string;
  type: string;
  previewUrl?: string;
  textSnippet?: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: ChatAttachment[];
  marketNews?: NewsSnippet[];
  suggestedFollowUps?: string[];
  timestamp: string;
}

export interface CopilotChatResponse {
  reply: string;
  aiProvider: string;
  marketNews: NewsSnippet[];
  suggestedFollowUps: string[];
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
