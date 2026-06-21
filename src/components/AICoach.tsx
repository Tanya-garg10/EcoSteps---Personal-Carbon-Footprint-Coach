import React, { useState, useRef, useEffect } from 'react';
import { CoachMessage, Category, ActivityLog } from '../types';
import { 
  Send, Bot, CornerDownLeft, Sparkles, AlertCircle, Trash2, 
  RefreshCw, Flame, HelpCircle, Apple, Lightbulb
} from 'lucide-react';
import Markdown from 'react-markdown';

interface AICoachProps {
  messages: CoachMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  logs: ActivityLog[];
  dailyTarget: number;
  isLoading: boolean;
  errorMsg: string | null;
}

export default function AICoach({
  messages,
  onSendMessage,
  onClearChat,
  logs,
  dailyTarget,
  isLoading,
  errorMsg
}: AICoachProps) {
  const [inputText, setInputText] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getCategoryEmissions = (cat: Category) => {
    return logs.filter(l => l.category === cat).reduce((sum, l) => sum + l.emissions, 0);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handlePresetClick = (presetText: string) => {
    if (isLoading) return;
    onSendMessage(presetText);
  };

  const presetHints = [
    { text: "Analyze my footprint logs & suggest changes", label: "Analyze My Footprint", icon: Lightbulb },
    { text: "What are the easiest ways to save 5kg CO2 daily?", label: "Save 5kg Fast", icon: Flame },
    { text: "Explain the emission factor differences in food types", label: "Food Footprints Explained", icon: Apple },
    { text: "Suggest a low-carbon travel plan for short commutes", label: "Green Travel Plan", icon: Sparkles },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[500px] text-[#2d2d2a] lg:h-[calc(100vh-240px)]">
      {/* Left block: Coach Intro & Context Highlights */}
      <div className="lg:col-span-1 space-y-6 flex flex-col justify-start lg:overflow-y-auto lg:max-h-full lg:pr-1.5">
        <div className="bg-white border border-[#e8e8e1] p-5 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col shrink-0">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#5A5A40]/5 blur-2xl rounded-full" />
          
          <div className="text-center pb-5 border-b border-[#e8e8e1] mb-5">
            <span className="inline-flex p-3 rounded-2xl bg-[#5A5A40]/10 text-[#5A5A40] mb-3 border border-[#5A5A40]/10">
              <Bot size={32} className="animate-pulse" />
            </span>
            <h3 className="font-display text-base font-bold text-[#2d2d2a]" style={{ fontFamily: 'Georgia, serif' }}>EcoSteps AI Coach</h3>
            <p className="text-[10px] text-[#5A5A40] font-bold uppercase tracking-widest mt-0.5">Dual-Sector Climate Expert</p>
          </div>

          <p className="text-xs text-[#6b6b63] leading-relaxed mb-4">
            Welcome to your customized EcoSteps conversation. I will read your live tracking parameters and daily records to suggest customized carbon offsets, energy schedules, and food recommendations.
          </p>

          <div className="bg-[#f5f5f0] p-4 border border-[#e8e8e1] rounded-2xl space-y-3">
            <h4 id="coach-context-table-title" className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] border-b border-[#e8e8e1] pb-1.5 font-display" style={{ fontFamily: 'Georgia, serif' }}>
              Carbon Footprint Dashboard
            </h4>
            
            <div className="overflow-x-auto">
              <table id="coach-footprint-table" className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e8e8e1] text-[#8e8e84] uppercase tracking-wider text-[8px] font-bold">
                    <th className="pb-1 text-[#8e8e84]">Metric / Sector</th>
                    <th className="pb-1 text-right text-[#8e8e84]">CO₂ Load</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e8e1]/65 text-[11px] text-[#2d2d2a]">
                  <tr>
                    <td className="py-2 font-medium text-[#6b6b63] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5a5a40]" />
                      Daily Target
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-[#2d2d2a]">
                      {dailyTarget} kg
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-[#6b6b63] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6a7e8f]" />
                      Transit Sector
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-[#2d2d2a]">
                      {getCategoryEmissions('transportation').toFixed(1)} kg
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-[#6b6b63] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d67d5e]" />
                      Home Energy
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-[#2d2d2a]">
                      {getCategoryEmissions('energy').toFixed(1)} kg
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-[#6b6b63] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40]" />
                      Food & Diet
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-[#2d2d2a]">
                      {getCategoryEmissions('food').toFixed(1)} kg
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-[#6b6b63] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8a8a7c]" />
                      Waste/Refuse
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-[#2d2d2a]">
                      {getCategoryEmissions('waste').toFixed(1)} kg
                    </td>
                  </tr>
                  <tr className="border-t-2 border-[#d6d6ce]">
                    <td className="py-2 font-bold text-[#2d2d2a]">
                      Total Footprint
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-[#D67D5E]">
                      {logs.reduce((sum, l) => sum + l.emissions, 0).toFixed(1)} kg
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-[9px] text-[#8e8e84] flex justify-between items-center bg-white/50 p-2 rounded-xl border border-[#e8e8e1]/60">
              <span className="font-semibold">Logged instances:</span>
              <span className="font-mono font-bold text-[#2d2d2a]">{logs.length} entries</span>
            </div>
          </div>
        </div>

        {/* Suggestion prompt seeds */}
        <div className="hidden lg:block space-y-3 shrink-0">
          <h4 className="text-[10px] font-bold text-[#a1a196] uppercase tracking-widest pl-1 flex items-center gap-1.5" style={{ fontFamily: 'Georgia, serif' }}>
            <HelpCircle size={13} className="text-[#a1a196]" /> Quick Inquiries
          </h4>
          <div className="space-y-2">
            {presetHints.map((hint, idx) => {
              const HintIcon = hint.icon;
              return (
                <button
                  id={`preset-prompt-${idx}`}
                  key={idx}
                  onClick={() => handlePresetClick(hint.text)}
                  disabled={isLoading}
                  className="w-full text-left p-3.5 bg-[#f5f5f0]/40 hover:bg-[#f5f5f0] border border-[#e8e8e1] hover:border-[#5A5A40]/30 rounded-2xl text-xs text-[#2d2d2a] transition flex items-start gap-2.5 cursor-pointer group"
                >
                  <HintIcon size={14} className="text-[#5A5A40] shrink-0 mt-0.5 group-hover:scale-110 transition" />
                  <span className="group-hover:text-[#5A5A40] font-semibold transition">{hint.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right block: Main Chat frame */}
      <div className="lg:col-span-3 bg-white border border-[#e8e8e1] rounded-[32px] shadow-sm flex flex-col overflow-hidden relative min-h-[420px]">
        {/* Chat top header banner */}
        <div className="px-6 py-4 bg-[#f5f5f0] border-b border-[#e8e8e1] flex justify-between items-center z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5A5A40] animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-[#2d2d2a] font-display" style={{ fontFamily: 'Georgia, serif' }}>Active Coach Dialogue</h3>
              <p className="text-[10px] text-[#8e8e84]">Integrated with Gemini sustainable knowledge</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              id="clear-chat-btn"
              onClick={onClearChat}
              className="p-1 px-3 text-[10px] font-bold uppercase tracking-wider text-[#D67D5E] hover:text-[#c16748] bg-white border border-[#e8e8e1] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={11} /> Clear Thread
            </button>
          )}
        </div>

        {/* Chat Messages flow stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f5f5f0]/20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto p-4 py-8">
              <Bot size={44} className="text-[#5A5A40]/30 mb-3" />
              <h4 className="font-display text-sm font-bold text-[#2d2d2a] mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>Welcome, Eco steps Companion!</h4>
              <p className="text-xs text-[#8e8e84] leading-relaxed">
                I am your personal AI Carbon Coach. Let me assist you in parsing your logged footprint metrics, planning meat-free culinary weeks, or researching the green performance of your region's heating tools.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center lg:hidden">
                {presetHints.map((hint, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(hint.text)}
                    className="px-3 py-1.5 text-[10px] bg-white border border-[#e8e8e1] text-[#2d2d2a] font-semibold rounded-lg hover:bg-[#f5f5f0]"
                  >
                    {hint.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    <span className={`p-2 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center border font-bold text-xs uppercase ${
                      isUser 
                        ? 'bg-[#6A7E8F] text-white border-transparent' 
                        : 'bg-[#5A5A40]/15 text-[#5A5A40] border-[#5A5A40]/20'
                    }`}>
                      {isUser ? 'ME' : 'AI'}
                    </span>
                    <div className="space-y-1">
                      <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        isUser 
                          ? 'bg-[#6A7E8F] text-white rounded-tr-none' 
                          : 'bg-[#f5f5f0] border border-[#e8e8e1] text-[#2d2d2a] rounded-tl-none pr-6'
                      }`}>
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="markdown-body select-text space-y-2">
                            <Markdown>{msg.content}</Markdown>
                          </div>
                        )}
                      </div>
                      <span className="block text-[8px] text-[#8e8e84] font-mono text-right scale-90">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loader placeholder */}
              {isLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <span className="p-2 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center border bg-[#5A5A40]/10 text-[#5A5A40] border-[#5A5A40]/20 animate-pulse">
                    <Bot size={16} />
                  </span>
                  <div className="bg-[#f5f5f0] border border-[#e8e8e1] p-4 rounded-2xl rounded-tl-none flex items-center gap-2.5 text-xs text-[#6b6b63]">
                    <RefreshCw size={13} className="animate-spin text-[#5A5A40]" />
                    <span>Analyzing carbon metrics & preparing advice...</span>
                  </div>
                </div>
              )}

              {/* Server-Side Error Handler block */}
              {errorMsg && (
                <div className="p-4 bg-[#8A3A2B]/10 border border-[#8A3A2B]/20 rounded-xl text-xs text-[#8A3A2B] flex items-start gap-2.5 max-w-lg mx-auto">
                  <AlertCircle size={16} className="text-[#8A3A2B] mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-bold text-[#8A3A2B]">Coach Connection Blocked</h5>
                    <p className="mt-1 leading-normal">
                      {errorMsg}
                    </p>
                    <p className="mt-2 text-[10px] text-[#2d2d2a]">
                      Ensure your API key is properly injected via the <strong className="font-semibold">Settings &gt; Secrets</strong> manager on the top-right AI Studio workspace panel.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Bottom chat input bar */}
        <div className="p-4 bg-white border-t border-[#e8e8e1] z-10">
          <form onSubmit={handleSend} className="relative flex items-center" id="coach-input-form">
            <textarea
              id="coach-chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              rows={1}
              maxLength={1200}
              placeholder="Ask the Carbon Coach... (e.g., 'What is the carbon load of carpooling vs transit?')"
              className="w-full bg-[#f5f5f0]/50 border border-[#e8e8e1] rounded-xl pl-4 pr-14 py-3 text-xs text-[#2d2d2a] placeholder-[#8e8e84] focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] resize-none"
              disabled={isLoading}
            />
            <button
              id="send-coach-chat-btn"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-3 p-1.5 rounded-lg bg-[#5A5A40] hover:bg-[#494933] text-white disabled:bg-[#f5f5f0] disabled:text-[#a1a196] transition-all cursor-pointer"
            >
              <Send size={15} />
            </button>
          </form>
          <div className="mt-2 text-[9px] text-[#8e8e84] flex justify-between font-semibold font-mono">
            <span>Integrated with Gemini AI</span>
            <span>Enter to Submit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
