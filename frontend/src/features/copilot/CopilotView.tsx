import React, { useState, useRef, useEffect } from 'react';
import { useProduct } from '../../context/ProductContext';
import type { CopilotMessage, CopilotChatResponse, NewsSnippet, ChatAttachment, ApiResponse } from '../../types';
import apiClient from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MarkdownRenderer } from '../../components/ui/MarkdownRenderer';
import {
  Send,
  ExternalLink,
  Globe,
  Copy,
  Check,
  Bot,
  User,
  Trash2,
  Sparkles,
  Zap,
  Paperclip,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

export const CopilotView: React.FC = () => {
  const { activeProduct } = useProduct();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeMarketNews, setIncludeMarketNews] = useState(true);
  const [platformFocus, setPlatformFocus] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // File Sharing state
  const [attachedFiles, setAttachedFiles] = useState<ChatAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // News & Signals state
  const [allNews, setAllNews] = useState<NewsSnippet[]>([]);
  const [isReloadingNews, setIsReloadingNews] = useState(false);
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('ALL');
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const [rightPaneTab, setRightPaneTab] = useState<'news' | 'algorithms'>('news');
  const newsPageSize = 3;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch real market news from backend
  const fetchRealMarketNews = async (silent = false) => {
    if (!silent) setIsReloadingNews(true);
    try {
      const category = activeProduct?.category || 'B2B SaaS';
      const response = await apiClient.get<ApiResponse<NewsSnippet[]>>(
        `/copilot/news?category=${encodeURIComponent(category)}`
      );
      if (response.data?.data) {
        setAllNews(response.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch real-time news, keeping current signals', err);
    } finally {
      if (!silent) setIsReloadingNews(false);
    }
  };

  useEffect(() => {
    fetchRealMarketNews(true);
  }, [activeProduct?.category]);

  // Welcome message initialization
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `### Welcome to Globe AI Marketing Agent 🌐

I am **Globe AI**, your Chief Marketing Officer & Strategic Growth Director. I help you position, promote, and scale **${
            activeProduct ? activeProduct.name : 'your product'
          }** using multi-channel distribution algorithms, competitive newsjacking, and structured data-driven execution.

| Strategic Capability | Focus & Execution Methodology | Executive Deliverable |
| :--- | :--- | :--- |
| **Channel Strategy & CAC Benchmarks** | Algorithmic optimization for TikTok, Instagram, Reddit, X & Outbound | Structured Benchmark Comparison Table |
| **Real-Time Market Signals** | Verified web sentiment, competitor moves & category shifts | Timely Newsjacking Angles & Briefs |
| **Promotional & Launch Campaigns** | High-intent cold outbound, viral hooks, retail/e-commerce pushes | Copy-Paste Copy, Ad Headlines & Scripts |
| **Growth & Guerrilla Experiments** | Low-CAC viral tests, creator seeding & community engagement | 7-Day Sprint Roadmap & Testing Matrix |

*Select any quick action prompt below, attach any pitch deck/data file, or ask any marketing question for ${
  activeProduct ? activeProduct.name : 'your product'
}!*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [activeProduct?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // File Upload Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const isText = file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.csv') || file.name.endsWith('.json') || file.name.endsWith('.txt');

      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newAttachment: ChatAttachment = {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || 'document',
          previewUrl: !isText ? result : undefined,
          textSnippet: isText ? result.slice(0, 3000) : `[Binary file: ${file.name}, size: ${(file.size / 1024).toFixed(1)} KB]`,
        };
        setAttachedFiles((prev) => [...prev, newAttachment]);
      };

      if (isText) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)) return <ImageIcon className="w-3.5 h-3.5 text-blue-400" />;
    if (fileName.match(/\.(csv|xlsx|xls)$/i)) return <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />;
    return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
  };

  // Message Send Handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if ((!text.trim() && attachedFiles.length === 0) || isLoading) return;

    const currentAttachments = [...attachedFiles];
    setAttachedFiles([]);

    const userMessage: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      let promptWithFiles = text.trim();
      if (currentAttachments.length > 0) {
        promptWithFiles += '\n\n--- USER ATTACHED FILES FOR STRATEGIC ANALYSIS ---\n';
        currentAttachments.forEach((att) => {
          promptWithFiles += `[File: ${att.name} (${att.size})]:\n${att.textSnippet || 'Attached binary asset'}\n\n`;
        });
        promptWithFiles += 'Please review and extract insights from the attached documents to ground your strategic advice.';
      }

      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await apiClient.post<ApiResponse<CopilotChatResponse>>('/copilot/chat', {
        message: promptWithFiles,
        productId: activeProduct?.id,
        includeMarketNews,
        platformFocus,
        history: historyPayload,
      });

      const data = response.data.data;

      const assistantMessage: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        marketNews: data.marketNews,
        suggestedFollowUps: data.suggestedFollowUps,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.marketNews && data.marketNews.length > 0) {
        setAllNews(data.marketNews);
      }
    } catch (err: any) {
      console.error('Globe AI request failed', err);
      const errorMessage: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Connection Error**: ${
          err.response?.data?.message || err.message
        }. Please verify your network or API status.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Filtered & Paginated News
  const filteredNews = allNews.filter((item) => {
    const matchesSearch =
      !newsSearchTerm ||
      item.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      item.snippet.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      (item.source && item.source.toLowerCase().includes(newsSearchTerm.toLowerCase()));

    const matchesCategory =
      newsCategoryFilter === 'ALL' ||
      (item.category && item.category.toUpperCase().includes(newsCategoryFilter)) ||
      (item.impactTag && item.impactTag.toUpperCase().includes(newsCategoryFilter));

    return matchesSearch && matchesCategory;
  });

  const totalNewsPages = Math.max(1, Math.ceil(filteredNews.length / newsPageSize));
  const displayedNews = filteredNews.slice(
    (newsCurrentPage - 1) * newsPageSize,
    newsCurrentPage * newsPageSize
  );

  const quickPrompts = [
    {
      title: '📊 Strategic Channel Matrix',
      prompt: `Generate a comprehensive channel comparison table for ${
        activeProduct ? activeProduct.name : 'our product'
      } across TikTok, Instagram, Reddit, and Paid Ads, detailing expected CAC, organic reach, and 7-day tactical action items.`,
    },
    {
      title: '📰 Live Market News & Angles',
      prompt: `What are the latest news, market shifts, and trending discussions in our category right now, and how can we use them to win customers for ${
        activeProduct ? activeProduct.name : 'our product'
      }?`,
    },
    {
      title: '💼 Viral Thought Leadership & Hooks',
      prompt: `Write a high-converting post for ${
        activeProduct ? activeProduct.name : 'our product'
      } utilizing the platform dwell-time algorithm, with 3 viral opening hook variations and a structured value table.`,
    },
    {
      title: '🧵 X (Twitter) Growth Thread',
      prompt: `Draft a 6-part viral educational thread breaking down the #1 pain point our product solves, formatted with high-retweet framing.`,
    },
    {
      title: '🎯 7-Day Low-CAC Growth Sprint',
      prompt: `Create a structured 7-day growth marketing sprint table with 5 low-cost guerrilla marketing experiments to acquire our next 100 high-intent buyers for ${
        activeProduct ? activeProduct.name : 'our product'
      }.`,
    },
    {
      title: '📦 Viral Product Launch Playbook',
      prompt: `Build an end-to-end promotional roadmap for ${
        activeProduct ? activeProduct.name : 'our product'
      } covering teaser hooks, launch day blitz, community seeding, and influencer gifting.`,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      {/* Top Banner: Status & Focus Controls */}
      <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-slate-100 flex items-center justify-center shadow-md shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Globe AI Marketing Agent
              </span>
              <Badge variant="blue" size="sm">
                Globe AI Enterprise Active
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Dedicated Chief Marketing Officer: tactical promotion, platform algorithms, and live market intelligence.
            </p>
          </div>
        </div>

        {/* Controls: News Grounding Toggle & Platform Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIncludeMarketNews(!includeMarketNews)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              includeMarketNews
                ? 'bg-cyan-500/25 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40'
                : 'bg-slate-100 dark:bg-[#f8fafc]/[0.05] text-slate-500 border border-transparent'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Live Market News Grounding: {includeMarketNews ? 'ON' : 'OFF'}
          </button>

          <select
            value={platformFocus}
            onChange={(e) => setPlatformFocus(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Channels</option>
            <option value="LINKEDIN">LinkedIn Focus</option>
            <option value="TWITTER">X / Twitter Focus</option>
            <option value="REDDIT">Reddit Community Focus</option>
            <option value="INSTAGRAM">Instagram / TikTok</option>
          </select>

          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Grid: Chat Flow (Left 8 cols) & Live News Context Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Chat Window */}
        <div className="lg:col-span-8 flex flex-col h-full bg-[#f8fafc] dark:bg-[#131b2e] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-100 text-xs font-bold ${
                      isUser
                        ? 'bg-blue-600 shadow-md shadow-xs'
                        : 'bg-blue-600 shadow-md shadow-xs'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`space-y-2 max-w-[90%] ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* User Attachment Badges if any */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-1 justify-end">
                        {msg.attachments.map((att, aIdx) => (
                          <div
                            key={aIdx}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#f8fafc]/[0.08] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 shadow-xs"
                          >
                            {getFileIcon(att.name)}
                            <span className="font-medium truncate max-w-[160px]">{att.name}</span>
                            <span className="text-[10px] text-slate-400">({att.size})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-slate-100 rounded-tr-none'
                          : 'bg-[#f8fafc] dark:bg-[#0e1424] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-tl-none shadow-xs'
                      }`}
                    >
                      {isUser ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>

                    {/* Metadata & Actions for Assistant Messages */}
                    {!isUser && (
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pl-1">
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                          Globe AI Enterprise
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        <span>•</span>
                        <button
                          onClick={() => copyMessage(msg.id, msg.content)}
                          className="hover:text-cyan-500 flex items-center gap-1 font-medium transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-cyan-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy Brief
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Suggested Follow-Ups Pills */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {msg.suggestedFollowUps.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(prompt)}
                            className="text-[11px] font-medium py-1 px-2.5 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all text-left flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-slate-100 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-150" />
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-300" />
                  <span>Globe AI is analyzing documents & calculating strategic tables...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Prompts Bar */}
          {messages.length <= 2 && (
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Executive Action Prompts
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(qp.prompt)}
                    className="p-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 text-[11px] font-medium text-slate-700 dark:text-slate-300 text-left transition-all truncate flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{qp.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attached Files Staging Area */}
          {attachedFiles.length > 0 && (
            <div className="px-4 pt-3 pb-1 border-t border-slate-100 dark:border-slate-800 bg-cyan-50/700/[0.03] flex flex-wrap gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 w-full">
                Attached Files to Send ({attachedFiles.length}):
              </span>
              {attachedFiles.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e1424] border border-cyan-500/40 text-xs shadow-xs text-slate-800 dark:text-slate-200"
                >
                  {getFileIcon(att.name)}
                  <span className="font-medium truncate max-w-[150px]">{att.name}</span>
                  <span className="text-[10px] text-slate-400">({att.size})</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="p-0.5 text-slate-400 hover:text-rose-500 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Chat Input Form with File Sharing Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-[#0e1424]"
          >
            {/* Hidden File Picker Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept=".pdf,.docx,.doc,.txt,.md,.csv,.json,image/*"
              className="hidden"
            />

            {/* Paperclip Button for File Upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/15 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Attach Document, Pitch Deck, CSV or Screenshot"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Ask Globe AI or analyze attached files for ${
                activeProduct ? activeProduct.name : 'your product'
              }...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-xl border text-xs sm:text-sm py-2.5 px-4 bg-[#f8fafc] dark:bg-[#0e1424] text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
            />

            <Button
              type="submit"
              disabled={(!inputValue.trim() && attachedFiles.length === 0) || isLoading}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
        </div>

        {/* Right Sidebar: Live Market & Social News Feed + Algorithm Virality Radar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full bg-[#f8fafc] dark:bg-[#131b2e] rounded-2xl border border-slate-200 dark:border-slate-800 dark:border-slate-800 p-4 sm:p-5 overflow-hidden shadow-sm">
          {/* Top Switcher: News vs Algorithm Radar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => setRightPaneTab('news')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  rightPaneTab === 'news'
                    ? 'bg-[#f8fafc] dark:bg-[#0e1424] text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                📰 Live Signals
              </button>
              <button
                type="button"
                onClick={() => setRightPaneTab('algorithms')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  rightPaneTab === 'algorithms'
                    ? 'bg-[#f8fafc] dark:bg-[#0e1424] text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                ⚡ Virality Radar
              </button>
            </div>

            {rightPaneTab === 'news' ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fetchRealMarketNews(false)}
                  disabled={isReloadingNews}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 dark:border-slate-800 transition-colors"
                  title="Reload Fresh Market News"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReloadingNews ? 'animate-spin text-blue-600' : ''}`} />
                </button>
                <Badge variant="blue" size="sm">
                  Real-Time
                </Badge>
              </div>
            ) : (
              <Badge variant="cyan" size="sm">
                Algorithm Matrix
              </Badge>
            )}
          </div>

          {rightPaneTab === 'news' ? (
            <>
              {/* Quick Search & Filter Controls */}
              <div className="space-y-2 mb-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter real signals by keyword or domain..."
                    value={newsSearchTerm}
                    onChange={(e) => {
                      setNewsSearchTerm(e.target.value);
                      setNewsCurrentPage(1);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
                  {['ALL', 'VIRAL', 'RETAIL', 'COMMUNITY', 'ALGORITHM'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setNewsCategoryFilter(filter);
                        setNewsCurrentPage(1);
                      }}
                      className={`px-2 py-0.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
                        newsCategoryFilter === filter
                          ? 'bg-blue-600 text-slate-100'
                          : 'bg-slate-100 dark:bg-[#f8fafc]/[0.04] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable News Items Stream */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
                {displayedNews.length > 0 ? (
                  displayedNews.map((news, nIdx) => (
                    <div
                      key={nIdx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 space-y-2 hover:border-blue-500/30 transition-all shadow-xs"
                    >
                      {/* Category & Impact Tag */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 dark:border-blue-800/40">
                          {news.category || 'Market Trend'}
                        </span>
                        <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                          {news.impactTag || '⚡ High Impact'}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {news.title}
                      </h5>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {news.snippet}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span className="font-medium text-slate-500 dark:text-slate-400">
                          {news.source || 'Verified Source'} • {news.publishedDate || 'Recent'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleSendMessage(
                                `How can we turn this recent market development into a high-converting promotional angle for ${
                                  activeProduct ? activeProduct.name : 'our product'
                                }: "${news.title}"? Generate a structured action table and sample post copy.`
                              )
                            }
                            className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5"
                          >
                            <Zap className="w-3 h-3" />
                            Use in Strategy
                          </button>
                          {news.url && (
                            <a
                              href={news.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
                              title="Read source article"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 space-y-2 my-auto">
                    <Globe className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                    <p className="text-xs font-medium">No signals matching your search filter.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNewsSearchTerm('');
                        setNewsCategoryFilter('ALL');
                        fetchRealMarketNews(false);
                      }}
                    >
                      Reset & Reload News
                    </Button>
                  </div>
                )}
              </div>

              {/* Pagination Controls (Back & Next) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  disabled={newsCurrentPage <= 1}
                  onClick={() => setNewsCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#f8fafc]/[0.04] disabled:opacity-40 disabled:pointer-events-none transition-colors font-medium"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <span className="text-[11px] font-semibold">
                  Page {newsCurrentPage} of {totalNewsPages} ({filteredNews.length} Signals)
                </span>

                <button
                  type="button"
                  disabled={newsCurrentPage >= totalNewsPages}
                  onClick={() => setNewsCurrentPage((p) => Math.min(totalNewsPages, p + 1))}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#f8fafc]/[0.04] disabled:opacity-40 disabled:pointer-events-none transition-colors font-medium"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* ALGORITHM VIRALITY RADAR */
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                ORGANIC ALGORITHM MULTIPLIER MATRIX
              </span>

              {[
                {
                  platform: 'TikTok & Short-Form Video',
                  multiplier: 96,
                  color: '#2563eb',
                  primaryLever: 'First 2.0s Audio/Visual Hook & Watch Completion',
                  samplePrompt: `Generate 3 viral 30-second TikTok video scripts with visual tension hooks for ${activeProduct ? activeProduct.name : 'our product'} that capitalize on the current social algorithm.`,
                },
                {
                  platform: 'LinkedIn Executive Thought Leadership',
                  multiplier: 94,
                  color: '#0284c7',
                  primaryLever: 'Text Dwell Time (>90s) & Meaningful 1st-Hour Replies',
                  samplePrompt: `Write a high-converting, contrarian LinkedIn post for ${activeProduct ? activeProduct.name : 'our product'} that maximizes dwell time and sparks debate in the comments.`,
                },
                {
                  platform: 'Reddit Community & r/boardgames',
                  multiplier: 91,
                  color: '#f97316',
                  primaryLever: 'Organic Upvote Velocity & Zero Corporate Pitchiness',
                  samplePrompt: `Draft a transparent, problem-solving post for Reddit detailing behind-the-scenes lessons from building ${activeProduct ? activeProduct.name : 'our product'}.`,
                },
                {
                  platform: 'X / Twitter Narrative Threads',
                  multiplier: 88,
                  color: '#0f172a',
                  primaryLever: 'Quote Retweets, Visual Cards & Cliffhanger Pacing',
                  samplePrompt: `Compose a high-velocity 6-tweet thread for ${activeProduct ? activeProduct.name : 'our product'} breaking down why traditional alternatives fail.`,
                },
                {
                  platform: 'Instagram Carousels & Reels',
                  multiplier: 86,
                  color: '#e11d48',
                  primaryLever: 'Saves, DM Shares & Carousel Swipe-Through Rate',
                  samplePrompt: `Design a 5-slide visual carousel copy breakdown for Instagram showcasing ${activeProduct ? activeProduct.name : 'our product'}'s core value proposition.`,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0e1424] border border-blue-100 dark:border-slate-800 space-y-2 hover:border-blue-400 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">
                      {item.platform}
                    </span>
                    <span className="font-mono font-bold text-xs" style={{ color: item.color }}>
                      {item.multiplier}% Virality
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-[#f8fafc]/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.multiplier}%`, backgroundColor: item.color }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    <strong>Algorithmic Trigger:</strong> {item.primaryLever}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleSendMessage(item.samplePrompt)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-[#f8fafc] dark:bg-slate-900/60 border border-slate-200/80 text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-amber-500" />
                    Inject Strategy into Globe AI
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
