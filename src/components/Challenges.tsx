import React from 'react';
import { EcoChallenge, Category } from '../types';
import { 
  Car, Zap, Utensils, Trash2, Trophy, Compass, ArrowUpRight, 
  CheckCircle2, Clock, Play, Dumbbell, Sparkles, AlertCircle
} from 'lucide-react';

interface ChallengesProps {
  challenges: EcoChallenge[];
  onJoinChallenge: (id: string) => void;
  onCompleteChallenge: (id: string, co2Savings: number) => void;
}

export default function Challenges({ 
  challenges, 
  onJoinChallenge, 
  onCompleteChallenge 
}: ChallengesProps) {

  // Group challenges
  const activeChallenges = challenges.filter(c => c.isJoined && !c.isCompleted);
  const completedChallenges = challenges.filter(c => c.isCompleted);
  const availableChallenges = challenges.filter(c => !c.isJoined && !c.isCompleted);

  const getCategoryIconAndStyle = (cat: Category) => {
    switch (cat) {
      case 'transportation':
        return { icon: Car, color: 'text-[#6A7E8F]', bg: 'bg-[#6A7E8F]/10', border: 'border-[#6A7E8F]/15' };
      case 'energy':
        return { icon: Zap, color: 'text-[#D67D5E]', bg: 'bg-[#D67D5E]/10', border: 'border-[#D67D5E]/15' };
      case 'food':
        return { icon: Utensils, color: 'text-[#5A5A40]', bg: 'bg-[#5A5A40]/10', border: 'border-[#5A5A40]/15' };
      case 'waste':
        return { icon: Trash2, color: 'text-[#8a8a7c]', bg: 'bg-[#8a8a7c]/10', border: 'border-[#8a8a7c]/15' };
    }
  };

  const getDifficultyColor = (diff: EcoChallenge['difficulty']) => {
    switch (diff) {
      case 'easy':
        return 'text-[#5A5A40] bg-[#5A5A40]/10 border-[#5A5A40]/20';
      case 'medium':
        return 'text-[#D67D5E] bg-[#D67D5E]/10 border-[#D67D5E]/20';
      case 'hard':
        return 'text-[#8A3A2B] bg-[#8A3A2B]/10 border-[#8A3A2B]/20';
    }
  };

  return (
    <div className="space-y-8 text-[#2d2d2a]">
      {/* Level stats banner */}
      <div className="bg-white border border-[#e8e8e1] p-6 rounded-[32px] relative overflow-hidden shadow-sm">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#5A5A40]/5 rounded-full blur-3xl" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 px-3 rounded-xl bg-[#5A5A40] text-white text-xs font-bold uppercase tracking-wider">
                Eco League Level 2
              </span>
              <span className="text-[#5A5A40] flex items-center gap-1 text-xs font-semibold">
                <Sparkles size={12} /> {completedChallenges.length * 10} XP accumulated
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#2d2d2a]" style={{ fontFamily: 'Georgia, serif' }}>
              Personal Eco Challenge Arena
            </h2>
            <p className="text-xs text-[#6b6b63] max-w-2xl leading-relaxed">
              Turn carbon awareness into gamified micro-actions. Join weekly challenges, log completions, and directly secure carbon off-sets toward your daily ceiling goals!
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#f5f5f0] p-4 rounded-2xl border border-[#e8e8e1] self-start md:self-auto uppercase tracking-widest font-bold">
            <div className="text-center px-1">
              <span className="block text-2xl font-bold font-mono text-[#D67D5E]">
                {completedChallenges.length}
              </span>
              <span className="block text-[8px] text-[#8e8e84]">Wins</span>
            </div>
            <div className="w-px h-8 bg-[#e8e8e1]" />
            <div className="text-center px-1">
              <span className="block text-2xl font-bold font-mono text-[#5A5A40]">
                {activeChallenges.length}
              </span>
              <span className="block text-[8px] text-[#8e8e84]">In Play</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left Column for Active/In Play, Right side for Available */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Challenges column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#e8e8e1] p-5 rounded-[32px] shadow-sm flex flex-col min-h-[350px]">
            <h3 className="font-display text-base font-bold text-[#2d2d2a] mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <Clock size={16} className="text-[#5A5A40]" />
              Active daily Quests ({activeChallenges.length})
            </h3>

            {activeChallenges.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#f5f5f0]/50 border border-[#e8e8e1] border-dashed rounded-[24px]">
                <Dumbbell size={28} className="text-[#a1a196] mb-2" />
                <h4 className="text-xs font-bold text-[#2d2d2a] mb-1">No active quests</h4>
                <p className="text-[10px] text-[#8e8e84] max-w-[180px] leading-relaxed">
                  Browse the available targets catalog details on the right and hit "Join Challenge" to start off-setting.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {activeChallenges.map((challenge) => {
                  const style = getCategoryIconAndStyle(challenge.category);
                  const Icon = style.icon;

                  return (
                    <div
                      id={`challenge-active-${challenge.id}`}
                      key={challenge.id}
                      className="p-4 bg-[#f5f5f0]/50 border border-[#e8e8e1] rounded-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#5A5A40]/5 blur-xl rounded-full" />
                      <div className="flex justify-between items-start mb-2">
                        <span className={`p-1.5 rounded-lg border ${style.color} ${style.bg} ${style.border}`}>
                          <Icon size={14} />
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${getDifficultyColor(challenge.difficulty)} font-semibold font-mono uppercase`}>
                          {challenge.difficulty}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-[#2d2d2a]">{challenge.title}</h4>
                      <p className="text-[10px] text-[#6b6b63] mt-1 mb-3 leading-relaxed">{challenge.description}</p>

                      <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-[#e8e8e1]">
                        <div className="font-mono text-[10px] text-[#6b6b63]">
                          CO2 Offset: <strong className="text-[#5A5A40] font-bold">-{challenge.co2Savings} kg</strong>
                        </div>
                        <button
                          id={`complete-challenge-${challenge.id}`}
                          onClick={() => onCompleteChallenge(challenge.id, challenge.co2Savings)}
                          className="px-3 py-1.5 bg-[#5A5A40] hover:bg-[#494933] text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 size={11} /> Validate Step
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Available Challenges to Join (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#e8e8e1] p-6 rounded-[32px] shadow-sm">
            <h3 className="font-display text-base font-bold text-[#2d2d2a] mb-5 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <Play size={16} className="text-[#5A5A40] fill-[#5A5A40]/20" />
              Available Green Quests Catalog
            </h3>

            {availableChallenges.length === 0 ? (
              <div className="py-12 text-center text-[#8e8e84] text-xs">
                <Trophy size={32} className="text-[#D67D5E]/20 mx-auto mb-2 animate-bounce" />
                <span>Wow, you've accepted all available challenges! Check back tomorrow or chat with Gemini to propose a custom rule.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableChallenges.map((challenge) => {
                  const style = getCategoryIconAndStyle(challenge.category);
                  const Icon = style.icon;

                  return (
                    <div
                      id={`challenge-catalog-${challenge.id}`}
                      key={challenge.id}
                      className="p-5 bg-white border border-[#e8e8e1] hover:border-[#5A5A40]/40 rounded-2xl transition-all flex flex-col justify-between hover:shadow-sm"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`p-2 rounded-xl border ${style.color} ${style.bg} ${style.border}`}>
                            <Icon size={16} />
                          </span>
                          <span className={`text-[8px] px-2 py-0.5 rounded-full border ${getDifficultyColor(challenge.difficulty)} font-bold uppercase font-mono tracking-wider`}>
                            {challenge.difficulty}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-[#2d2d2a]">{challenge.title}</h4>
                        <p className="text-xs text-[#6b6b63] mt-1.5 mb-4 leading-relaxed line-clamp-2 md:line-clamp-none">{challenge.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#e8e8e1] mt-auto">
                        <span className="text-[10px] text-[#8e8e84] font-mono">
                          Reward: <strong className="text-[#5A5A40] font-semibold">-{challenge.co2Savings} kg CO2</strong>
                        </span>
                        <button
                          id={`join-challenge-${challenge.id}`}
                          onClick={() => onJoinChallenge(challenge.id)}
                          className="px-3 py-1.5 bg-[#f5f5f0] border border-[#e8e8e1] text-[#2d2d2a] hover:bg-[#e8e8e1] text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          Join <ArrowUpRight size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Completed challenge trophies */}
          {completedChallenges.length > 0 && (
            <div className="bg-white border border-[#e8e8e1] p-6 rounded-[32px] shadow-sm">
              <h3 className="font-display text-base font-bold text-[#2d2d2a] mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                <Trophy size={16} className="text-[#D67D5E]" />
                Completed Carbon Savings ({completedChallenges.length})
              </h3>
              <div className="flex gap-2 bg-[#f5f5f0]/40 p-4 border border-[#e8e8e1] rounded-2xl flex-wrap">
                {completedChallenges.map((challenge) => (
                  <div
                    id={`challenge-trophy-${challenge.id}`}
                    key={challenge.id}
                    className="flex items-center gap-2 py-1.5 px-3 bg-[#5A5A40]/10 border border-[#5A5A40]/15 text-[#5A5A40] rounded-xl text-[10px] font-bold"
                  >
                    <CheckCircle2 size={12} className="text-[#5A5A40]" />
                    <span>{challenge.title} ({challenge.co2Savings}kg CO2 saved)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
