import React, { useEffect, useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import type { ProductIntelligence, ApiResponse } from '../../types';
import apiClient from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Sparkles,
  RefreshCw,
  Users,
  Target,
  Swords,
  Compass,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  Layers,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

export const IntelligenceView: React.FC = () => {
  const { activeProduct } = useProduct();
  const [intelligence, setIntelligence] = useState<ProductIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'radarWeb' | 'audienceDna' | 'salesEconomics' | 'competitors'>('radarWeb');
  const [selectedPersonaIndex, setSelectedPersonaIndex] = useState(0);
  const [selectedSpiderAxis, setSelectedSpiderAxis] = useState<number | null>(null);

  // Unit Economics Modeler State
  const [customMsrp, setCustomMsrp] = useState(19.99);
  const [customCac, setCustomCac] = useState(3.40);

  const fetchIntelligence = async () => {
    if (!activeProduct) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<ProductIntelligence>>(
        `/products/${activeProduct.id}/intelligence`
      );
      setIntelligence(response.data.data);
    } catch (err) {
      console.error('Failed to load intelligence', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReanalyze = async () => {
    if (!activeProduct) return;
    setIsReanalyzing(true);
    try {
      const response = await apiClient.post<ApiResponse<ProductIntelligence>>(
        `/products/${activeProduct.id}/intelligence/reanalyze`
      );
      setIntelligence(response.data.data);
    } catch (err) {
      console.error('Failed to reanalyze', err);
    } finally {
      setIsReanalyzing(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
    setSelectedPersonaIndex(0);
    // Set appropriate default MSRP depending on product category
    if (activeProduct) {
      if (activeProduct.category?.toLowerCase().includes('saas') || activeProduct.category?.toLowerCase().includes('software')) {
        setCustomMsrp(99.00);
        setCustomCac(24.00);
      } else {
        setCustomMsrp(19.99);
        setCustomCac(3.20);
      }
    }
  }, [activeProduct?.id]);

  if (!activeProduct) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-[#f8fafc]/[0.05] flex items-center justify-center mx-auto mb-4 text-blue-500">
          <Target className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Product Selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select or add an enterprise product to analyze market signals & commercial strategy.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-16 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Globe AI is synthesizing commercial signals, audience DNA, and spider graph telemetry...
        </p>
      </div>
    );
  }

  if (!intelligence) return null;

  const activePersona = intelligence.personas?.[selectedPersonaIndex] || intelligence.personas?.[0];

  // 5-Axis Spider / Radar Web Chart Calculations
  // Axes: 1. Product-Market Fit (PMF), 2. Viral Velocity, 3. CAC Efficiency, 4. Moat Defensibility, 5. Gross Margin Potential
  const spiderAxes = [
    {
      name: 'Product-Market Fit',
      score: intelligence.marketReadinessScore || 88,
      benchmark: 'Top Decile',
      description: 'Customer problem severity alignment and immediate willingness-to-buy signal.',
    },
    {
      name: 'Viral Velocity',
      score: 86,
      benchmark: 'High Organic',
      description: 'Short-form social shareability, word-of-mouth referral, and unboxing appeal.',
    },
    {
      name: 'CAC Efficiency',
      score: 91,
      benchmark: 'Capital Efficient',
      description: 'LTV to CAC ratio (>4.2x) with low blended acquisition cost across TikTok and search.',
    },
    {
      name: 'Moat Defensibility',
      score: 78,
      benchmark: 'Proprietary IP',
      description: 'Brand equity, patent/rules novelty, and defensibility against generic copycats.',
    },
    {
      name: 'Margin Potential',
      score: 92,
      benchmark: '60%+ Net',
      description: 'Contribution margin after COGS, warehouse logistics, and retailer wholesale cuts.',
    },
  ];

  // Radar chart mathematical helpers
  const radarCenter = 160;
  const radarRadius = 110;
  const numAxes = spiderAxes.length;

  const getAxisPoint = (index: number, valueRatio: number) => {
    const angle = (index * (360 / numAxes) - 90) * (Math.PI / 180);
    const r = radarRadius * valueRatio;
    return {
      x: radarCenter + r * Math.cos(angle),
      y: radarCenter + r * Math.sin(angle),
    };
  };

  // Generate polygon points string for data polygon
  const dataPolygonPoints = spiderAxes
    .map((axis, i) => {
      const pt = getAxisPoint(i, axis.score / 100);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // Generate concentric polygon rings (20%, 40%, 60%, 80%, 100%)
  const gridRings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Unit Economics Calculations
  const cogsPct = 0.16;
  const cogsAmount = Number((customMsrp * cogsPct).toFixed(2));
  const fulfillmentPct = 0.12;
  const fulfillmentAmount = Number((customMsrp * fulfillmentPct).toFixed(2));
  const netProfitAmount = Number((customMsrp - cogsAmount - customCac - fulfillmentAmount).toFixed(2));
  const netMarginPct = Number(((netProfitAmount / customMsrp) * 100).toFixed(1));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Navigation Tabs & Actions */}
      <div className="p-3.5 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: 'radarWeb', label: '🕸️ Spider Moat & Strategic Fit' },
            { id: 'audienceDna', label: '🧬 Target Audience DNA' },
            { id: 'salesEconomics', label: '💰 Unit Economics & Battlecards' },
            { id: 'competitors', label: '⚔️ Competitor Win Matrix' },
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

        {/* Status and Reanalyze */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-50/700 animate-pulse" />
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Globe AI Strategic Engine
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReanalyze}
            isLoading={isReanalyzing}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Re-Analyze
          </Button>
        </div>
      </div>

      {/* SUB-TAB 1: 5-AXIS SPIDER MOAT & STRATEGIC FIT */}
      {activeSubTab === 'radarWeb' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 space-y-3 bg-[#f8fafc] dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Core Value Proposition
                </span>
                <Badge variant="blue" size="sm">
                  {activeProduct.category}
                </Badge>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                "{intelligence.valueProposition}"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                Primary hook engineered for high-intent customer acquisition.
              </div>
            </Card>

            <Card className="p-5 space-y-3 bg-[#f8fafc] dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Market Readiness Index
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-cyan-600 font-mono">
                  {intelligence.marketReadinessScore}%
                </span>
                <span className="text-xs font-bold text-slate-500">Commercial Traction</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#f8fafc]/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${intelligence.marketReadinessScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Validated against competitive saturation, customer sentiment, and purchase velocity.
              </p>
            </Card>

            <Card className="p-5 space-y-3 bg-[#f8fafc] dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Defensible USP Moat
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {intelligence.uspAnalysis}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                Proprietary edge preventing brand commoditization.
              </div>
            </Card>
          </div>

          {/* Graphical 5-Axis Spider / Radar Web Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e]/90 border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm">
            {/* SVG Spider Chart (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <div className="text-center mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                  GRAPHICAL MULTI-AXIS MOAT VISUALIZER
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  5-Dimensional Commercial Strength Radar
                </h4>
              </div>

              <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] max-w-full aspect-square">
                <svg viewBox="0 0 320 320" className="w-full h-full overflow-visible select-none">
                  <defs>
                    <linearGradient id="polygonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>

                  {/* Concentric Guide Pentagons */}
                  {gridRings.map((ring, rIdx) => {
                    const ringPoints = spiderAxes
                      .map((_, aIdx) => {
                        const pt = getAxisPoint(aIdx, ring);
                        return `${pt.x},${pt.y}`;
                      })
                      .join(' ');
                    return (
                      <polygon
                        key={rIdx}
                        points={ringPoints}
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1"
                        strokeDasharray={rIdx < 4 ? '2 2' : 'none'}
                        opacity={0.35 + rIdx * 0.15}
                      />
                    );
                  })}

                  {/* Axis Radiating Spokes */}
                  {spiderAxes.map((_, idx) => {
                    const outerPt = getAxisPoint(idx, 1.0);
                    return (
                      <line
                        key={idx}
                        x1={radarCenter}
                        y1={radarCenter}
                        x2={outerPt.x}
                        y2={outerPt.y}
                        stroke="#93c5fd"
                        strokeWidth="1.2"
                        strokeOpacity="0.5"
                      />
                    );
                  })}

                  {/* Data Filled Polygon */}
                  <polygon
                    points={dataPolygonPoints}
                    fill="url(#polygonGrad)"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    className="transition-all duration-700"
                  />

                  {/* Axis Data Points & Labels */}
                  {spiderAxes.map((axis, idx) => {
                    const pt = getAxisPoint(idx, axis.score / 100);
                    const labelPt = getAxisPoint(idx, 1.18);
                    const isSelected = selectedSpiderAxis === idx;

                    return (
                      <g
                        key={idx}
                        className="cursor-pointer transition-transform hover:scale-110"
                        onClick={() => setSelectedSpiderAxis(idx)}
                      >
                        {/* halo on selected point */}
                        {isSelected && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="12"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2"
                            className="animate-ping"
                          />
                        )}

                        {/* Interactive Data Point */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? '6.5' : '5'}
                          fill={isSelected ? '#2563eb' : '#06b6d4'}
                          stroke="#f1f5f9"
                          strokeWidth="2"
                        />

                        {/* Axis Name Label */}
                        <text
                          x={labelPt.x}
                          y={labelPt.y}
                          fill={isSelected ? '#2563eb' : '#0f172a'}
                          fontSize="9.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="font-sans dark:fill-white"
                        >
                          {axis.name} ({axis.score}%)
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <span className="text-[10px] text-slate-400 mt-2 font-mono">
                Click any axis node to inspect dimensional benchmarks and tactical levers.
              </span>
            </div>

            {/* Dimensional Telemetry Detail Card (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-blue-50/60 dark:bg-[#131722] border border-blue-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 font-mono">
                  DIMENSION TELEMETRY
                </span>
                <span className="text-[10px] font-mono font-bold bg-blue-600 text-slate-100 px-2 py-0.5 rounded-md">
                  {selectedSpiderAxis !== null ? `${spiderAxes[selectedSpiderAxis].score}% SCORE` : '5-AXIS AVERAGE: 88.2%'}
                </span>
              </div>

              {selectedSpiderAxis !== null ? (
                <div className="space-y-3">
                  <div>
                    <h5 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {spiderAxes[selectedSpiderAxis].name}
                    </h5>
                    <span className="text-xs font-bold text-cyan-600">
                      Tier: {spiderAxes[selectedSpiderAxis].benchmark}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {spiderAxes[selectedSpiderAxis].description}
                  </p>

                  <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e1424] border border-blue-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Executive Growth Lever</span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                      Leverage proprietary USP to sustain viral organic lift and suppress customer acquisition costs below $3.50/unit.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Multi-Dimensional Strategic Superiority
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Across all 5 commercial vectors, <strong>{activeProduct.name}</strong> displays high viral coefficient paired with defensible product-market fit.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    {spiderAxes.map((a, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedSpiderAxis(i)}
                        className="p-2 rounded-lg bg-[#f8fafc] dark:bg-[#0e1424] border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <span className="text-[10px] text-slate-400 block truncate">{a.name}</span>
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 font-mono">{a.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Blue Ocean Strategic Vectors */}
          {intelligence.blueOceanOpportunities && intelligence.blueOceanOpportunities.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Uncontested Blue Ocean Growth Vectors
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {intelligence.blueOceanOpportunities.map((opportunity, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-blue-50/50 dark:bg-[#f8fafc]/[0.02] border border-blue-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5"
                  >
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">
                      Growth Horizon #{i + 1}
                    </span>
                    <p className="font-medium">{opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: TARGET AUDIENCE DNA & ICP ENGINE */}
      {activeSubTab === 'audienceDna' && (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Target Audience DNA & Demographic Archetypes
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {intelligence.targetMarketSummary}
            </p>
          </div>

          {/* Demographic Distribution Matrix */}
          <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              AGE & BUYER COHORT DISTRIBUTION
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-[#0e1424] border border-blue-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-100">Gen Z (18-24)</span>
                  <span className="text-blue-600 font-mono">34% Share</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#f8fafc]/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '34%' }} />
                </div>
                <p className="text-[11px] text-slate-500">
                  Driven by TikTok short-form memes, college dorm game nights, and instant novelty.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-100">Young Adults (25-34)</span>
                  <span className="text-blue-600 font-mono">42% Share</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#f8fafc]/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '42%' }} />
                </div>
                <p className="text-[11px] text-slate-500">
                  Prime purchasing power; hosts weekly casual dinner parties and board game socials.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-50/70 dark:bg-[#0e1424] border border-cyan-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-100">Family Shoppers (35-49)</span>
                  <span className="text-cyan-600 font-mono">18% Share</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#f8fafc]/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 text-slate-100 h-full rounded-full" style={{ width: '18%' }} />
                </div>
                <p className="text-[11px] text-slate-500">
                  Purchases through Target and Amazon; looking for clean, accessible screen-free family fun.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-[#0e1424] border border-amber-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-100">Corporate Gifting (B2B)</span>
                  <span className="text-amber-600 font-mono">6% Share</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#f8fafc]/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: '6%' }} />
                </div>
                <p className="text-[11px] text-slate-500">
                  High AOV bulk orders for company holiday gifts, icebreaker workshops, and retreats.
                </p>
              </div>
            </div>
          </div>

          {/* Persona Interactive Switcher */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Identified Commercial Personas ({intelligence.personas?.length || 0})
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {intelligence.personas?.map((persona, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPersonaIndex(index)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPersonaIndex === index
                      ? 'bg-blue-600 text-slate-100 shadow-xs'
                      : 'bg-[#f8fafc] dark:bg-[#0e1424] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-500'
                  }`}
                >
                  {persona.title} ({persona.fitScore}% Fit)
                </button>
              ))}
            </div>

            {/* Selected Persona Detail Deck */}
            {activePersona && (
              <Card className="p-6 space-y-6 bg-[#f8fafc] dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {activePersona.title}
                    </h4>
                    <span className="text-xs text-slate-400">
                      Seniority / Role Profile: <strong className="text-slate-700 dark:text-slate-200">{activePersona.seniorityLevel}</strong>
                    </span>
                  </div>
                  <Badge variant="cyan" size="md">
                    {activePersona.fitScore}% Relevance Match
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pain Points */}
                  <div className="space-y-3">
                    <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Core Frustrations & Pains
                    </span>
                    <ul className="space-y-2">
                      {activePersona.painPoints?.map((pain, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buying Triggers */}
                  <div className="space-y-3">
                    <span className="text-xs font-extrabold text-cyan-600 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Psychological Buying Triggers
                    </span>
                    <ul className="space-y-2">
                      {activePersona.buyingTriggers?.map((trigger, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-cyan-50/60 dark:bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-200/60 dark:border-cyan-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-50/700 mt-1.5 shrink-0" />
                          {trigger}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Objections */}
                  <div className="space-y-3">
                    <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pre-Purchase Objections
                    </span>
                    <ul className="space-y-2">
                      {activePersona.objections?.map((obj, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Digital Watering Holes & Creator Affinities */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    ONLINE WATERING HOLES & PROMOTIONAL SURFACES
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 space-y-1">
                      <span className="font-bold text-blue-600 block">Top Subreddits</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        r/boardgames, r/mildlyinteresting, r/FamilyGameNight, r/TikTokMadeMeBuyIt
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 space-y-1">
                      <span className="font-bold text-rose-600 block">TikTok / Reels Formats</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Reaction showdowns, dramatic rule flips ("When you draw +5 Dark"), couples game night challenges.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 space-y-1">
                      <span className="font-bold text-cyan-600 block">Retail Footprint</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Target Front-of-Store Checkout Endcaps, Walmart Toys Isle 4, Barnes & Noble Game Tables.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COMMERCIAL SALES & UNIT ECONOMICS */}
      {activeSubTab === 'salesEconomics' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-600" />
              <span>Commercial Sales Economics & Unit Margin Engine</span>
            </h3>
            <p className="text-xs text-slate-500">
              Model unit profit, blended acquisition cost, and retail wholesale markups for {activeProduct.name}.
            </p>
          </div>

          {/* Interactive Unit Margin Modeler */}
          <div className="p-6 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                  INTERACTIVE UNIT MARGIN WATERFALL
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Break-Even & Net Contribution Modeler
                </h4>
              </div>

              {/* Sliders for Quick Modeling */}
              <div className="flex items-center gap-4 text-xs font-bold">
                <div>
                  <span className="text-slate-500 block text-[10px]">Target MSRP ($)</span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={customMsrp}
                    onChange={(e) => setCustomMsrp(parseFloat(e.target.value) || 1)}
                    className="w-24 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Blended CAC ($)</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={customCac}
                    onChange={(e) => setCustomCac(parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Waterfall Breakdown Display */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#f8fafc]/[0.03] border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Target MSRP</span>
                <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
                  ${customMsrp.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500">100% Gross</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-600">COGS / Unit</span>
                <div className="text-lg font-black text-rose-600 font-mono">
                  -${cogsAmount.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400">{Math.round(cogsPct * 100)}% Production</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-600">Ad CAC / Unit</span>
                <div className="text-lg font-black text-amber-600 font-mono">
                  -${customCac.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400">{((customCac / customMsrp) * 100).toFixed(0)}% Acquisition</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-600">Fulfillment / FBA</span>
                <div className="text-lg font-black text-blue-600 font-mono">
                  -${fulfillmentAmount.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400">{Math.round(fulfillmentPct * 100)}% Logistics</span>
              </div>

              <div className="p-4 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/30 border border-cyan-300/60 dark:border-cyan-800/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-cyan-600">Net Profit / Unit</span>
                <div className="text-lg font-black text-cyan-600 font-mono">
                  ${netProfitAmount.toFixed(2)}
                </div>
                <span className="text-[10px] font-bold text-cyan-600">{netMarginPct}% Net Margin</span>
              </div>
            </div>

            {/* Visual Stacked Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-[#f8fafc]/10 h-4 rounded-xl overflow-hidden flex">
              <div
                className="bg-rose-500 h-full transition-all"
                style={{ width: `${cogsPct * 100}%` }}
                title={`COGS: ${Math.round(cogsPct * 100)}%`}
              />
              <div
                className="bg-amber-500 h-full transition-all"
                style={{ width: `${(customCac / customMsrp) * 100}%` }}
                title={`CAC: ${((customCac / customMsrp) * 100).toFixed(1)}%`}
              />
              <div
                className="bg-sky-500 h-full transition-all"
                style={{ width: `${fulfillmentPct * 100}%` }}
                title={`Fulfillment: ${Math.round(fulfillmentPct * 100)}%`}
              />
              <div
                className="bg-cyan-50/700 h-full transition-all flex-1"
                title={`Net Profit: ${netMarginPct}%`}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> COGS (${cogsAmount})</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Marketing CAC (${customCac})</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> Logistics (${fulfillmentAmount})</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-50/700" /> Net Profit (${netProfitAmount})</span>
            </div>
          </div>

          {/* Omnichannel Distribution Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
              Omnichannel Sales Distribution Mix
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    Mass Retail (Walmart, Target, B&N)
                  </span>
                  <Badge variant="blue" size="sm">55% Volume</Badge>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bulk purchase orders with net 30/60 terms. Wholesale price at 50% discount ($9.99/unit). Guaranteed shelf visibility and high brand recognition.
                </p>
                <div className="pt-2 text-[10px] font-mono text-blue-600 font-bold">
                  Sales Cycle: 30 - 60 Days
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                    <TrendingUp className="w-4 h-4 text-cyan-600" />
                    Direct-to-Consumer & TikTok Shop
                  </span>
                  <Badge variant="cyan" size="sm">35% Volume</Badge>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Maximum net contribution margin ($11.20+/unit). Powered by organic viral video traffic, impulse checkout, and immediate customer email capture.
                </p>
                <div className="pt-2 text-[10px] font-mono text-cyan-600 font-bold">
                  Sales Cycle: Instant (0 - 48 Hours)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                    <Layers className="w-4 h-4 text-amber-600" />
                    Corporate Gifting & Bulk Wholesale
                  </span>
                  <Badge variant="amber" size="sm">10% Volume</Badge>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Seasonal Q4 holiday spikes. High average order value ($500 - $5,000 per deal) for corporate retreat kits and university orientation swag bags.
                </p>
                <div className="pt-2 text-[10px] font-mono text-amber-600 font-bold">
                  Sales Cycle: 14 - 21 Days
                </div>
              </div>
            </div>
          </div>

          {/* Objection-Handling Battlecards */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
              Commercial Sales Objection Battlecards
            </span>

            <div className="space-y-2 text-xs">
              <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-1.5">
                <span className="font-extrabold text-rose-600 flex items-center gap-1.5 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Objection: "We already carry standard competitive options that sell fine."
                </span>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                  <strong>Winning Rebuttal:</strong> "{activeProduct.name} doesn't cannibalize existing stock; it expands the category by delivering 3x the emotional engagement with its double-sided mechanics. Retailers report a 38% increase in basket size when paired on endcaps."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 shadow-sm space-y-1.5">
                <span className="font-extrabold text-amber-600 flex items-center gap-1.5 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Objection: "Is organic customer demand proven, or will this sit on shelves?"
                </span>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                  <strong>Winning Rebuttal:</strong> "Our short-form video campaigns generate over 2.4M organic views weekly, directly driving shoppers into retail stores asking for {activeProduct.name} by name. We back retail orders with targeted geo-fenced social advertising."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: COMPETITOR WIN MATRIX */}
      {activeSubTab === 'competitors' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Swords className="w-4 h-4 text-blue-600" />
              <span>Competitor Teardowns & How We Win</span>
            </h3>
            <p className="text-xs text-slate-500">
              Direct and indirect incumbents analyzed by Globe AI to identify exploitable market vulnerabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {intelligence.competitors?.map((comp, idx) => (
              <Card key={idx} className="p-6 space-y-4 bg-[#f8fafc] dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{comp.name}</h4>
                    {comp.website && (
                      <span className="text-xs text-blue-600 font-mono hover:underline flex items-center gap-1 mt-0.5">
                        {comp.website} <ArrowUpRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <Badge variant="slate" size="sm">Incumbent</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 block mb-1">Their Strengths</span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {comp.strengths?.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-rose-600 block mb-1">Their Vulnerabilities</span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {comp.weaknesses?.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider block mb-1">
                    How We Win (Our Differentiation Angle):
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {comp.ourDifferentiation}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
