import React from 'react';
import { useProduct } from '../../context/ProductContext';
import { Sparkles, Compass, Send, Layers, ChevronDown, CheckCircle2, Bot, Settings } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: 'intelligence' | 'discovery' | 'automation' | 'copilot' | 'admin';
  setActiveTab: (tab: 'intelligence' | 'discovery' | 'automation' | 'copilot' | 'admin') => void;
  onOpenNewProduct: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewProduct,
}) => {
  const { products, activeProduct, setActiveProduct } = useProduct();

  const navItems = [
    {
      id: 'intelligence' as const,
      label: '1. Product Intelligence',
      engine: 'DESIGN',
      tagline: 'Spider Moat & Fit',
      icon: Sparkles,
    },
    {
      id: 'discovery' as const,
      label: '2. Buyer Discovery',
      engine: 'STRATEGY',
      tagline: 'Polar Signal Radar',
      icon: Compass,
    },
    {
      id: 'automation' as const,
      label: '3. Marketing Automation',
      engine: 'AUTOMATION',
      tagline: 'Funnel & Simulator',
      icon: Send,
    },
    {
      id: 'copilot' as const,
      label: '4. Globe AI Agent',
      engine: 'GLOBE AI',
      tagline: 'Virality & News',
      icon: Bot,
    },
    {
      id: 'admin' as const,
      label: '5. Enterprise Admin Hub',
      engine: 'PORTFOLIO',
      tagline: 'Company Portfolio & Config',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#131b2e] flex flex-col h-screen sticky top-0 select-none">
      {/* Brand & Logo with Solid Plain Cobalt */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-slate-100 shadow-xs border border-blue-700/30">
            <Sparkles className="w-5 h-5 text-slate-100" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100 leading-none">
              Market<span className="text-blue-600 dark:text-blue-400">Mind</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Growth Intelligence OS
            </p>
          </div>
        </div>
      </div>

      {/* Product Switcher Walled Box */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-[#0e1424]/40">
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 px-1">
          Active Portfolio Product
        </label>
        <div className="relative">
          {products.length > 0 ? (
            <select
              value={activeProduct?.id || ''}
              onChange={(e) => {
                const found = products.find(p => p.id === e.target.value);
                if (found) setActiveProduct(found);
              }}
              className="w-full text-xs font-bold py-2 px-3 pr-8 rounded-xl appearance-none bg-slate-100 dark:bg-[#0e1424] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 truncate cursor-pointer shadow-xs"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          ) : (
            <button
              onClick={onOpenNewProduct}
              className="w-full text-xs py-2 px-3 rounded-xl bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-600/30 hover:bg-blue-600/20 transition-colors font-bold flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              + Add First Product
            </button>
          )}
          {products.length > 0 && (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Engines & Growth Intelligence
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                'w-full text-left p-3 rounded-xl transition-all duration-150 group relative select-none',
                isActive
                  ? 'bg-blue-600 text-slate-100 shadow-xs border border-blue-700/40'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                    isActive
                      ? 'bg-blue-700/50 text-slate-100'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-slate-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={clsx(
                        'text-xs font-bold tracking-tight truncate',
                        isActive
                          ? 'text-slate-100'
                          : 'text-slate-800 dark:text-slate-200'
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={clsx(
                      'text-[9px] font-extrabold uppercase tracking-wider',
                      isActive ? 'text-blue-200' : 'text-blue-600 dark:text-blue-400'
                    )}>
                      {item.engine}
                    </span>
                    <span className={clsx(
                      'text-[10px]',
                      isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                    )}>
                      • {item.tagline}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Engine Status / System Ready Walled Box */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-[#0e1424]/40">
        <div className="bg-[#f8fafc] dark:bg-[#131b2e] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
              Globe AI Engine Core
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Market Intelligence • Multi-Platform Telemetry • SQLite DB
          </p>
        </div>
      </div>
    </aside>
  );
};
