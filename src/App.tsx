import React, { useState, useEffect } from 'react';
import { ActivityLog, Category, CoachMessage, EcoChallenge, DailyLimitTarget } from './types';
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import Challenges from './components/Challenges';
import { 
  Leaf, LayoutDashboard, Bot, Trophy, Compass, ArrowUpRight, 
  HelpCircle, Sparkles, BookOpen, UserCheck
} from 'lucide-react';

// Seeding standard initial challenge list
const INITIAL_CHALLENGES: EcoChallenge[] = [
  {
    id: 'car-free-day',
    title: 'Car-Free Commuter',
    description: 'Commit to riding public transit, cycling, or walking for all of today\'s local travel.',
    category: 'transportation',
    difficulty: 'easy',
    co2Savings: 4.8,
    isJoined: false,
    isCompleted: false,
    progress: 0
  },
  {
    id: 'plant-power',
    title: 'Vegan Food Feast',
    description: 'Avoid all meat and dairy products today, logging strictly vegan or plant-based raw meals.',
    category: 'food',
    difficulty: 'easy',
    co2Savings: 3.5,
    isJoined: false,
    isCompleted: false,
    progress: 0
  },
  {
    id: 'passive-dryer',
    title: 'Passive Clothes Drying',
    description: 'Air-dry your laundry on lines/racks instead of running the hot electrical tumbler dryer.',
    category: 'energy',
    difficulty: 'medium',
    co2Savings: 2.2,
    isJoined: false,
    isCompleted: false,
    progress: 0
  },
  {
    id: 'compost-sort',
    title: 'Zero Landfill Organic Sort',
    description: 'Ensure 100% of organic kitchen scraps and yard trimmings are composted instead of binned.',
    category: 'waste',
    difficulty: 'easy',
    co2Savings: 1.2,
    isJoined: false,
    isCompleted: false,
    progress: 0
  },
  {
    id: 'lower-thermostat',
    title: 'Thermostat Eco Shift',
    description: 'Lower your home heating goal limit by 2°C (or reduce cooling operation by 2 hours).',
    category: 'energy',
    difficulty: 'medium',
    co2Savings: 3.8,
    isJoined: false,
    isCompleted: false,
    progress: 0
  },
  {
    id: 'power-down',
    title: 'Eco Screen Detox',
    description: 'Turn off all major household gaming and extra screens for 4 consecutive afternoon hours.',
    category: 'energy',
    difficulty: 'easy',
    co2Savings: 0.8,
    isJoined: false,
    isCompleted: false,
    progress: 0
  }
];

// Seeding starter tracking history data for instantaneous graphic rendering
const getSeedingLogs = (): ActivityLog[] => {
  const list: ActivityLog[] = [];
  const today = new Date();
  
  // past 6 days logs to show beautiful lines and averages
  const seedConfigs = [
    { offsetDays: 5, logs: [
      { category: 'transportation' as Category, type: 'Gasoline Car Voyage', value: 25, unit: 'km', emissions: 5.25 },
      { category: 'energy' as Category, type: 'Grid Electricity Usage', value: 8, unit: 'kWh', emissions: 3.36 },
      { category: 'food' as Category, type: 'Average Diet (Mix of poultry/meat)', value: 1, unit: 'days', emissions: 3.80 },
    ]},
    { offsetDays: 4, logs: [
      { category: 'transportation' as Category, type: 'Public Bus Transit', value: 12, unit: 'km', emissions: 0.72 },
      { category: 'energy' as Category, type: 'Grid Electricity Usage', value: 10, unit: 'kWh', emissions: 4.20 },
      { category: 'food' as Category, type: 'Vegetarian Diet', value: 1, unit: 'days', emissions: 1.20 },
      { category: 'waste' as Category, type: 'Sent to Landfill Trash', value: 2, unit: 'small bags', emissions: 1.20 },
    ]},
    { offsetDays: 3, logs: [
      { category: 'transportation' as Category, type: 'Train/Metro Voyage', value: 30, unit: 'km', emissions: 1.20 },
      { category: 'energy' as Category, type: 'Grid Electricity Usage', value: 7, unit: 'kWh', emissions: 2.94 },
      { category: 'food' as Category, type: 'Vegan / Plant-Based Diet', value: 1, unit: 'days', emissions: 0.55 },
    ]},
    { offsetDays: 2, logs: [
      { category: 'transportation' as Category, type: 'Gasoline Car Voyage', value: 40, unit: 'km', emissions: 8.40 },
      { category: 'energy' as Category, type: 'Grid Electricity Usage', value: 12, unit: 'kWh', emissions: 5.04 },
      { category: 'food' as Category, type: 'High-Emissions Diet (Daily/Heavy beef-eating)', value: 1, unit: 'days', emissions: 7.20 },
      { category: 'waste' as Category, type: 'Composted Food/Yard Waste', value: 3, unit: 'kg', emissions: -0.30 },
    ]},
    { offsetDays: 1, logs: [
      { category: 'transportation' as Category, type: 'Walking or Cycling', value: 8, unit: 'km', emissions: 0.00 },
      { category: 'energy' as Category, type: 'Solar Output / Renewables Offset', value: 5, unit: 'kWh', emissions: -2.10 },
      { category: 'food' as Category, type: 'Vegetarian Diet', value: 1, unit: 'days', emissions: 1.20 },
    ]}
  ];

  seedConfigs.forEach(cfg => {
    const d = new Date(today);
    d.setDate(today.getDate() - cfg.offsetDays);
    const dateStr = d.toISOString().split('T')[0];

    cfg.logs.forEach((seeded, sidx) => {
      list.push({
        id: `seed-${cfg.offsetDays}-${sidx}`,
        date: dateStr,
        ...seeded
      });
    });
  });

  return list;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'coach' | 'challenges'>('dashboard');
  
  // Central Data states
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [target, setTarget] = useState<DailyLimitTarget>({ limit: 12, streak: 4 });
  const [challenges, setChallenges] = useState<EcoChallenge[]>([]);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  
  // AI coach status states
  const [isCoachLoading, setIsCoachLoading] = useState<boolean>(false);
  const [coachError, setCoachError] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    // 1. Logs
    const storedLogs = localStorage.getItem('ecosteps_logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    } else {
      const seeded = getSeedingLogs();
      setLogs(seeded);
      localStorage.setItem('ecosteps_logs', JSON.stringify(seeded));
    }

    // 2. Targets configuration
    const storedTarget = localStorage.getItem('ecosteps_target');
    if (storedTarget) {
      setTarget(JSON.parse(storedTarget));
    } else {
      const defaultTarget = { limit: 10, streak: 4 };
      setTarget(defaultTarget);
      localStorage.setItem('ecosteps_target', JSON.stringify(defaultTarget));
    }

    // 3. Dynamic Challenges list
    const storedChallenges = localStorage.getItem('ecosteps_challenges');
    if (storedChallenges) {
      setChallenges(JSON.parse(storedChallenges));
    } else {
      setChallenges(INITIAL_CHALLENGES);
      localStorage.setItem('ecosteps_challenges', JSON.stringify(INITIAL_CHALLENGES));
    }

    // 4. Coach Chat logs
    const storedChats = localStorage.getItem('ecosteps_chats');
    if (storedChats) {
      setMessages(JSON.parse(storedChats));
    } else {
      const defaultWelcome: CoachMessage = {
        id: 'initial-welcome',
        role: 'assistant',
        content: `Hi there, I am your **EcoSteps Personal Carbon Coach**! 🌿\n\nI am connected directly server-side to help you navigate carbon calculations, lower home heating impact, and plan sustainable travels.\n\nType any natural prompt below, or select high-priority inquiries dynamically using the suggestions options in the left bar!`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages([defaultWelcome]);
      localStorage.setItem('ecosteps_chats', JSON.stringify([defaultWelcome]));
    }
  }, []);

  // Sync utilities
  const syncLogs = (newLogs: ActivityLog[]) => {
    setLogs(newLogs);
    localStorage.setItem('ecosteps_logs', JSON.stringify(newLogs));
    recalculateStreak(newLogs, target.limit);
  };

  const syncTarget = (newLimit: number) => {
    const updatedTarget = { ...target, limit: newLimit };
    setTarget(updatedTarget);
    localStorage.setItem('ecosteps_target', JSON.stringify(updatedTarget));
    recalculateStreak(logs, newLimit);
  };

  const syncChallenges = (newChallenges: EcoChallenge[]) => {
    setChallenges(newChallenges);
    localStorage.setItem('ecosteps_challenges', JSON.stringify(newChallenges));
  };

  const syncChats = (newChats: CoachMessage[]) => {
    setMessages(newChats);
    localStorage.setItem('ecosteps_chats', JSON.stringify(newChats));
  };

  // Streak Calculator
  const recalculateStreak = (currentLogs: ActivityLog[], limit: number) => {
    let streakCount = 0;
    const today = new Date();
    
    // Check backwards from yesterday
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const dayLogs = currentLogs.filter(log => log.date === dateStr);
      if (dayLogs.length === 0 && i > 0) {
        // If no log exists for a past day, don't necessarily break if previous days had none,
        // but let's count consecutive days where they are logged AND under the limit.
        continue; 
      }
      
      const dayTotal = dayLogs.reduce((acc, log) => acc + log.emissions, 0);
      if (dayTotal <= limit && dayLogs.length > 0) {
        streakCount++;
      } else if (dayTotal > limit) {
        break; // Streak broken
      }
    }

    setTarget(prev => {
      const updated = { ...prev, streak: streakCount };
      localStorage.setItem('ecosteps_target', JSON.stringify(updated));
      return updated;
    });
  };

  // Add Log Item
  const handleAddLog = (newLogEntry: Omit<ActivityLog, 'id'>) => {
    const freshLog: ActivityLog = {
      id: `log-${Date.now()}`,
      ...newLogEntry
    };
    const updated = [freshLog, ...logs];
    syncLogs(updated);
  };

  // Delete Log Item
  const handleDeleteLog = (id: string) => {
    const updated = logs.filter(log => log.id !== id);
    syncLogs(updated);
  };

  // Join Challenge catalog quest
  const handleJoinChallenge = (id: string) => {
    const updated = challenges.map(c => 
      c.id === id ? { ...c, isJoined: true, progress: 10 } : c
    );
    syncChallenges(updated);
  };

  // Complete eco-challenge (subtract rewarding offset in logs)
  const handleCompleteChallenge = (id: string, co2Savings: number) => {
    // 1. Mark completed
    const updatedChallenges = challenges.map(c => 
      c.id === id ? { ...c, isCompleted: true, isJoined: false, progress: 100 } : c
    );
    syncChallenges(updatedChallenges);

    // 2. Add an offset record to logs corresponding to reward
    handleAddLog({
      date: new Date().toISOString().split('T')[0],
      category: challenges.find(c => c.id === id)?.category || 'energy',
      type: `Eco-Quest Win: ${challenges.find(c => c.id === id)?.title || 'Saving'}`,
      value: 1,
      unit: 'quest reward',
      emissions: -co2Savings, // reduction
      details: 'Reward earned for successfully validating standard green quest challenge!'
    });
  };

  // Handle send message to Gemini coach
  const handleSendMessage = async (text: string) => {
    const userMsg: CoachMessage = {
      id: `chat-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    const updatedChats = [...messages, userMsg];
    syncChats(updatedChats);

    setIsCoachLoading(true);
    setCoachError(null);

    // Extract stats to server context
    const currentDayStr = new Date().toISOString().split('T')[0];
    const userContext = {
      totalCo2: logs.reduce((sum, l) => sum + l.emissions, 0),
      limit: target.limit,
      logsByCategory: {
        transportation: logs.filter(l => l.category === 'transportation').reduce((s, l) => s + l.emissions, 0),
        energy: logs.filter(l => l.category === 'energy').reduce((s, l) => s + l.emissions, 0),
        food: logs.filter(l => l.category === 'food').reduce((s, l) => s + l.emissions, 0),
        waste: logs.filter(l => l.category === 'waste').reduce((s, l) => s + l.emissions, 0),
      },
      recentLogs: logs.slice(0, 5).map(l => ({ date: l.date, type: l.type, emissions: l.emissions }))
    };

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedChats,
          userContext
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMsg: CoachMessage = {
        id: `chat-asst-${Date.now()}`,
        role: 'assistant',
        content: data.text || "I was unable to formulate a customized carbon solution. Let's try again shortly!",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };

      syncChats([...updatedChats, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setCoachError(err.message || "Unable to establish WebSocket / HTTP stream context with Carbon Coach server.");
    } finally {
      setIsCoachLoading(false);
    }
  };

  const handleClearChat = () => {
    const defaultWelcome: CoachMessage = {
      id: 'initial-welcome-re',
      role: 'assistant',
      content: "Let's begin a fresh session! Ask me any structural questions on carbon footprints, local transport averages, or how our challenges save daily targets.",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    syncChats([defaultWelcome]);
    setCoachError(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#2d2d2a] flex flex-col font-sans">
      {/* Absolute high-fidelity top header */}
      <header className="border-b border-[#e8e8e1] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-[#5A5A40] text-white rounded-full flex items-center justify-center shadow-sm">
              <Leaf size={18} className="text-white fill-white" />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight font-display text-[#5A5A40]" style={{ fontFamily: 'Georgia, serif' }}>
                EcoSteps
              </h1>
              <p className="text-[10px] text-[#8e8e84] uppercase tracking-wider font-semibold">Personal Carbon Coach</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center bg-[#f5f5f0] p-1 rounded-xl border border-[#e8e8e1]">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#5A5A40] text-white shadow-sm font-bold'
                  : 'text-[#6b6b63] hover:text-[#2d2d2a] hover:bg-[#e8e8e1]/60'
              }`}
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </button>
            
            <button
              id="tab-coach"
              onClick={() => setActiveTab('coach')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'coach'
                  ? 'bg-[#5A5A40] text-white shadow-sm font-bold'
                  : 'text-[#6b6b63] hover:text-[#2d2d2a] hover:bg-[#e8e8e1]/60'
              }`}
            >
              <Bot size={14} />
              <span>AI Eco-Coach</span>
            </button>

            <button
              id="tab-challenges"
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'challenges'
                  ? 'bg-[#5A5A40] text-white shadow-sm font-bold'
                  : 'text-[#6b6b63] hover:text-[#2d2d2a] hover:bg-[#e8e8e1]/60'
              }`}
            >
              <Trophy size={14} />
              <span>Missions</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main app body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {activeTab === 'dashboard' && (
          <Dashboard
            logs={logs}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
            target={target}
            onChangeTarget={syncTarget}
          />
        )}

        {activeTab === 'coach' && (
          <AICoach
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            logs={logs}
            dailyTarget={target.limit}
            isLoading={isCoachLoading}
            errorMsg={coachError}
          />
        )}

        {activeTab === 'challenges' && (
          <Challenges
            challenges={challenges}
            onJoinChallenge={handleJoinChallenge}
            onCompleteChallenge={handleCompleteChallenge}
          />
        )}
      </main>

      {/* Humble literal footer */}
      <footer className="border-t border-[#e8e8e1] bg-white/60 py-6 mt-auto text-[#8e8e84]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium">
          <span>
            © 2026 EcoSteps Carbon Footprint Tracker. Confidentially secured with Natural Tones.
          </span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1 text-[11px] text-[#5A5A40]">
              <UserCheck size={12} className="text-[#5A5A40]" /> Inspired by Tanya Garg
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
