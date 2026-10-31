import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProductProvider, useProduct } from './context/ProductContext';
import { AuthView } from './features/auth/AuthView';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ProductModal } from './components/layout/ProductModal';
import { IntelligenceView } from './features/intelligence/IntelligenceView';
import { DiscoveryView } from './features/discovery/DiscoveryView';
import { AutomationView } from './features/automation/AutomationView';
import { CopilotView } from './features/copilot/CopilotView';
import { AdminDashboardView } from './features/admin/AdminDashboardView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { products, isLoading: productsLoading } = useProduct();
  const [activeTab, setActiveTab] = useState<'intelligence' | 'discovery' | 'automation' | 'copilot' | 'admin'>('copilot');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // If authenticated and no products exist after loading, prompt product creation modal
  useEffect(() => {
    if (isAuthenticated && !productsLoading && products.length === 0) {
      setIsProductModalOpen(true);
    }
  }, [isAuthenticated, productsLoading, products.length]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#0c1022] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen flex bg-transparent text-slate-900 dark:text-slate-100 transition-colors">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewProduct={() => setIsProductModalOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header
          activeTab={activeTab}
          onOpenNewProduct={() => setIsProductModalOpen(true)}
        />

        <main className="flex-1 pb-16">
          {activeTab === 'intelligence' && <IntelligenceView />}
          {activeTab === 'discovery' && <DiscoveryView />}
          {activeTab === 'automation' && <AutomationView />}
          {activeTab === 'copilot' && <CopilotView />}
          {activeTab === 'admin' && <AdminDashboardView />}
        </main>
      </div>

      {/* Product Onboarding / Creation Wizard Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <MainLayout />
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
