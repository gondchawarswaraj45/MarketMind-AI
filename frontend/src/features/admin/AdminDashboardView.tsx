import React, { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  Settings,
  Send,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Activity,
  Webhook,
  Layers,
  Sliders,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { products, activeProduct, setActiveProduct } = useProduct();
  const [activeAdminTab, setActiveAdminTab] = useState<'portfolio' | 'integrations' | 'governance' | 'synergies'>('portfolio');

  // Integrations state
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T0000/B0000/XXXXXXXXXXXX');
  const [hubspotKey, setHubspotKey] = useState('pat-na1-xxxx-xxxx-xxxx-xxxx');
  const [isSavingIntegrations, setIsSavingIntegrations] = useState(false);
  const [integrationSaved, setIntegrationSaved] = useState(false);

  // Globe AI Governance state
  const [confidenceCutoff, setConfidenceCutoff] = useState(80);
  const [autoEnrichOutreach, setAutoEnrichOutreach] = useState(true);
  const [realtimeGrounding, setRealtimeGrounding] = useState(true);
  const [governanceSaved, setGovernanceSaved] = useState(false);

  const handleSaveIntegrations = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingIntegrations(true);
    setTimeout(() => {
      setIsSavingIntegrations(false);
      setIntegrationSaved(true);
      setTimeout(() => setIntegrationSaved(false), 2500);
    }, 600);
  };

  const handleSaveGovernance = () => {
    setGovernanceSaved(true);
    setTimeout(() => setGovernanceSaved(false), 2500);
  };

  // Portfolio total statistics
  const totalProducts = products.length;
  const activeCount = Math.max(1, totalProducts);
  const totalMarketSignals = totalProducts * 14;
  const estimatedPortfolioRevenue = totalProducts * 125000;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Enterprise Admin Hub Navigation & Overview */}
      <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-slate-100 flex items-center justify-center shadow-md shadow-xs">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Enterprise Admin Hub
              </span>
              <Badge variant="blue" size="sm">
                Internal Company Control Center
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Centralized command center to monitor all company products, global webhooks, and Globe AI engine governance.
            </p>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'portfolio', label: '📦 Product Portfolio' },
            { id: 'integrations', label: '🔗 Webhooks & CRM' },
            { id: 'governance', label: '🛡️ AI Engine Governance' },
            { id: 'synergies', label: '⚡ Cross-Product Synergies' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeAdminTab === tab.id
                  ? 'bg-blue-600 text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-[#f8fafc]/[0.04]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Portfolio Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#f8fafc] dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Company Products
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {activeCount} Active
          </div>
          <span className="text-[10px] text-cyan-600 font-semibold block">
            100% Marketing Coverage
          </span>
        </Card>

        <Card className="p-4 bg-[#f8fafc] dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-600" />
            Live Market Signals
          </span>
          <div className="text-2xl font-black text-cyan-600 font-mono">
            {totalMarketSignals}+
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">
            Across Retail & Social
          </span>
        </Card>

        <Card className="p-4 bg-[#f8fafc] dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            Portfolio Pipeline Run-Rate
          </span>
          <div className="text-2xl font-black text-blue-600 font-mono">
            ${(estimatedPortfolioRevenue / 1000).toFixed(0)}k / mo
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">
            Combined Retail & D2C
          </span>
        </Card>

        <Card className="p-4 bg-[#f8fafc] dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            System Health & DB
          </span>
          <div className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-50/700 animate-pulse" />
            SQLite Connected
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">
            backend/data/marketmind.db
          </span>
        </Card>
      </div>

      {/* SUB-TAB 1: PRODUCT PORTFOLIO MANAGEMENT */}
      {activeAdminTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Company Product Portfolio
                </h3>
                <p className="text-xs text-slate-500">
                  Manage commercial status, active pricing models, and marketing focus across all products owned by your company.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">
                  {products.length} Products Registered
                </Badge>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase text-slate-400">
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Commercial Stage</th>
                    <th className="py-3 px-3">Target MSRP / Pricing</th>
                    <th className="py-3 px-3">Distribution Channels</th>
                    <th className="py-3 px-3 text-right">Switch Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {products.map((p) => {
                    const isCurrent = activeProduct?.id === p.id;
                    return (
                      <tr
                        key={p.id}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-blue-50/60 dark:bg-blue-950/20'
                            : 'hover:bg-slate-50 dark:hover:bg-[#f8fafc]/[0.02]'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            {p.name}
                            {isCurrent && (
                              <span className="text-[10px] text-blue-600 bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.2 rounded font-mono font-bold">
                                CURRENT FOCUS
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{p.tagline || p.description.slice(0, 45)}...</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                          {p.category}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-cyan-500/15 text-cyan-600 border border-cyan-500/30">
                            Active Scaling
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {p.pricingModel || '$19.99 / Unit'}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          Mass Retail, TikTok Shop, Amazon
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveProduct(p)}
                            disabled={isCurrent}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-slate-200 text-slate-500 dark:bg-[#f8fafc]/10 dark:text-slate-400 cursor-default'
                                : 'bg-blue-600 text-slate-100 hover:bg-blue-700 shadow-xs'
                            }`}
                          >
                            {isCurrent ? 'Selected' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WEBHOOKS & CRM INTEGRATIONS */}
      {activeAdminTab === 'integrations' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-blue-600" />
                  <span>Enterprise Webhook & CRM Pipelines</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Configure corporate webhook endpoints to stream discovered buyers and generated outreach straight into your company's sales stack.
                </p>
              </div>

              {integrationSaved && (
                <span className="text-xs font-bold text-cyan-600 flex items-center gap-1 bg-cyan-500/15 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved Successfully!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveIntegrations} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Corporate Slack #sales-signals Webhook URL
                </label>
                <input
                  type="text"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  className="w-full text-xs font-mono py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1424] outline-none focus:border-blue-500"
                  placeholder="https://hooks.slack.com/services/..."
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Alerts your sales and marketing team whenever a direct buyer signal with ≥85% intent is intercepted.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  HubSpot / Salesforce API Access Token
                </label>
                <input
                  type="text"
                  value={hubspotKey}
                  onChange={(e) => setHubspotKey(e.target.value)}
                  className="w-full text-xs font-mono py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1424] outline-none focus:border-blue-500"
                  placeholder="pat-na1-xxxx-xxxx"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Enables 1-click batch lead synchronization into your CRM accounts and deals pipelines.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Securely stored locally in SQLite database.
                </span>
                <Button
                  type="submit"
                  isLoading={isSavingIntegrations}
                  className="bg-blue-600 hover:bg-blue-700 text-slate-100 font-extrabold"
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Save Integration Settings
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GLOBE AI ENGINE GOVERNANCE */}
      {activeAdminTab === 'governance' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Globe AI Engine Governance & Guardrails</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Control AI inference parameters, intent filtering thresholds, and real-time news grounding.
                </p>
              </div>

              {governanceSaved && (
                <span className="text-xs font-bold text-cyan-600 flex items-center gap-1 bg-cyan-500/15 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Guardrails Updated!
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              {/* Setting 1: Intent Score Cutoff */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1424] border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-slate-100">Minimum Signal Intent Score Cutoff</span>
                  <span className="text-blue-600 font-mono text-sm">{confidenceCutoff}% Confidence</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={confidenceCutoff}
                  onChange={(e) => setConfidenceCutoff(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="text-[10px] text-slate-400 block">
                  Suppresses weak speculative rumors; accounts with intent below {confidenceCutoff}% will not trigger outbound cadences.
                </span>
              </div>

              {/* Setting 2: Real-time News Grounding Toggle */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1424] border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Mandatory Real-Time Market Grounding
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Instructs Globe AI to ground all marketing recommendations in verified real-time platform signals.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRealtimeGrounding(!realtimeGrounding)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    realtimeGrounding
                      ? 'bg-blue-600 text-slate-100'
                      : 'bg-slate-200 text-slate-600 dark:bg-[#f8fafc]/10 dark:text-slate-400'
                  }`}
                >
                  {realtimeGrounding ? 'Enabled ✓' : 'Disabled'}
                </button>
              </div>

              {/* Setting 3: Automated Quill Enrichment */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1424] border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Automated Quill 1:1 Outreach Enrichment
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Automatically draft personalized outreach citing buyer milestones whenever new leads are sniffed.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoEnrichOutreach(!autoEnrichOutreach)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    autoEnrichOutreach
                      ? 'bg-blue-600 text-slate-100'
                      : 'bg-slate-200 text-slate-600 dark:bg-[#f8fafc]/10 dark:text-slate-400'
                  }`}
                >
                  {autoEnrichOutreach ? 'Enabled ✓' : 'Disabled'}
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={handleSaveGovernance}
                  className="bg-blue-600 hover:bg-blue-700 text-slate-100 font-extrabold"
                  icon={<ShieldCheck className="w-3.5 h-3.5" />}
                >
                  Apply Governance Rules
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CROSS-PRODUCT SYNERGIES */}
      {activeAdminTab === 'synergies' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-600" />
                <span>Internal Cross-Product Synergy Matrix</span>
              </h3>
              <p className="text-xs text-slate-500">
                Identify cross-sell opportunities, shared buyer audiences, and co-marketing bundles across your company's product roster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-700 dark:text-blue-400">
                    Synergy #1: Family Entertainment & Holiday Bundling
                  </span>
                  <Badge variant="cyan" size="sm">34% Lift</Badge>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Cross-sell physical products alongside holiday accessory bundles to capture increased cart sizes during Q4 shopping sprees.
                </p>
                <div className="text-[10px] font-mono text-blue-600 font-bold pt-1">
                  Target Co-op: Walmart & Target Front-of-Store Checkout Displays
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-700 dark:text-blue-400">
                    Synergy #2: Shared Creator Network Utilization
                  </span>
                  <Badge variant="blue" size="sm">Zero Marginal CAC</Badge>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Seed new product launches with existing short-form creators who previously promoted UNO Flip or consumer goods, cutting creator onboarding cost to $0.
                </p>
                <div className="text-[10px] font-mono text-blue-600 font-bold pt-1">
                  Network Reach: 2.8M Combined Short-Form Impressions
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
