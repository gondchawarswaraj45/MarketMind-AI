import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(fullName, email, password);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      await login('growth@acmegrowth.com', 'demo1234');
    } catch {
      try {
        await register('Executive Growth Director', 'growth@acmegrowth.com', 'demo1234');
      } catch (err: any) {
        setErrorMessage('Could not initialize demo session: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0c111d] text-slate-100">
      {/* Left Hero Brand Panel - Clean walled container, zero points */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative bg-[#0e1424]">
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-slate-100 shadow-xs border border-blue-700/40">
            <Sparkles className="w-5 h-5 text-slate-100" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Market<span className="text-blue-500">Mind</span>
          </span>
        </div>

        {/* Middle Hero Copy */}
        <div className="my-12 lg:my-0 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-400 border border-blue-500/25">
            <Zap className="w-3.5 h-3.5" />
            Globe AI Growth Intelligence & Buyer Discovery
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
            Understand Your Market. <br />
            Discover Your Buyers. <br />
            <span className="text-blue-400">
              Win More Customers.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed">
            Transform product details into actionable market signals through three integrated engines: Product Intelligence, Buyer Discovery Radar, and Marketing Automation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-[#131b2e] border border-slate-800">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">1. DESIGN</div>
              <div className="text-xs text-slate-300 font-medium">See The Signal</div>
              <div className="text-[11px] text-slate-500 mt-1">Personas, USP & Moat</div>
            </div>
            <div className="p-4 rounded-xl bg-[#131b2e] border border-slate-800">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">2. STRATEGY</div>
              <div className="text-xs text-slate-300 font-medium">Find The Signal</div>
              <div className="text-[11px] text-slate-500 mt-1">Polar Signal Radar</div>
            </div>
            <div className="p-4 rounded-xl bg-[#131b2e] border border-slate-800">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">3. AUTOMATION</div>
              <div className="text-xs text-slate-300 font-medium">Signal To Inbox</div>
              <div className="text-[11px] text-slate-500 mt-1">Multi-Channel Campaigns</div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Backed by live market verification • Zero synthetic hallucination</span>
        </div>
      </div>

      {/* Right Form Panel - Walled card */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 bg-[#131b2e] p-8 rounded-2xl border border-slate-800 shadow-lg">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
              {isLogin ? 'Sign In to MarketMind' : 'Create an Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {isLogin
                ? 'Access your product intelligence dashboard and active leads'
                : 'Start discovering high-intent buyer leads with live signals'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  label="Full Name"
                  placeholder="Jane Marketer"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Company Name"
                  placeholder="Acme Growth Inc."
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="jane@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              {isLogin ? 'Sign In' : 'Create Free Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/80" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#131b2e] px-2 text-slate-400 font-bold">
                Or explore without sign in
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleDemoSignIn}
            isLoading={isLoading}
          >
            Launch Instant Demo Session
          </Button>

          <p className="text-center text-xs text-slate-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage('');
              }}
              className="font-bold text-blue-400 hover:text-blue-300 underline"
            >
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
