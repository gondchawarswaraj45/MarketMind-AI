import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useProduct } from '../../context/ProductContext';
import { Sparkles, Wand2, Tag, Edit3, Layers } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose }) => {
  const { createProduct } = useProduct();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Board Games & Card Games');
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    websiteUrl: '',
    pricingModel: '$6.99 - $14.99 per unit',
    targetGeography: 'Global',
    description: '',
  });

  // Organized category taxonomy across physical, digital, services, and creative
  const categoryGroups = [
    {
      group: '🎲 Games, Toys & Entertainment',
      options: [
        'Board Games & Card Games',
        'Toys, Puzzles & Family Games',
        'Video Games, Indie Games & Esports',
        'Collectibles, Tabletop & Miniature Games',
        'Comics, Books, Audio & Media',
      ],
    },
    {
      group: '🛍️ Physical Consumer Goods & D2C Brands',
      options: [
        'E-Commerce & D2C Lifestyle Brands',
        'Fashion, Apparel, Footwear & Accessories',
        'Beauty, Cosmetics & Personal Skincare',
        'Food, Gourmet Snacks, Coffee & Beverages',
        'Health, Wellness, Nutrition & Supplements',
        'Home, Kitchenware, Bedding & Interior Decor',
        'Consumer Electronics, Smart Gadgets & Audio',
        'Sports, Fitness, Camping & Outdoor Gear',
        'Pet Supplies, Pet Food & Pet Toys',
        'Baby, Nursery, Kids & Parenting Goods',
      ],
    },
    {
      group: '💻 Software, SaaS & Developer Platforms',
      options: [
        'B2B SaaS & Cloud Applications',
        'Developer Tools, SDKs, CLIs & APIs',
        'AI Platforms, Autonomous Agents & Automation',
        'Cybersecurity, Infosec & Privacy Tools',
        'FinTech, Payments & Banking Infrastructure',
        'MarTech, AdTech & Sales Enablement',
        'HRTech, Recruiting & Talent Operations',
        'Productivity, Notes & Team Collaboration',
        'Data Analytics, BI & Cloud Observability',
      ],
    },
    {
      group: '🏥 Vertical & Industry Solutions',
      options: [
        'EdTech, Online Learning & Skill Training',
        'HealthTech, Telehealth & Medical Devices',
        'PropTech, Real Estate & Property Management',
        'CleanTech, Solar, Climate & Sustainability',
        'Automotive, Electric Vehicles & Mobility',
        'Supply Chain, Logistics & Warehousing',
        'LegalTech & Regulatory Compliance',
        'AgriTech & Smart Farming Solutions',
      ],
    },
    {
      group: '🤝 Agencies, Consulting & Services',
      options: [
        'Digital Marketing, Creative & PR Agency',
        'Management Consulting & Strategy Advisory',
        'Design Studio, UI/UX & Video Production',
        'Accounting, Tax & Fractional CFO Services',
        'Custom Software Engineering & IT Services',
      ],
    },
  ];

  const quickCustomSuggestions = [
    'Double-Sided Card Games',
    'Specialty Coffee & Beverages',
    'Organic Skincare & Cosmetics',
    'AI Workflow Automation',
    'Gaming Peripherals & Hardware',
    'Eco-Friendly Home Goods',
  ];

  const handlePreFillPhysicalGame = () => {
    setIsCustomMode(false);
    setSelectedCategory('Board Games & Card Games');
    setCustomCategoryInput('');
    setFormData({
      name: 'UNO Flip! Card Game',
      tagline: 'The dynamic, competitive twist on UNO with double-sided cards and high-stakes flip action',
      websiteUrl: 'https://shop.mattel.com',
      pricingModel: '$6.99 MSRP per deck',
      targetGeography: 'Global (Family & Casual Gaming)',
      description: 'UNO Flip! transforms classic matching card gameplay with a double-sided deck containing "Light" and "Dark" sides. Playing a FLIP card forces all players to flip their hands and draw piles, triggering aggressive penalties like Draw Five and Skip Everyone. Appeals to families, college parties, and competitive game night enthusiasts worldwide.',
    });
  };

  const handlePreFillSaaS = () => {
    setIsCustomMode(false);
    setSelectedCategory('Developer Tools, SDKs, CLIs & APIs');
    setCustomCategoryInput('');
    setFormData({
      name: 'OmniFlow AI',
      tagline: 'AI workflow orchestration, prompt evaluation, and failure recovery for modern engineering teams',
      websiteUrl: 'https://omniflow.dev',
      pricingModel: 'Freemium ($49/seat/mo)',
      targetGeography: 'North America & Europe',
      description: 'OmniFlow AI gives software teams complete observability, automated evaluation, and failure recovery for autonomous LLM agents and multi-step AI pipelines. Replaces scattered logs with real-time trace analysis, reducing debugging time by 80%.',
    });
  };

  const handlePreFillD2C = () => {
    setIsCustomMode(false);
    setSelectedCategory('Beauty, Cosmetics & Personal Skincare');
    setCustomCategoryInput('');
    setFormData({
      name: 'Lumina Botanical Elixir',
      tagline: 'Cold-pressed bioactive botanical facial oil that restores the skin barrier in 14 days',
      websiteUrl: 'https://luminabotanicals.com',
      pricingModel: '$48.00 (30ml bottle) / Subscription $39/mo',
      targetGeography: 'US, UK & Canada (Direct-to-Consumer)',
      description: 'Formulated with cold-pressed rosehip seed oil, sea buckthorn, and plant-derived squalane. 100% vegan, cruelty-free, and formulated for sensitive, redness-prone skin. Strong social proof with 4.9/5 stars across 3,200+ verified customer reviews.',
    });
  };

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'CUSTOM_CHOICE') {
      setIsCustomMode(true);
    } else {
      setSelectedCategory(val);
      setIsCustomMode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    // Resolve final category string
    const finalCategory = isCustomMode
      ? customCategoryInput.trim() || 'Custom Product / Innovation'
      : selectedCategory;

    setIsSubmitting(true);
    try {
      await createProduct({
        ...formData,
        category: finalCategory,
      });
      onClose();
      // Reset form
      setFormData({
        name: '',
        tagline: '',
        websiteUrl: '',
        pricingModel: '$6.99 - $14.99 per unit',
        targetGeography: 'Global',
        description: '',
      });
      setSelectedCategory('Board Games & Card Games');
      setCustomCategoryInput('');
      setIsCustomMode(false);
    } catch (err) {
      console.error('Failed to create product', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Product Profile"
      description="Define any physical product, card game, toy, D2C brand, mobile app, or SaaS to activate Globe AI intelligence."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sample Templates Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Pre-fill Templates:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handlePreFillPhysicalGame}
              className="text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 flex items-center gap-1 font-bold bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 transition-colors"
            >
              <Tag className="w-3 h-3" />
              UNO Flip! (Game/Toy)
            </button>
            <button
              type="button"
              onClick={handlePreFillD2C}
              className="text-xs text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 flex items-center gap-1 font-bold bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20 transition-colors"
            >
              <Layers className="w-3 h-3" />
              D2C Skincare
            </button>
            <button
              type="button"
              onClick={handlePreFillSaaS}
              className="text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 flex items-center gap-1 font-bold bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20 transition-colors"
            >
              <Wand2 className="w-3 h-3" />
              Tech SaaS
            </button>
          </div>
        </div>

        {/* Product Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product / Game / Service Name"
            placeholder="e.g. UNO Flip, OmniFlow, Catan, Bloom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                Category
              </label>
              {/* Category Mode Switcher */}
              <button
                type="button"
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                {isCustomMode ? '← Pick Curated List' : '✍️ Custom Category'}
              </button>
            </div>

            {isCustomMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Double-Sided Card Games, Specialty Coffee, VR Gear..."
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  className="w-full rounded-xl border text-xs sm:text-sm py-2.5 px-3 bg-slate-100 dark:bg-[#0e1424] text-slate-900 dark:text-slate-100 border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-xs"
                  required
                />
              </div>
            ) : (
              <select
                value={selectedCategory}
                onChange={handleCategorySelectChange}
                className="w-full rounded-xl border text-xs sm:text-sm py-2.5 px-3 bg-slate-100 dark:bg-[#0e1424] text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                {categoryGroups.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <optgroup label="✨ Custom / Other">
                  <option value="CUSTOM_CHOICE">✍️ Type Custom Category...</option>
                </optgroup>
              </select>
            )}
          </div>
        </div>

        {/* Quick Custom Suggestions if in custom mode */}
        {isCustomMode && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 space-y-1.5 animate-fade-in">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
              Quick Suggestions (Click to fill):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickCustomSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setCustomCategoryInput(suggestion)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0e1424] border border-blue-500/30 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <Input
          label="Tagline / Key Hook"
          placeholder="e.g. The dynamic twist on classic matching card games with light and dark sides"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Website or Store URL"
            placeholder="https://shop.example.com"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          />
          <Input
            label="Pricing / Business Model"
            placeholder="e.g. $6.99 per deck, $49/mo, or Direct Retail"
            value={formData.pricingModel}
            onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase mb-1.5">
            Product Description, Target Audience & Key Features
          </label>
          <textarea
            rows={4}
            required
            placeholder="Describe what the product is, why buyers love it, what sets it apart, and the target market (e.g. for a game: rules, flip mechanic, target ages, family game night appeal)..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border text-sm p-3.5 bg-slate-100 dark:bg-[#0e1424] text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Create & Analyze with Globe AI
          </Button>
        </div>
      </form>
    </Modal>
  );
};
