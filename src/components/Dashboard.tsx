import React, { useState, useMemo } from 'react';
import { ActivityLog, Category, DailyLimitTarget } from '../types';
import { CARBON_FACTORS, calculateEmissions } from '../utils/carbonCalc';
import { 
  Car, Zap, Utensils, Trash2, Plus, Filter, Calendar, Info, 
  Leaf, TrendingDown, RefreshCw, AlertTriangle, ArrowRight,
  TrendingUp, Compass, Flame, Smile
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, 
  LineChart, Line
} from 'recharts';

interface DashboardProps {
  logs: ActivityLog[];
  onAddLog: (log: Omit<ActivityLog, 'id'>) => void;
  onDeleteLog: (id: string) => void;
  target: DailyLimitTarget;
  onChangeTarget: (newLimit: number) => void;
}

export default function Dashboard({ 
  logs, 
  onAddLog, 
  onDeleteLog, 
  target, 
  onChangeTarget 
}: DashboardProps) {
  // Activity Log Form State
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>('transportation');
  const [typeId, setTypeId] = useState<string>(CARBON_FACTORS.transportation[0].id);
  const [value, setValue] = useState<number>(10);
  const [details, setDetails] = useState<string>('');
  
  // Filtering state
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [showTargetModal, setShowTargetModal] = useState<boolean>(false);
  const [tempTargetLimit, setTempTargetLimit] = useState<number>(target.limit);

  // Auto-update typeId when category changes
  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setTypeId(CARBON_FACTORS[cat][0].id);
  };

  // Preview of live emissions before adding
  const livePreview = useMemo(() => {
    return calculateEmissions(category, typeId, value);
  }, [category, typeId, value]);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value <= 0) return;
    
    onAddLog({
      date,
      category,
      type: livePreview.label,
      value,
      unit: livePreview.unit,
      emissions: livePreview.emissions,
      details: details.trim() || undefined
    });

    // Reset some states
    setDetails('');
  };

  // calculations for Metrics
  const summaryByCategory = useMemo(() => {
    const sums = { transportation: 0, energy: 0, food: 0, waste: 0 };
    logs.forEach(log => {
      sums[log.category] += log.emissions;
    });
    return sums;
  }, [logs]);

  const totalEmissions = useMemo(() => {
    return logs.reduce((acc, log) => acc + log.emissions, 0);
  }, [logs]);

  // Get emissions for past 7 days (including empty days)
  const last7DaysEmissions = useMemo(() => {
    const result: { name: string; emissions: number }[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayLogs = logs.filter(log => log.date === dateStr);
      const dayTotal = dayLogs.reduce((acc, log) => acc + log.emissions, 0);
      
      // format date as "Jun 20"
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      result.push({
        name: label,
        emissions: Number(dayTotal.toFixed(2)),
      });
    }
    return result;
  }, [logs]);

  // filtered logs list
  const filteredLogs = useMemo(() => {
    const list = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    if (filterCategory === 'all') return list;
    return list.filter(log => log.category === filterCategory);
  }, [logs, filterCategory]);

  // Color mappings
  const COLORS = {
    transportation: '#6A7E8F', // Dusty blue-slate
    energy: '#D67D5E',         // Terracotta
    food: '#5A5A40',           // Sage Green
    waste: '#8a8a7c',          // Earth Warm Bark
  };

  const chartData = useMemo(() => {
    return [
      { name: 'Transportation', value: Math.max(0, summaryByCategory.transportation), color: COLORS.transportation },
      { name: 'Home & Energy', value: Math.max(0, summaryByCategory.energy), color: COLORS.energy },
      { name: 'Food & Diet', value: Math.max(0, summaryByCategory.food), color: COLORS.food },
      { name: 'Waste Disposal', value: Math.max(0, summaryByCategory.waste), color: COLORS.waste },
    ].filter(item => item.value > 0);
  }, [summaryByCategory]);

  const currentDayTotal = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return logs
      .filter(log => log.date === todayStr)
      .reduce((acc, log) => acc + log.emissions, 0);
  }, [logs]);

  const targetPercentage = useMemo(() => {
    if (target.limit <= 0) return 100;
    return Math.min(100, (currentDayTotal / target.limit) * 100);
  }, [currentDayTotal, target.limit]);

  const progressColorClass = () => {
    if (targetPercentage >= 95) return 'bg-[#D67D5E]'; // Terracotta alert
    if (targetPercentage >= 75) return 'bg-amber-500';
    return 'bg-[#5A5A40]'; // Green sage save
  };

  const currentUnitLabel = CARBON_FACTORS[category].find(opt => opt.id === typeId)?.unit || 'units';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#2d2d2a]">
      {/* Target Modal */}
      {showTargetModal && (
        <div id="target-modal" className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#e8e8e1] rounded-[32px] w-full max-w-sm p-6 shadow-2xl relative text-[#2d2d2a]">
            <h3 className="font-display text-xl font-bold text-[#2d2d2a] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Adjust Carbon Daily Target</h3>
            <p className="text-xs text-[#6b6b63] mb-4">
              Setting target emissions low is critical to driving reduction strategies. The UN average recommend global target is <strong className="text-[#5A5A40] font-mono">5.0 kg</strong> CO2e per day.
            </p>
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a1a196] mb-2">
                Daily Limit (kg CO2e)
              </label>
              <input
                id="target-limit-input"
                type="number"
                step="0.5"
                min="1"
                max="100"
                value={tempTargetLimit}
                onChange={(e) => setTempTargetLimit(parseFloat(e.target.value) || 5)}
                className="w-full bg-[#f5f5f0] border border-[#e8e8e1] rounded-xl px-4 py-3 text-[#2d2d2a] font-mono focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none"
                placeholder="UN Sustainable limit is 5"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                id="cancel-target-btn"
                type="button"
                onClick={() => setShowTargetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#8e8e84] hover:text-[#2d2d2a] transition"
              >
                Cancel
              </button>
              <button
                id="save-target-btn"
                type="button"
                onClick={() => {
                  onChangeTarget(tempTargetLimit);
                  setShowTargetModal(false);
                }}
                className="px-5 py-2.5 text-xs bg-[#5A5A40] text-white font-bold rounded-xl hover:bg-[#494933] transition shadow-sm"
              >
                Save Limit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Column 1: Left Form for adding activity */}
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-white border border-[#e8e8e1] p-6 rounded-[32px] relative shadow-sm overflow-hidden text-[#2d2d2a]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#5A5A40]/5 blur-2xl rounded-full" />
          
          <h2 className="font-display text-xl font-bold text-[#2d2d2a] mb-6 flex items-center gap-2.5" style={{ fontFamily: 'Georgia, serif' }}>
            <span className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-full">
              <Leaf size={16} />
            </span>
            Log Daily Activity
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" id="emissions-log-form">
            {/* Category selection selector pills */}
            <div>
              <label className="block text-xs font-bold text-[#a1a196] uppercase tracking-widest mb-2.5">
                Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'transportation', label: 'Transit', icon: Car, color: 'text-[#6A7E8F]', bg: 'hover:border-[#6A7E8F]' },
                  { id: 'energy', label: 'Home', icon: Zap, color: 'text-[#D67D5E]', bg: 'hover:border-[#D67D5E]' },
                  { id: 'food', label: 'Food', icon: Utensils, color: 'text-[#5A5A40]', bg: 'hover:border-[#5A5A40]' },
                  { id: 'waste', label: 'Waste', icon: Trash2, color: 'text-[#8a8a7c]', bg: 'hover:border-[#8a8a7c]' },
                ].map((catItem) => {
                  const IconComp = catItem.icon;
                  const isSelected = category === catItem.id;
                  return (
                    <button
                      id={`cat-pill-${catItem.id}`}
                      key={catItem.id}
                      type="button"
                      onClick={() => handleCategoryChange(catItem.id as Category)}
                      className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#5A5A40] border-[#5A5A40] text-white shadow-sm font-semibold' 
                          : 'bg-[#f5f5f0]/50 border-[#e8e8e1] text-[#6b6b63] hover:bg-[#e8e8e1]/60'
                      }`}
                    >
                      <IconComp size={16} className={`${isSelected ? 'text-white' : catItem.color}`} />
                      <span className="text-[10px] mt-1 font-semibold">{catItem.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold text-[#a1a196] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Calendar size={12} className="text-[#a1a196]" />
                Date
              </label>
              <input
                id="log-date"
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#f5f5f0]/55 border border-[#e8e8e1] rounded-xl px-4 py-2.5 text-xs text-[#2d2d2a] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none"
                required
              />
            </div>

            {/* Sub Type */}
            <div>
              <label className="block text-xs font-bold text-[#a1a196] uppercase tracking-widest mb-1.5">
                Activity Specifics
              </label>
              <select
                id="log-type-select"
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                className="w-full bg-[#f5f5f0]/55 border border-[#e8e8e1] cursor-pointer rounded-xl px-3 py-2.5 text-xs text-[#2d2d2a] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none"
              >
                {CARBON_FACTORS[category].map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label} ({opt.factor >= 0 ? `+${opt.factor}` : opt.factor} kg/unit)
                  </option>
                ))}
              </select>
            </div>

            {/* Value quantity input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-[#a1a196] uppercase tracking-widest">
                  Usage Quantity
                </label>
                <span className="text-[9px] font-bold text-[#5A5A40] bg-[#f5f5f0]/80 px-2 py-0.5 rounded border border-[#e8e8e1] font-mono uppercase tracking-wider">
                  {currentUnitLabel}
                </span>
              </div>
              <input
                id="log-value-input"
                type="number"
                step="any"
                min="0.1"
                value={value}
                onChange={(e) => setValue(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#f5f5f0]/55 border border-[#e8e8e1] rounded-xl px-4 py-2.5 text-xs text-[#2d2d2a] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none font-mono"
                required
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-xs font-bold text-[#a1a196] uppercase tracking-widest mb-1.5">
                Optional Notes
              </label>
              <input
                id="log-details-input"
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={80}
                placeholder="e.g., Bike commute, turned heater down"
                className="w-full bg-[#f5f5f0]/55 border border-[#e8e8e1] rounded-xl px-4 py-2.5 text-xs text-[#2d2d2a] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none placeholder-[#a1a196]"
              />
            </div>

            {/* Dynamic Footprint Estimator Card */}
            <div className={`p-4 rounded-2xl border ${
              livePreview.emissions < 0 
                ? 'bg-[#5A5A40]/10 border-[#5A5A40]/25 text-[#5A5A40]' 
                : 'bg-[#f5f5f0] border border-[#e8e8e1] text-[#2d2d2a]'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#8e8e84] flex items-center gap-1.5">
                  <Info size={13} className="text-[#a1a196]" />
                  Estimated Impact
                </span>
                <span className={`text-[8px] font-bold uppercase tracking-wider leading-none py-0.5 px-2 rounded-full border ${
                  livePreview.emissions < 0 ? 'bg-white text-[#5A5A40] border-[#5A5A40]/20' : 'bg-white border-[#e8e8e1] text-[#6b6b63]'
                }`}>
                  {livePreview.emissions < 0 ? 'Offset / Savings' : 'Input load'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight flex items-baseline text-[#2d2d2a]">
                  {livePreview.emissions > 0 ? '+' : ''}
                  {livePreview.emissions}
                  <span className="text-xs font-sans font-normal text-[#6b6b63] ml-1.5">kg CO2e</span>
                </span>
                {livePreview.emissions > 20 && (
                  <span className="text-[10px] text-[#D67D5E] font-semibold flex items-center gap-1">
                    <AlertTriangle size={11} /> High Carbon Load
                  </span>
                )}
              </div>
            </div>

            <button
              id="submit-log-btn"
              type="submit"
              className="w-full bg-[#D67D5E] text-white py-3.5 rounded-2xl font-bold shadow-md shadow-[#D67D5E]/20 hover:bg-[#c16748] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} /> Log Daily Activity
            </button>
          </form>
        </div>
      </div>

      {/* Column 2: Center - Status trackers & charts */}
      <div className="lg:col-span-2 space-y-8">
        {/* Row 1: Target Gauge, daily status log speed limits */}
        <div className="bg-white border border-[#e8e8e1] p-6 rounded-[32px] shadow-sm relative overflow-hidden text-[#2d2d2a]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A5A40]/5 blur-3xl rounded-full" />
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div>
              <h3 className="font-display text-xl font-bold text-[#2d2d2a]" style={{ fontFamily: 'Georgia, serif' }}>Daily Limit Ceiling Performance</h3>
              <p className="text-xs text-[#8e8e84]">Adhering strictly to sustainable daily target levels</p>
            </div>
            <button
              id="open-target-btn"
              onClick={() => {
                setTempTargetLimit(target.limit);
                setShowTargetModal(true);
              }}
              className="px-3.5 py-2 text-xs font-bold bg-[#f5f5f0] text-[#5A5A40] border border-[#e8e8e1] rounded-xl hover:bg-[#e8e8e1] transition flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingDown size={12} className="text-[#5A5A40]" />
              Adjust Target ({target.limit} kg)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
            {/* Status indicators */}
            <div className="sm:col-span-2 space-y-4">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-[#a1a196] uppercase tracking-widest font-bold">Today's Footprint</span>
                  <span className="text-2xl font-bold font-mono text-[#2d2d2a]">
                    {currentDayTotal.toFixed(2)}
                    <span className="text-xs font-sans font-semibold text-[#8e8e84] ml-1"> / {target.limit} kg CO2e</span>
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-[#f5f5f0] rounded-full h-3.5 overflow-hidden border border-[#e8e8e1]">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${progressColorClass()}`}
                    style={{ width: `${targetPercentage}%` }}
                  />
                </div>
              </div>

              {/* Status prompt */}
              <div className="p-4 bg-[#f5f5f0] border border-[#e8e8e1] rounded-2xl flex items-start gap-2.5">
                {targetPercentage >= 95 ? (
                  <>
                    <AlertTriangle size={16} className="text-[#D67D5E] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#2d2d2a] leading-relaxed">
                      <strong>Limit reached/exceeded!</strong> You have logged {targetPercentage.toFixed(0)}% of your target. Try green quests walking challenges to secure offsets.
                    </p>
                  </>
                ) : targetPercentage >= 75 ? (
                  <>
                    <RefreshCw size={16} className="text-amber-500 mt-0.5 shrink-0 animate-spin" />
                    <p className="text-xs text-[#2d2d2a] leading-relaxed">
                      <strong>Approaching ceiling.</strong> You've reached {currentDayTotal.toFixed(1)} kg today. Let's practice simple home electricity detox tasks.
                    </p>
                  </>
                ) : (
                  <>
                    <Smile size={16} className="text-[#5A5A40] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#2d2d2a] leading-relaxed">
                      <strong>Within target scope!</strong> Sustainable daily load logged under {target.limit} kg ceiling. Streak: <strong className="font-mono text-[#5A5A40]">{target.streak} days</strong>.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Streak metrics widget */}
            <div className="bg-[#5A5A40] text-white p-5 rounded-[24px] flex flex-col justify-between text-center relative overflow-hidden sm:col-span-1 shadow-sm">
              <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full blur-xl" />
              <div>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-white/70">Impact Streak</span>
                <span className="block text-5xl font-bold text-white my-2 italic font-display">
                  {target.streak}
                </span>
                <span className="block text-[10px] text-white/95 leading-tight">Days logged under ceiling</span>
              </div>
              <div className="mt-3 text-[9px] text-white/70 border-t border-white/10 pt-2 flex justify-center items-center gap-1 uppercase tracking-wider font-bold">
                <Leaf size={11} className="text-white shrink-0 fill-white" />
                Eco League
              </div>
            </div>
          </div>
        </div>

        {/* Charts Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Charts card 1: Breakdown Pie Chart */}
          <div className="bg-white border border-[#e8e8e1] p-5 rounded-[32px] shadow-sm flex flex-col h-[280px] relative text-[#2d2d2a]">
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#a1a196] mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              <Compass size={13} className="text-[#a1a196]" />
              Emissions Sector Share (kg)
            </h4>
            
            {chartData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <Leaf size={28} className="text-[#a1a196] animate-pulse mb-2" />
                <p className="text-[11px] text-[#8e8e84]">No data recorded. Log transit, diet, or waste parameters above to display composition.</p>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="42%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e8e8e1', borderRadius: '12px' }}
                      itemStyle={{ color: '#2d2d2a', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend inside card */}
                <div className="absolute right-2 top-4 flex flex-col gap-1.5 text-[10px] text-[#6b6b63] font-semibold">
                  {chartData.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate max-w-[100px]">{item.name}: <strong className="font-mono text-[#2d2d2a]">{item.value.toFixed(1)}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Charts card 2: Historical Carbon Trend */}
          <div className="bg-white border border-[#e8e8e1] p-5 rounded-[32px] shadow-sm flex flex-col h-[280px] text-[#2d2d2a]">
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#a1a196] mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              <TrendingUp size={13} className="text-[#a1a196]" />
              7-Day Carbon Trend Tracker
            </h4>
            
            <div className="flex-1 mt-1">
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={last7DaysEmissions} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e1" />
                  <XAxis dataKey="name" stroke="#8e8e84" style={{ fontSize: '10px', fontWeight: 600 }} />
                  <YAxis stroke="#8e8e84" style={{ fontSize: '10px', fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e8e8e1', borderRadius: '12px' }}
                    itemStyle={{ color: '#D67D5E', fontSize: '11px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emissions" 
                    stroke="#D67D5E" 
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#D67D5E', strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Log History list */}
        <div className="bg-white border border-[#e8e8e1] p-6 rounded-[32px] shadow-sm relative text-[#2d2d2a]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-display text-xl font-bold text-[#2d2d2a]" style={{ fontFamily: 'Georgia, serif' }}>Saved Footprint Ledgers</h3>
              <p className="text-xs text-[#8e8e84]">Manage carbon footprint logs and ecosystem savings</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter size={11} className="text-[#a1a196] mr-1" />
              {[
                { id: 'all', label: 'All' },
                { id: 'transportation', label: 'Transit' },
                { id: 'energy', label: 'Home' },
                { id: 'food', label: 'Food' },
                { id: 'waste', label: 'Waste' },
              ].map(opt => (
                <button
                  id={`filter-pill-${opt.id}`}
                  key={opt.id}
                  onClick={() => setFilterCategory(opt.id as any)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition cursor-pointer ${
                    filterCategory === opt.id 
                      ? 'bg-[#5A5A40] text-white border border-[#5A5A40]' 
                      : 'bg-[#f5f5f0] border border-[#e8e8e1] hover:bg-[#e8e8e1] text-[#6b6b63]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-[#8e8e84] text-xs flex flex-col items-center justify-center bg-[#f5f5f0]/40 border border-[#e8e8e1] border-dashed rounded-2xl">
              <Leaf size={24} className="text-[#a1a196] mb-1.5" />
              <span>No recorded logs match category filter "{filterCategory}".</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredLogs.map(log => {
                const isSaving = log.emissions < 0;
                let catColor = 'text-[#6A7E8F] bg-[#6A7E8F]/10 border-[#6a7e8f]/15';
                let Icon = Car;

                if (log.category === 'energy') {
                  catColor = 'text-[#D67D5E] bg-[#D67D5E]/10 border-[#d67d5e]/15';
                  Icon = Zap;
                } else if (log.category === 'food') {
                  catColor = 'text-[#5A5A40] bg-[#5A5A40]/10 border-[#5a5a40]/15';
                  Icon = Utensils;
                } else if (log.category === 'waste') {
                  catColor = 'text-[#8a8a7c] bg-[#8a8a7c]/10 border-[#8a8a7c]/15';
                  Icon = Trash2;
                }

                return (
                  <div
                    id={`log-item-${log.id}`}
                    key={log.id}
                    className="flex items-center justify-between p-3.5 bg-[#f5f5f0]/50 hover:bg-[#f5f5f0]/95 border border-[#e8e8e1] rounded-2xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2.5 rounded-xl border ${catColor}`}>
                        <Icon size={16} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#2d2d2a]">{log.type}</span>
                          <span className="text-[10px] text-[#8e8e84] font-mono">({log.value} {log.unit})</span>
                        </div>
                        <div className="flex items-center gap-2.5 mt-1">
                          <span className="text-[10px] text-[#6b6b63] bg-white border border-[#e8e8e1] rounded px-1.5 py-0.5 font-mono">{log.date}</span>
                          {log.details && (
                            <span className="text-[10px] text-[#8e8e84] italic font-mono truncate max-w-[150px] sm:max-w-[280px]">
                              {log.details}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={`block text-sm font-bold font-mono tracking-tight ${isSaving ? 'text-[#5A5A40]' : 'text-[#2d2d2a]'}`}>
                          {log.emissions > 0 ? '+' : ''}{log.emissions} 
                          <span className="text-[10px] font-sans font-normal text-[#6b6b63] ml-1">kg</span>
                        </span>
                        <span className="block text-[8px] text-[#a1a196] font-mono uppercase tracking-wider">CO2 EQUIV</span>
                      </div>
                      <button
                        id={`delete-log-${log.id}`}
                        onClick={() => onDeleteLog(log.id)}
                        className="p-1 px-1.5 bg-white hover:bg-[#f5f5f0] text-[#a1a196] hover:text-[#D67D5E] rounded-lg border border-[#e8e8e1] transition cursor-pointer"
                        title="Delete log record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
