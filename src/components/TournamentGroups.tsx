import { useState } from "react";
import { GROUPS } from "../data/worldCupData";
import { Group, Team } from "../types";
import { Users, Filter, HelpCircle, Trophy } from "lucide-react";

// Helper to assign vibrant distinct styling to each group A to L
const getGroupStyles = (letter: string) => {
  switch (letter) {
    case "A":
      return {
        card: "border-blue-500/30 bg-blue-950/15 hover:border-blue-500/50 hover:bg-blue-950/25",
        badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        headerText: "text-blue-300"
      };
    case "B":
      return {
        card: "border-emerald-500/30 bg-emerald-950/15 hover:border-emerald-500/50 hover:bg-emerald-950/25",
        badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        headerText: "text-emerald-300"
      };
    case "C":
      return {
        card: "border-violet-500/30 bg-violet-950/15 hover:border-violet-500/50 hover:bg-violet-950/25",
        badge: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
        headerText: "text-violet-300"
      };
    case "D":
      return {
        card: "border-rose-500/30 bg-rose-950/15 hover:border-rose-500/50 hover:bg-rose-950/25",
        badge: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        headerText: "text-rose-300"
      };
    case "E":
      return {
        card: "border-amber-500/30 bg-amber-950/15 hover:border-amber-500/50 hover:bg-amber-950/25",
        badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        headerText: "text-amber-300"
      };
    case "F":
      return {
        card: "border-sky-500/30 bg-sky-950/15 hover:border-sky-500/50 hover:bg-sky-950/25",
        badge: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
        headerText: "text-sky-300"
      };
    case "G":
      return {
        card: "border-teal-500/30 bg-teal-950/15 hover:border-teal-500/50 hover:bg-teal-950/25",
        badge: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
        headerText: "text-teal-300"
      };
    case "H":
      return {
        card: "border-indigo-500/30 bg-indigo-950/15 hover:border-indigo-500/50 hover:bg-indigo-950/25",
        badge: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        headerText: "text-indigo-300"
      };
    case "I":
      return {
        card: "border-purple-500/30 bg-purple-950/15 hover:border-purple-500/50 hover:bg-purple-950/25",
        badge: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        headerText: "text-purple-300"
      };
    case "J":
      return {
        card: "border-fuchsia-500/30 bg-fuchsia-950/15 hover:border-fuchsia-500/50 hover:bg-fuchsia-950/25",
        badge: "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20",
        headerText: "text-fuchsia-300"
      };
    case "K":
      return {
        card: "border-pink-500/30 bg-pink-950/15 hover:border-pink-500/50 hover:bg-pink-950/25",
        badge: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
        headerText: "text-pink-300"
      };
    case "L":
    default:
      return {
        card: "border-orange-500/30 bg-orange-950/15 hover:border-orange-500/50 hover:bg-orange-950/25",
        badge: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        headerText: "text-orange-300"
      };
  }
};

export default function TournamentGroups() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Simple state to store simulated standings for groups (shuffling them as visual prediction)
  const [predictions, setPredictions] = useState<Record<string, Team[]>>({});

  const generatePrediction = (groupLetter: string, teams: Team[]) => {
    // Generate a random-based but ranking-aware prediction
    const shuffled = [...teams].sort((a, b) => {
      // lower rank is better (1 is higher than 50). Give a slight random factor
      const weightA = a.ranking + Math.random() * 20 - 10;
      const weightB = b.ranking + Math.random() * 20 - 10;
      return weightA - weightB;
    });
    setPredictions((prev) => ({ ...prev, [groupLetter]: shuffled }));
  };

  const resetPredictions = () => {
    setPredictions({});
  };

  return (
    <div className="space-y-8 animate-fade-in" id="tournament-groups-section">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-right relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center justify-end gap-2 text-sky-400 font-mono text-sm uppercase tracking-wider mb-2">
              <span>نظام الـ 48 منتخباً الأكبر تاريخياً</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">مجموعات المونديال الاستثنائي 2026</h2>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              لأول مرة في تاريخ كأس العالم، يتنافس 48 منتخباً تم توزيعهم على 12 مجموعة من 4 منتخبات. يتأهل بطل كل مجموعة ووصيفه (24 منتخباً)، إلى جانب أفضل 8 منتخبات تحتل المركز الثالث، ليكتمل دور الـ 32 الإقصائي المثير.
            </p>
          </div>
          <button
            onClick={resetPredictions}
            className="px-5 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-medium border border-slate-700/80 transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            إعادة تعيين المحاكاة
          </button>
        </div>
      </div>

      {/* Grid of groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {GROUPS.map((group) => {
          const groupLetter = group.letter;
          // Use prediction if simulated, else original data
          const displayTeams = predictions[groupLetter] || group.teams;
          const isPredicted = !!predictions[groupLetter];
          const styles = getGroupStyles(groupLetter);

          return (
            <div
              key={groupLetter}
              className={`backdrop-blur-md border rounded-2xl p-5 transition-all duration-300 shadow-lg text-right flex flex-col justify-between ${styles.card}`}
              id={`group-card-${groupLetter.toLowerCase()}`}
            >
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                  <button
                    onClick={() => generatePrediction(groupLetter, group.teams)}
                    className="text-xs bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 px-2.5 py-1 rounded-lg transition-colors font-medium border border-sky-500/10"
                    title="توقع ترتيب المجموعة بناءً على تصنيف الفيفا وعوامل عشوائية رياضية"
                  >
                    🚀 توقع الترتيب
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">12 / {groupLetter}</span>
                    <h3 className={`font-bold text-lg ${styles.headerText}`}>المجموعة {groupLetter}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {displayTeams.map((team, idx) => {
                    const isQualified = idx < 2; // top 2 qualify automatically
                    const isThirdProbable = idx === 2; // 3rd might qualify

                    return (
                      <div
                        key={team.id}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                          isPredicted
                            ? "bg-slate-900/60"
                            : "hover:bg-slate-900/40"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-mono text-xs">
                          {isPredicted && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                                isQualified
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                                  : isThirdProbable
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                                  : "bg-slate-850 text-slate-500"
                              }`}
                            >
                              {isQualified ? "تأهل" : isThirdProbable ? "ملحق" : "خروج"}
                            </span>
                          )}
                          <span className="text-slate-400">#{team.ranking}</span>
                        </div>
                        
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-medium text-slate-200">{team.name}</span>
                          <span className="text-2xl select-none" role="img" aria-label={team.name}>
                            {team.flag}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isPredicted && (
                <div className="mt-4 pt-3 border-t border-slate-900 text-center">
                  <span className="text-[10px] font-mono text-slate-500">
                    تم التوقع بناءً على حسابات التصنيف الرياضي
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
