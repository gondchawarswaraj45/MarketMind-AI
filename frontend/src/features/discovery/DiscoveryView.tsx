import React, { useState, useEffect } from 'react';
import { useProduct } from '../../context/ProductContext';
import type { DiscoveredLead, ApiResponse } from '../../types';
import apiClient from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Compass,
  ShieldCheck,
  Zap,
  Download,
  Send,
  Copy,
  Check,
  Target,
  Crosshair,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
} from 'lucide-react';

export const DiscoveryView: React.FC = () => {
  const { activeProduct } = useProduct();
  const [leads, setLeads] = useState<DiscoveredLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLead, setSelectedLead] = useState<DiscoveredLead | null>(null);

  // Active sub-tab inside Discovery
  const [activeSubTab, setActiveSubTab] = useState<'radar' | 'timeline' | 'urgency' | 'salesIntel' | 'icpDeck' | 'automations'>('radar');

  // Radar display mode: Graphical Polar Radar vs Pinned Clue Grid
  const [radarDisplayMode, setRadarDisplayMode] = useState<'graphical' | 'grid'>('graphical');

  // Profiler form state
  const [profilerScope, setProfilerScope] = useState<'direct' | 'broad'>('direct');
  const [productFocusQuery, setProductFocusQuery] = useState('');
  const [categoryKeywords, setCategoryKeywords] = useState('');

  // Webhook and dispatch states
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T0000/B0000/XXXXXXXXXXXX');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Quill instant outreach modal
  const [quillModalLead, setQuillModalLead] = useState<DiscoveredLead | null>(null);
  const [quillDraft, setQuillDraft] = useState('');
  const [isQuillCopied, setIsQuillCopied] = useState(false);

  const fetchDiscovery = async () => {
    if (!activeProduct) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `/products/${activeProduct.id}/discovery`
      );
      const data = response.data.data;
      const fetchedLeads: DiscoveredLead[] = data.leads || [];
      setLeads(fetchedLeads);
      if (fetchedLeads.length > 0) {
        setSelectedLead(fetchedLeads[0]);
      }
    } catch (err) {
      console.error('Failed to load discovery data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeProduct) return;
    setIsSearching(true);
    try {
      const combinedQuery = `${productFocusQuery} ${categoryKeywords} mode:${profilerScope}`.trim();
      const response = await apiClient.post<ApiResponse<any>>(
        `/products/${activeProduct.id}/discovery/search`,
        { customIntentQuery: combinedQuery }
      );
      const data = response.data.data;
      const fetchedLeads: DiscoveredLead[] = data.leads || [];
      setLeads(fetchedLeads);
      if (fetchedLeads.length > 0) {
        setSelectedLead(fetchedLeads[0]);
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (activeProduct) {
      setProductFocusQuery(activeProduct.name);
      setCategoryKeywords(activeProduct.category || '');
      fetchDiscovery();
    }
  }, [activeProduct?.id]);

  // Quill message generator
  const handleOpenQuill = (lead: DiscoveredLead) => {
    setQuillModalLead(lead);
    const primarySignal = lead.signals && lead.signals.length > 0 ? lead.signals[0] : null;
    const targetRole = lead.decisionMakerRoles && lead.decisionMakerRoles.length > 0 
      ? lead.decisionMakerRoles[0].roleTitle 
      : 'Head of Growth / Marketing';

    const draft = `Subject: Regarding ${primarySignal?.headline || lead.companyName}'s current expansion

Hi ${targetRole ? targetRole.split(' ')[0] : 'there'},

Noticed that ${lead.companyName} is actively ${
      primarySignal?.headline
        ? primarySignal.headline.toLowerCase()
        : `scaling procurement and inventory in ${activeProduct?.category || 'this market'}`
    }.

${
  primarySignal?.evidenceSnippet
    ? `From public data: "${primarySignal.evidenceSnippet.slice(0, 160)}..."`
    : ''
}

We engineered ${activeProduct ? activeProduct.name : 'our product'} specifically to solve this bottleneck with high-converting customer demand.

Would a 5-minute preview or sample presentation be helpful for your team this week?

Best regards,
Enterprise Growth Director at ${activeProduct ? activeProduct.name : 'our team'}`;

    setQuillDraft(draft);
  };

  const handleCopyQuill = () => {
    navigator.clipboard.writeText(quillDraft);
    setIsQuillCopied(true);
    setTimeout(() => setIsQuillCopied(false), 2000);
  };

  const handleTestDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchSuccess(true);
      setTimeout(() => setDispatchSuccess(false), 3000);
    }, 700);
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headers = ['Company Name', 'Domain', 'Relevance Score', 'Industry', 'Company Size', 'Primary Signal', 'Decision Maker'];
    const rows = leads.map((l) => [
      `"${l.companyName}"`,
      `"${l.domain}"`,
      `"${l.relevanceScore}%"`,
      `"${l.industry}"`,
      `"${l.companySize}"`,
      `"${l.signals?.[0]?.headline?.replace(/"/g, '""') || ''}"`,
      `"${l.decisionMakerRoles?.[0]?.roleTitle?.replace(/"/g, '""') || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pipeline_buyers_${activeProduct?.name || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    if (leads.length === 0) return;
    const jsonStr = JSON.stringify(leads, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline_buyers_${activeProduct?.name || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const directSignalsCount = leads.filter(l => l.relevanceScore >= 85).length;
  const broadSignalsCount = Math.max(1, leads.length - directSignalsCount);
  const hotCount = leads.filter(l => l.relevanceScore >= 80).length;

  // Polar Coordinate Math for Graphical Radar Sweep
  // Radius mapping: higher fit score = closer to center (score 100 -> r=45, score 70 -> r=195)
  const getRadarCoordinates = (index: number, total: number, score: number) => {
    const center = 220;
    const minR = 45;
    const maxR = 190;
    const normalizedScore = Math.max(65, Math.min(100, score));
    const r = maxR - ((normalizedScore - 65) / 35) * (maxR - minR);
    // Angle in radians: distribute evenly with an offset
    const angle = (index * (360 / Math.max(1, total)) + 30) * (Math.PI / 180);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, r, angleDeg: Math.round((angle * 180) / Math.PI) % 360 };
  };

  if (!activeProduct) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12">
        <Compass className="w-10 h-10 mx-auto text-slate-400 mb-2" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Product Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Select a company product to view buyer signals.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Bar: Sub-Nav Tabs & Counters */}
      <div className="p-3.5 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: 'radar', label: '📡 Signal Radar' },
            { id: 'salesIntel', label: '💰 Sales & Distribution' },
            { id: 'timeline', label: '▦ Matrix & Timeline' },
            { id: 'urgency', label: '⭐ Urgency Matrix' },
            { id: 'icpDeck', label: '🛡️ Target Audience & ICP' },
            { id: 'automations', label: '<> Automations & CRM' },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-[#f8fafc]/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Counters Badges on Right */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#f8fafc]/[0.06] text-slate-700 dark:text-slate-300">
            SIGNALS: <strong className="text-blue-600 dark:text-blue-400">{leads.length}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
            DIRECT: <strong>{directSignalsCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            BROAD: <strong>{broadSignalsCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            HOT (≥80%): <strong>{hotCount}</strong>
          </span>
        </div>
      </div>

      {/* Main Split Grid: Left Column Profiler & Right Main Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: MARKETING JOURNEY PROFILER (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-white/[0.06] pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                MARKETING JOURNEY PROFILER
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                Dynamic Buyer Discovery Engine
              </h3>
            </div>

            {/* Scope Toggles */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => setProfilerScope('direct')}
                className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                  profilerScope === 'direct'
                    ? 'bg-[#f8fafc] dark:bg-[#0e1424] text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Direct Product Focus
              </button>
              <button
                type="button"
                onClick={() => setProfilerScope('broad')}
                className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                  profilerScope === 'broad'
                    ? 'bg-[#f8fafc] dark:bg-[#0e1424] text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Broad Category Scope
              </button>
            </div>

            {/* Inputs */}
            <form onSubmit={handleRunSearch} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Product / Service Name
                </label>
                <input
                  type="text"
                  value={productFocusQuery}
                  onChange={(e) => setProductFocusQuery(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1424] outline-none focus:border-blue-500 font-medium"
                  placeholder="e.g. UNO Flip, OmniFlow AI..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Target Market / Category Keywords
                </label>
                <input
                  type="text"
                  value={categoryKeywords}
                  onChange={(e) => setCategoryKeywords(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1424] outline-none focus:border-blue-500"
                  placeholder="e.g. board game, family night, retail..."
                />
              </div>

              <Button
                type="submit"
                isLoading={isSearching}
                className="w-full bg-blue-600 hover:bg-blue-700 text-slate-100 font-extrabold"
                icon={<Zap className="w-4 h-4" />}
              >
                ▷ Sniff & Scout
              </Button>
            </form>

            {/* Teammates Status Pills */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 dark:border-white/[0.06] text-[10px] font-bold">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-center border border-amber-500/20">
                SN Sniff Ready
              </span>
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-center border border-cyan-500/20">
                SC Scout Ready
              </span>
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-center border border-rose-500/20">
                QL Quill Ready
              </span>
            </div>
          </div>

          {/* Intercepted Live Signal Stream */}
          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Scout • Real-Time Signal Stream
            </span>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-[#0e1424] border border-blue-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">
                  [DIRECT - EXPANSION] Barnes & Noble Inc.
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                  Expanding game inventory space in East Coast distribution centers.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-50/60 dark:bg-[#0e1424] border border-cyan-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
                  [DIRECT - HIRING] Tru Kids Inc.
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                  Recruiting Senior Merchandising Director for physical and family toys.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-[#0e1424] border border-rose-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400">
                  [QUILL - OUTREACH] Prepared 3 Touches
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                  Drafted 1:1 outreach hooks referencing warehouse growth milestones.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Dynamic Canvas based on activeSubTab (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: SIGNAL RADAR (With Graphical Polar Sweep Canvas) */}
          {activeSubTab === 'radar' && (
            <div className="space-y-4">
              {/* Header with Display Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-blue-600" />
                    <span>WHO'S BUYING? • Graphical Signal Radar</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Polar coordinate buyer radar: accounts plotted by intent score distance from the core.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-xl bg-slate-100 dark:bg-[#f8fafc]/[0.05] border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-xs font-bold">
                    <button
                      onClick={() => setRadarDisplayMode('graphical')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        radarDisplayMode === 'graphical'
                          ? 'bg-blue-600 text-slate-100 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      🎯 Radar Scope
                    </button>
                    <button
                      onClick={() => setRadarDisplayMode('grid')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        radarDisplayMode === 'grid'
                          ? 'bg-blue-600 text-slate-100 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      ▦ Clue Cards
                    </button>
                  </div>

                  <Button size="sm" onClick={handleExportCsv} variant="outline" icon={<Download className="w-3.5 h-3.5" />}>
                    Export
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="p-16 text-center space-y-3 bg-[#f8fafc] dark:bg-[#131b2e] rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Scout is executing 360° signal radar sweep...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-12 text-center space-y-3 bg-[#f8fafc] dark:bg-[#131b2e] rounded-2xl border border-slate-200">
                  <Compass className="w-8 h-8 mx-auto text-slate-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">No Clues Detected on Radar</h4>
                  <p className="text-xs text-slate-400">Click 'Sniff & Scout' in the left profiler to initiate radar scanning.</p>
                </div>
              ) : radarDisplayMode === 'graphical' ? (
                /* GRAPHICAL POLAR RADAR CANVAS & TARGET LOCK HUD */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center p-4 sm:p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm">
                  {/* SVG Polar Radar Sweep (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
                    <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] max-w-full aspect-square">
                      {/* SVG Canvas */}
                      <svg viewBox="0 0 440 440" className="w-full h-full overflow-visible select-none">
                        <defs>
                          {/* Sweeping Radar Beam Gradient */}
                          <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Outer Radar Disc */}
                        <circle cx="220" cy="220" r="215" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                        
                        {/* Concentric Range Rings with Labels */}
                        {/* 70% Outer Ring */}
                        <circle cx="220" cy="220" r="190" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.25" />
                        <text x="225" y="38" fill="#0284c7" fontSize="9" fontWeight="bold" opacity="0.8">70% DETECTION RANGE</text>

                        {/* 85% Mid Ring */}
                        <circle cx="220" cy="220" r="125" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="3 3" />
                        <text x="225" y="102" fill="#0284c7" fontSize="9" fontWeight="bold" opacity="0.9">85% WARM PIPELINE</text>

                        {/* 95% Core Intent Zone */}
                        <circle cx="220" cy="220" r="55" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" />
                        <text x="225" y="172" fill="#10b981" fontSize="9" fontWeight="bold">95% HOT CORE</text>

                        {/* Crosshairs Reticle */}
                        <line x1="20" y1="220" x2="420" y2="220" stroke="#0284c7" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="2 4" />
                        <line x1="220" y1="20" x2="220" y2="420" stroke="#0284c7" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="2 4" />

                        {/* Rotating Radar Sweep Line */}
                        <g className="origin-[220px_220px] animate-spin" style={{ animationDuration: '6s', animationTimingFunction: 'linear' }}>
                          <path
                            d="M 220 220 L 220 5 A 215 215 0 0 1 372 68 Z"
                            fill="url(#sweepGradient)"
                          />
                          <line x1="220" y1="220" x2="220" y2="5" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.8" />
                        </g>

                        {/* Center Beacon */}
                        <circle cx="220" cy="220" r="4" fill="#0284c7" />
                        <circle cx="220" cy="220" r="8" fill="none" stroke="#0284c7" strokeWidth="1" opacity="0.6" />

                        {/* Plotted Lead Target Blips */}
                        {leads.map((lead, idx) => {
                          const coords = getRadarCoordinates(idx, leads.length, lead.relevanceScore);
                          const isSelected = selectedLead?.id === lead.id;
                          const isHot = lead.relevanceScore >= 90;

                          return (
                            <g
                              key={lead.id}
                              className="cursor-pointer transition-transform hover:scale-125"
                              onClick={() => setSelectedLead(lead)}
                            >
                              {/* Pulsing Beacon Ring */}
                              <circle
                                cx={coords.x}
                                cy={coords.y}
                                r={isSelected ? '12' : '8'}
                                fill="none"
                                stroke={isHot ? '#10b981' : '#0284c7'}
                                strokeWidth="1.5"
                                opacity="0.75"
                                className={isSelected ? 'animate-ping' : ''}
                              />

                              {/* Solid Center Blip */}
                              <circle
                                cx={coords.x}
                                cy={coords.y}
                                r={isSelected ? '6' : '4.5'}
                                fill={isHot ? '#10b981' : '#0284c7'}
                              />

                              {/* Company Label Pin */}
                              <rect
                                x={coords.x + 8}
                                y={coords.y - 12}
                                width={Math.min(100, lead.companyName.length * 6.5 + 16)}
                                height="18"
                                rx="4"
                                fill={isSelected ? '#0f172a' : '#ffffff'}
                                stroke={isSelected ? '#0284c7' : '#cbd5e1'}
                                strokeWidth="1"
                                className="shadow-xs"
                              />
                              <text
                                x={coords.x + 14}
                                y={coords.y}
                                fill={isSelected ? '#ffffff' : '#0f172a'}
                                fontSize="9"
                                fontWeight="bold"
                              >
                                {lead.companyName.slice(0, 14)}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-2 font-mono">
                      Click any target blip on radar scope to lock onto buyer profile
                    </span>
                  </div>

                  {/* Target Lock Reticle HUD (5 cols) */}
                  <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-[#131722] border border-blue-200 dark:border-slate-800 space-y-4 relative">
                    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-blue-600 animate-pulse" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
                          TARGET LOCK HUD
                        </span>
                      </div>
                      {selectedLead && (
                        <span className="text-[10px] font-mono font-bold text-cyan-600 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                          {selectedLead.relevanceScore}% MATCH
                        </span>
                      )}
                    </div>

                    {selectedLead ? (
                      <div className="space-y-3.5 text-xs">
                        {/* Company Details */}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                              {selectedLead.companyName}
                            </h4>
                            <ShieldCheck className="w-4 h-4 text-cyan-500" />
                          </div>
                          <span className="text-[11px] text-blue-600 font-mono">{selectedLead.domain}</span>
                        </div>

                        {/* Intent Clue Snippet */}
                        <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e1424] border border-blue-100 dark:border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-amber-600 uppercase block">
                            Detected Catalyst Signal:
                          </span>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {selectedLead.signals?.[0]?.headline || selectedLead.relevanceRationale}
                          </p>
                        </div>

                        {/* Verified Quote Snippet */}
                        {selectedLead.signals?.[0]?.evidenceSnippet && (
                          <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 text-[11px] text-slate-600 dark:text-slate-400 italic">
                            "{selectedLead.signals[0].evidenceSnippet.slice(0, 150)}..."
                          </div>
                        )}

                        {/* Decision Maker Role */}
                        {selectedLead.decisionMakerRoles?.[0] && (
                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-slate-500">Target Role:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                              {selectedLead.decisionMakerRoles[0].roleTitle}
                            </span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2 flex items-center gap-2">
                          <Button
                            onClick={() => handleOpenQuill(selectedLead)}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-slate-100 font-bold"
                            icon={<Send className="w-3.5 h-3.5" />}
                          >
                            Write with Quill
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActiveSubTab('icpDeck');
                            }}
                          >
                            View ICP
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <Crosshair className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs">Select any target on the radar scope to inspect signals.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* GRID DISPLAY MODE */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border transition-all cursor-pointer space-y-3 ${
                        selectedLead?.id === lead.id
                          ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20'
                          : 'border-blue-100 dark:border-slate-800 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{lead.companyName}</h4>
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                          </div>
                          <span className="text-[11px] text-blue-600 font-mono">{lead.domain}</span>
                        </div>
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg ${
                          lead.relevanceScore >= 90 ? 'bg-cyan-500/10 text-cyan-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {lead.relevanceScore}% Fit
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-slate-900/40 text-xs space-y-1">
                        <span className="text-[10px] font-bold text-amber-600 uppercase">
                          Clue: {lead.signals?.[0]?.signalType || 'Active Intent'}
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                          {lead.signals?.[0]?.headline || lead.relevanceRationale}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                        <span className="text-[10px] text-slate-400">{lead.companySize}</span>
                        <button
                          type="button"
                          onClick={() => handleOpenQuill(lead)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Write with Quill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SALES & DISTRIBUTION INTELLIGENCE */}
          {activeSubTab === 'salesIntel' && (
            <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-white/[0.06] pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-600" />
                  <span>Commercial Sales & Distribution Economics: {activeProduct.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Unit economics, distribution channels, and battlecards to accelerate sales velocity for your company.
                </p>
              </div>

              {/* Unit Economics Key Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-[#0e1424] border border-blue-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Target MSRP / Pricing</span>
                  <div className="text-base font-black text-slate-900 dark:text-slate-100 font-mono">
                    {activeProduct.pricingModel || '$6.99 / Unit'}
                  </div>
                  <span className="text-[10px] text-cyan-600 font-semibold">High Margin Tier</span>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-50/60 dark:bg-[#0e1424] border border-cyan-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Estimated CAC</span>
                  <div className="text-base font-black text-cyan-600 font-mono">$0.85 - $2.40</div>
                  <span className="text-[10px] text-slate-400">Via TikTok & Retail Shelf</span>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Estimated LTV</span>
                  <div className="text-base font-black text-blue-600 font-mono">$38.00 / Buyer</div>
                  <span className="text-[10px] text-slate-400">Repeat Deck & Gift Orders</span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-[#0e1424] border border-amber-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Sales Cycle Length</span>
                  <div className="text-base font-black text-amber-600 font-mono">7 - 14 Days</div>
                  <span className="text-[10px] text-slate-400">Impulse & Retail PO Pace</span>
                </div>
              </div>

              {/* High-Velocity Sales Channels */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Primary Sales & Distribution Channels
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      Mass Retail & Specialty
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Target, Walmart, Barnes & Noble. High volume wholesale POs with standard 50% retail margin markup.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                      Amazon & TikTok Shop
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Direct fulfillment with viral short-form video tagging. Lowest CAC and immediate customer review aggregation.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      B2B Corporate & Gifting
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Bulk holiday bundles for company offsites, employee welcome kits, and college campus promotional events.
                    </p>
                  </div>
                </div>
              </div>

              {/* Objection-Handling Battlecards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Buyer Objection Handling Playbook
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0e1424] border border-slate-200/80 space-y-1">
                    <span className="font-bold text-rose-600 block">
                      Objection: "We already carry classic versions and shelf space is limited."
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong>Rebuttal:</strong> "Classic versions drive baseline sales, but this twist generates 4.8x higher viral social dwell time and appeals directly to competitive game night players who don't buy traditional decks anymore."
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0e1424] border border-slate-200/80 space-y-1">
                    <span className="font-bold text-amber-600 block">
                      Objection: "How do we know impulse purchases will convert in our stores?"
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong>Rebuttal:</strong> "We support distribution with localized creator seeding and co-op ad spend targeting your store zip codes, driving ready-to-buy shoppers directly to your family aisle."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MATRIX & TIMELINE */}
          {activeSubTab === 'timeline' && (
            <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-white/[0.06] pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  ▦ 30-Day Buyer Journey & Outreach Cadence
                </h3>
                <p className="text-xs text-slate-500">
                  Sequential timeline for converting discovered buying signals into signed contracts or distribution orders.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { week: 'Week 1 (Days 1 - 7)', title: 'Signal Interception & Social Warming', desc: 'Identify target decision makers at Barnes & Noble and Tru Kids; warm up via LinkedIn and Twitter interactions before direct outreach.', tag: 'Day 1-7' },
                  { week: 'Week 2 (Days 8 - 14)', title: 'Grounded Quill Outreach & Value Proof', desc: 'Deliver Quill 1:1 message citing warehouse expansion milestones and proof of TikTok consumer velocity.', tag: 'Day 8-14' },
                  { week: 'Week 3 (Days 15 - 21)', title: 'Executive Demo & Sample Deck Placement', desc: 'Schedule 15-min buyer walkthrough; ship retail display samples and wholesale pricing sheets.', tag: 'Day 15-21' },
                  { week: 'Week 4 (Days 22 - 30)', title: 'Contract Closure & Channel Launch Blitz', desc: 'Finalize initial purchase order MOQ, co-op advertising budget, and coordinate holiday launch push.', tag: 'Day 22-30' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0e1424] flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.week}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">• {item.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-[#f8fafc]/10 text-blue-700 dark:text-blue-300 shrink-0">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: URGENCY MATRIX */}
          {activeSubTab === 'urgency' && (
            <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-white/[0.06] pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  ⭐ Urgency & Intent Prioritization Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Prioritizes discovered accounts into actionable quadrants based on active hiring signals and purchase velocity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-cyan-50/50 dark:bg-[#0e1424] border border-cyan-200 dark:border-cyan-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-700 dark:text-cyan-400 uppercase">
                      Q1: Immediate Action (≥90% Fit)
                    </span>
                    <Badge variant="cyan" size="sm">{leads.filter(l => l.relevanceScore >= 90).length} Leads</Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    High budget intent, active hiring or warehouse expansion. Target with Quill immediate pitch.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400 uppercase">
                      Q2: Strategic Nurture (80-89%)
                    </span>
                    <Badge variant="blue" size="sm">{leads.filter(l => l.relevanceScore >= 80 && l.relevanceScore < 90).length} Leads</Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Strong ICP alignment. Sequence with thought leadership and retail performance reports.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase">
                      Q3: Quarterly Watchlist (70-79%)
                    </span>
                    <Badge variant="amber" size="sm">{leads.filter(l => l.relevanceScore >= 70 && l.relevanceScore < 80).length} Leads</Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Evaluating future categories. Monitor for Q4 procurement announcements.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-[#f8fafc]/[0.03] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                      Q4: Broad Category Signals
                    </span>
                    <Badge variant="slate" size="sm">Active Monitor</Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Industry trends, conventions, and broad competitive movements.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TARGET AUDIENCE & ICP DECK */}
          {activeSubTab === 'icpDeck' && (
            <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-white/[0.06] pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Target Audience DNA & Community Watering Holes</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Deep demographic profiling, emotional buying drivers, and community hangouts for {activeProduct.name}.
                </p>
              </div>

              {/* Audience Profiles Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-[#0e1424] border border-blue-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase block">
                    Primary Audience: Casual Game Night & Family Hosts
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Ages 25–45, household organizers, parents, and college party hosts. They seek high-energy games with 30-second setup and immediate laughs.
                  </p>
                  <div className="text-[10px] font-semibold text-slate-500 pt-1">
                    Trigger: Weekend gatherings, holidays, birthdays, travel entertainment.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase block">
                    Secondary Audience: Gen Z & Competitive Social Gamers
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Ages 16–28, active on TikTok and Instagram Reels. They love dramatic turnaround moments, high stakes penalties, and sharing gameplay reactions.
                  </p>
                  <div className="text-[10px] font-semibold text-slate-500 pt-1">
                    Trigger: Viral sound bites, TikTok duets, dorm room competitions.
                  </div>
                </div>
              </div>

              {/* Online Watering Holes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Where Your Target Audience Hangs Out (Watering Holes)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">Subreddits</span>
                    <p className="text-[11px] text-slate-500 font-mono">r/boardgames, r/tabletop, r/casualconversation, r/uno</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">TikTok Hashtags</span>
                    <p className="text-[11px] text-slate-500 font-mono">#GameNight, #BoardGameTikTok, #CardGame, #PartyGames</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">Podcasts & Media</span>
                    <p className="text-[11px] text-slate-500">Board Game Geek Daily, Dice Tower, Shut Up & Sit Down</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUTOMATIONS & CRM */}
          {activeSubTab === 'automations' && (
            <div className="space-y-6">
              {/* Card 1: Real-Time Webhook Dispatcher */}
              <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-3">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Real-Time Webhook Dispatcher
                  </h4>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Automatically pipe discovered hot buyers and Quill's personalized outreach drafts directly into your CRM, Slack #sales-signals channel, Zapier, or n8n workflow.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 text-xs font-mono py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1424] outline-none focus:border-blue-500"
                    placeholder="https://hooks.slack.com/services/... or Zapier/Make Webhook URL"
                  />
                  <Button
                    onClick={handleTestDispatch}
                    isLoading={isDispatching}
                    className="bg-blue-600 hover:bg-blue-700 text-slate-100 font-extrabold shrink-0"
                  >
                    {dispatchSuccess ? 'Dispatched! ✓' : 'Test Dispatch'}
                  </Button>
                </div>

                {/* Dispatched JSON Schema Display */}
                <pre className="p-4 rounded-xl bg-[#0b0e14] text-[11px] font-mono text-cyan-400 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "event": "buyer_signals_recon_complete",
  "timestamp": "${new Date().toISOString()}",
  "project": "${activeProduct.name.toLowerCase()} storefront",
  "total_buyers": ${leads.length},
  "direct_leads": ${directSignalsCount},
  "broad_leads": ${broadSignalsCount},
  "top_candidates": [
    {
      "company": "${leads[0]?.companyName || 'Barnes & Noble Inc.'}",
      "scope": "direct",
      "trigger": "${leads[0]?.signals?.[0]?.headline || 'Warehouse expansion for games'}"
    }
  ]
}`}
                </pre>
              </div>

              {/* Card 2: Export Pipeline Data */}
              <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-3">
                  <Download className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Export Pipeline Data
                  </h4>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Download enriched buyer records, validated decision-maker contacts, and drafted cold touches in structured formats for your SDR/AE teams.
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  <Button onClick={handleExportCsv} className="bg-blue-600 hover:bg-blue-700 text-slate-100">
                    Export Enriched CSV
                  </Button>
                  <Button onClick={handleExportJson} variant="outline">
                    Export Complete JSON
                  </Button>
                  <Button onClick={handleExportCsv} variant="ghost" className="text-blue-600 hover:underline">
                    HubSpot Batch Format
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quill Instant Outreach Modal */}
      {quillModalLead && (
        <Modal
          isOpen={!!quillModalLead}
          onClose={() => setQuillModalLead(null)}
          title={`✍️ Quill Signal-Grounded Outreach for ${quillModalLead.companyName}`}
          description="Personalized 1:1 message drafted automatically by Quill, grounded in public intent evidence."
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Target Account: {quillModalLead.companyName} ({quillModalLead.domain})
                </span>
                <span className="text-cyan-500 font-semibold">{quillModalLead.relevanceScore}% Fit</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Grounding Evidence: {quillModalLead.signals?.[0]?.headline || quillModalLead.relevanceRationale}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Quill Outreach Draft
              </label>
              <textarea
                rows={9}
                value={quillDraft}
                onChange={(e) => setQuillDraft(e.target.value)}
                className="w-full rounded-xl border text-xs sm:text-sm p-3.5 bg-[#f8fafc] dark:bg-[#0e1424] text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 font-mono leading-relaxed outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/[0.06]">
              <span className="text-[11px] text-slate-400">
                Ready to send via email, LinkedIn InMail, or SDR cadence.
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setQuillModalLead(null)}>
                  Close
                </Button>
                <Button
                  onClick={handleCopyQuill}
                  icon={isQuillCopied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                  className="bg-rose-500 hover:bg-rose-600 text-slate-100"
                >
                  {isQuillCopied ? 'Copied to Clipboard!' : 'Copy Message'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
