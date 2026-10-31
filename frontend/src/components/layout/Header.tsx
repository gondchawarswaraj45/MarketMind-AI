import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProduct } from '../../context/ProductContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Sun, Moon, Plus, LogOut, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenNewProduct: () => void;
  activeTab: 'intelligence' | 'discovery' | 'automation' | 'copilot' | 'admin';
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewProduct, activeTab }) => {
  const { user, logout } = useAuth();
  const { activeProduct } = useProduct();
  const { theme, toggleTheme } = useTheme();

  const tabTitles = {
    intelligence: {
      title: 'Product Intelligence',
      subtitle: 'Engine 1: 5-Axis spider moat, target audience DNA & commercial unit economics',
    },
    discovery: {
      title: 'Buyer Discovery (Signal Radar)',
      subtitle: 'Graphical polar coordinate radar, live buyer intent cues & instant Quill outreach',
    },
    automation: {
      title: 'Marketing Automation',
      subtitle: 'Engine 3: Graphical conversion funnel, sales revenue simulator & signal playbooks',
    },
    copilot: {
      title: 'Globe AI Marketing Agent',
      subtitle: 'Dedicated Growth Director: Strategic Playbooks, Platform Algorithms & Live Market Signals',
    },
    admin: {
      title: 'Enterprise Admin Hub',
      subtitle: 'Company Portfolio Command Center, Global Webhooks & Globe AI Governance',
    },
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#131b2e] px-6 py-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {tabTitles[activeTab].title}
          </h1>
          {activeProduct && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25">
              <Layers className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              {activeProduct.name}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {tabTitles[activeTab].subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenNewProduct}
          icon={<Plus className="w-4 h-4 text-blue-600" />}
          className="hidden sm:inline-flex"
        >
          New Product
        </Button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-slate-100 text-xs font-black uppercase shadow-xs">
              {user.fullName ? user.fullName.charAt(0) : 'U'}
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
