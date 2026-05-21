import { useState, useMemo, useEffect } from "react";
import { TEAMS, STADIUMS } from "../data/worldCupData";
import { SimulationResult, Team, Stadium, MatchEvent } from "../types";
import { Play, RotateCcw, Shield, Activity, HelpCircle, AlertOctagon } from "lucide-react";

export default function MatchSimulator() {
  const [teamAId, setTeamAId] = useState<string>("ksa"); // Saudi Arabia
  const [teamBId, setTeamBId] = useState<string>("mar"); // Morocco
  const [stadiumId, setStadiumId] = useState<string>("metlife"); // MetLife
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // For animated timeline match progress ticking
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(100); // ms per game minute
  const [visibleEventIndex, setVisibleEventIndex] = useState<number>(-1);

  const teamA = TEAMS.find((t) => t.id === teamAId) || TEAMS[0];
  const teamB = TEAMS.find((t) => t.id === teamBId) || TEAMS[1];
  const stadium = STADIUMS.find((s) => s.id === stadiumId) || STADIUMS[0];

  // Live timer tick effect
  useEffect(() => {
    if (!isLiveSimulating || !result) return;

    const interval = setInterval(() => {
      setCurrentMinute((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setIsLiveSimulating(false);
          setVisibleEventIndex(result.events.length - 1);
          return 90;
        }
        return prev + 1;
      });
    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [isLiveSimulating, result, simulationSpeed]);

  // Skip simulation instantly
  const handleSkipSimulation = () => {
    if (!result) return;
    setCurrentMinute(90);
    setIsLiveSimulating(false);
    setVisibleEventIndex(result.events.length - 1);
  };

  // Live score, stats & event stream tallies based on currentMinute
  const liveStats = useMemo(() => {
    if (!result) return null;

    let scoreA = 0;
    let scoreB = 0;
    const pastEvents = result.events.filter((e) => e.minute <= currentMinute);

    pastEvents.forEach((ev) => {
      if (ev.type === "goal") {
        const isTeamA = ev.desc.includes(teamA.name);
        if (isTeamA) {
          scoreA++;
        } else {
          scoreB++;
        }
      }
    });

    const progressFactor = currentMinute / 90;
    const stats = result.stats;

    const liveShots = {
      teamA: Math.round(stats.shots.teamA * progressFactor),
      teamB: Math.round(stats.shots.teamB * progressFactor)
    };

    const liveFouls = {
      teamA: Math.round(stats.foulCount.teamA * progressFactor),
      teamB: Math.round(stats.foulCount.teamB * progressFactor)
    };

    const liveCorners = {
      teamA: Math.round(stats.corners.teamA * progressFactor),
      teamB: Math.round(stats.corners.teamB * progressFactor)
    };

    const livePossession = {
      teamA: stats.possession.teamA,
      teamB: stats.possession.teamB
    };

    return {
      scoreA,
      scoreB,
      pastEvents,
      liveShots,
      liveFouls,
      liveCorners,
      livePossession
    };
  }, [result, currentMinute, teamA, teamB]);

  // Locate current goal if scored during the current minute
  const latestGoalEvent = useMemo(() => {
    if (!liveStats) return null;
    return liveStats.pastEvents.find(
      (e) => e.type === "goal" && e.minute === currentMinute
    ) || null;
  }, [liveStats, currentMinute]);

  const handleSimulate = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setVisibleEventIndex(-1);
    setIsLiveSimulating(false);
    setCurrentMinute(0);

    try {
      const response = await fetch("/api/worldcup/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamA: teamA.name,
          teamB: teamB.name,
          stadium: stadium.arabicName + " (" + stadium.arabicCity + ")"
        })
      });

      if (!response.ok) {
        throw new Error("فشلت عملية محاكاة المباراة. يرجى المحاولة لاحقاً.");
      }

      const data: SimulationResult = await response.json();
      
      // Calculate missing percentage for Team B's possession to make sure it complements Team A's
      if (data.stats && data.stats.possession) {
        data.stats.possession.teamB = 100 - data.stats.possession.teamA;
      }
      
      setResult(data);
      setIsLiveSimulating(true);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ غير متوقع.");
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (type: MatchEvent["type"]) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "card":
        return "🟨";
      case "substitution":
        return "🔄";
      case "highlight":
        return "🔥";
    }
  };

  const getEventStyle = (type: MatchEvent["type"]) => {
    switch (type) {
      case "goal":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
      case "card":
        return "bg-amber-500/15 border-amber-500/30 text-amber-400";
      case "substitution":
        return "bg-sky-500/15 border-sky-500/30 text-sky-400";
      case "highlight":
        return "bg-slate-900 border-slate-800 text-slate-300";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="match-simulator-section">
      {/* Intro info header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-right shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">محاكي مباريات مونديال 2026 التفاعلي</h2>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          اختر أي منتخبين من المنتخبات الـ 48 المشاركة، وحدد الملعب المناسب، ودع نظام المحاكاة المتطور يحسب تكتيكات اللعب، ونسب الاستحواذ، والفرص الضائعة، والبطاقات الملونة، وصانعي الأهداف بدقة وموثوقية رياضية ممتعة ومميزة.
        </p>
      </div>

      {/* Selectors and trigger button */}
      <div className="bg-slate-950/80 border border-slate-900 p-6 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-right">
          {/* Team A Selector */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 block font-medium">المنتخب الأول (مستضيف أو طرف أ)</label>
            <select
              value={teamAId}
              onChange={(e) => setTeamAId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 text-slate-200 text-sm p-3 rounded-xl focus:outline-none text-right cursor-pointer"
            >
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id} disabled={t.id === teamBId}>
                  {t.flag} {t.name} (التصنيف #{t.ranking})
                </option>
              ))}
            </select>
          </div>

          {/* Stadium Selector */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 block font-medium">الملعب المستضيف للمواجهة</label>
            <select
              value={stadiumId}
              onChange={(e) => setStadiumId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 text-slate-200 text-sm p-3 rounded-xl focus:outline-none text-right cursor-pointer"
            >
              {STADIUMS.map((s) => (
                <option key={s.id} value={s.id}>
                  🏟️ {s.arabicName} ({s.arabicCity})
                </option>
              ))}
            </select>
          </div>

          {/* Team B Selector */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 block font-medium">المنتخب الثاني (الضيف أو طرف ب)</label>
            <select
              value={teamBId}
              onChange={(e) => setTeamBId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 text-slate-200 text-sm p-3 rounded-xl focus:outline-none text-right cursor-pointer"
            >
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id} disabled={t.id === teamAId}>
                  {t.flag} {t.name} (التصنيف #{t.ranking})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSimulate}
            disabled={isLoading}
            className={`px-8 py-3.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
              isLoading ? "cursor-wait opacity-80" : "shadow-sky-500/10 active:scale-95"
            }`}
          >
            {isLoading ? (
              <>
                <span>جاري محاكاة أحداث ومجريات اللقاء...</span>
                <Activity className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                <span>ابدأ محاكاة المباراة</span>
                <Play className="w-4 h-4 fill-white" />
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm text-right">
          <AlertOctagon className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Simulator Results Dashboard */}
      {result && (
        <div className="space-y-10 animate-fade-in">
          {/* Main Scoreboard Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 text-center relative shadow-2xl overflow-hidden">
            {/* GOAL POPUP NOTIFICATION EFFECT */}
            {latestGoalEvent && (
              <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-3xl z-40 flex flex-col items-center justify-center animate-pulse duration-700 backdrop-blur-sm pointer-events-none">
                <div className="bg-slate-950/95 border border-emerald-500/30 px-6 py-4 rounded-3xl flex flex-col items-center shadow-2xl max-w-sm md:max-w-md mx-4 animate-fade-in">
                  <div className="text-3xl md:text-4xl animate-bounce">⚽🔥</div>
                  <h3 className="text-xl md:text-2xl font-black text-emerald-400 mt-2 font-mono tracking-wider">هــدفـفـفـف !</h3>
                  <p className="text-slate-200 text-xs text-center mt-1.5 font-sans leading-relaxed">
                    {latestGoalEvent.desc}
                  </p>
                </div>
              </div>
            )}

            {/* Simulated Live Header info */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isLiveSimulating ? "bg-red-500 animate-pulse" : "bg-slate-705"}`}></span>
                <span className={`text-[11px] font-mono font-bold tracking-wider ${isLiveSimulating ? "text-red-400" : "text-slate-500"}`}>
                  {isLiveSimulating ? "مباشر • LIVE" : "منتهية • FT"}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                🏟️ {stadium.arabicName} • {stadium.arabicCity}
              </div>
              <div className="text-[10px] text-amber-400 font-bold border border-amber-500/20 px-2 py-0.5 rounded-lg bg-amber-500/5 font-sans">
                محاكاة تكتيكية ذكية ⚙️
              </div>
            </div>

            {/* Interactive Minute & Progress HUD */}
            <div className="mb-8 max-w-md mx-auto">
              <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2 font-mono">
                <span>90' دقيقة</span>
                <span className="text-amber-400 font-bold font-sans">زمن اللقاء الجاري</span>
                <span>0' دقيقة</span>
              </div>
              
              {/* Progress Bar Container with ball goals milestones marked! */}
              <div className="h-3.5 w-full bg-slate-950 rounded-full border border-slate-900 overflow-visible relative flex items-center">
                <div
                  style={{ width: `${(currentMinute / 90) * 100}%` }}
                  className="bg-gradient-to-l from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-100 ease-linear shadow-lg"
                ></div>

                {/* Score Goal Milestones Soccer Balls plotted along the timeline */}
                {result.events.filter(e => e.type === "goal").map((g, idx) => {
                  const goalDistancePercent = (g.minute / 90) * 100;
                  const isGoalPassed = currentMinute >= g.minute;
                  return (
                    <div
                      key={idx}
                      style={{ right: `${goalDistancePercent}%` }}
                      className="absolute transform translate-x-1/2 z-10"
                      title={`هدف بالدقيقة ${g.minute}`}
                    >
                      <span
                        className={`text-xs cursor-help block p-0.5 rounded-full transition-all duration-300 ${
                          isGoalPassed
                            ? "scale-125 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] opacity-100 bg-slate-950 border border-emerald-500"
                            : "scale-100 opacity-20 bg-slate-900 border border-slate-800"
                        }`}
                      >
                        ⚽
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Huge Live Clock and Speed HUD */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Speed multipliers */}
                <div className="flex gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-850">
                  <button
                    onClick={() => setSimulationSpeed(120)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      simulationSpeed === 120
                        ? "bg-slate-950 text-sky-400 border border-slate-800"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => setSimulationSpeed(55)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      simulationSpeed === 55
                        ? "bg-slate-950 text-sky-400 border border-slate-800"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    2x
                  </button>
                  <button
                    onClick={() => setSimulationSpeed(25)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      simulationSpeed === 25
                        ? "bg-slate-950 text-sky-400 border border-slate-800"
                        : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    4x
                  </button>
                </div>

                {/* Clock indicator */}
                <div className="flex items-center gap-1.5 bg-slate-950/60 px-4 py-1.5 border border-slate-850/80 rounded-2xl">
                  <span className="text-lg md:text-xl font-black font-mono text-white select-none">
                    {currentMinute < 90 ? `${currentMinute}'` : "90' (انتهت 🏁)"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">الوقت والجهد تكتيكي:</span>
                </div>

                {/* Skip simulation button */}
                {isLiveSimulating && (
                  <button
                    onClick={handleSkipSimulation}
                    className="text-xs bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold border border-slate-800 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>تخطي لرؤية النتيجة السريعة ⏭️</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Scoreboard displays in real-time or matches final */}
            <div className="flex justify-center items-center gap-6 md:gap-16 my-4">
              {/* Team A Flag & Name */}
              <div className="flex flex-col items-center flex-1">
                <span className="text-4xl md:text-6xl select-none mb-3 transform hover:scale-105 transition-transform" role="img" aria-label={teamA.name}>
                  {teamA.flag}
                </span>
                <h4 className="font-bold text-white text-base md:text-xl line-clamp-1">{teamA.name}</h4>
                <span className="text-xs text-slate-500 font-mono mt-0.5">#{teamA.ranking}</span>
              </div>

              {/* score numbers */}
              <div className="flex flex-col items-center">
                <div className="font-mono text-4xl md:text-6xl font-extrabold text-white tracking-widest bg-slate-950 px-6 py-3 rounded-2xl border border-slate-850 shadow-inner">
                  {liveStats ? `${liveStats.scoreA} - ${liveStats.scoreB}` : "0 - 0"}
                </div>
                <span className={`mt-3 text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${
                  isLiveSimulating 
                    ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" 
                    : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                }`}>
                  {isLiveSimulating ? "جاري محاكاة اللعب بث مباشر" : "انتهت المباراة"}
                </span>
              </div>

              {/* Team B Flag & Name */}
              <div className="flex flex-col items-center flex-1">
                <span className="text-4xl md:text-6xl select-none mb-3 transform hover:scale-105 transition-transform" role="img" aria-label={teamB.name}>
                  {teamB.flag}
                </span>
                <h4 className="font-bold text-white text-base md:text-xl line-clamp-1">{teamB.name}</h4>
                <span className="text-xs text-slate-500 font-mono mt-0.5">#{teamB.ranking}</span>
              </div>
            </div>

            {/* Virtual Pitch Actions Ticker Box (Deep green tactical feed) */}
            <div className="mt-8 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 max-w-xl mx-auto text-right relative">
              <div className="absolute top-3 left-3 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">
                تعليق تكتيكي حي 🎙️
              </div>
              <div className="text-emerald-400 text-xs font-bold mb-1">الحدث الجاري على الميدان:</div>
              <p className="text-slate-200 text-xs leading-relaxed font-sans mt-1.5">
                {liveStats?.pastEvents && liveStats.pastEvents.length > 0
                  ? liveStats.pastEvents[liveStats.pastEvents.length - 1].desc
                  : `🏁 اللاعبون في أرضية الميدان في ${stadium.arabicName} يقومون بالإحماء وتوزيع أماكن الانتشار التكتيكي وسط ترقب جماهيري صاخب!`
                }
              </p>
            </div>

            {/* Goal scorers list */}
            {(!isLiveSimulating || (liveStats?.scoreA || 0) + (liveStats?.scoreB || 0) > 0) && (
              <div className="mt-8 border-t border-slate-900 pt-4 text-center max-w-lg mx-auto">
                <div className="text-center text-xs text-slate-500 font-medium mb-2">أهداف المباراة المسجلة حتى الآن</div>
                <div className="flex flex-wrap justify-center gap-3">
                  {result.scorers
                    .filter(s => {
                      // Parse minute out of string: "Player (Minute')"
                      const matchMin = s.match(/\((\d+)'\)/);
                      if (matchMin && matchMin[1]) {
                        return currentMinute >= parseInt(matchMin[1]);
                      }
                      return true;
                    })
                    .map((scorer, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-900 border border-slate-850 text-slate-300 font-medium font-sans px-3 py-1 rounded-lg"
                      >
                        {scorer}
                      </span>
                    ))
                  }
                </div>
              </div>
            )}
          </div>

          {/* TWO COLUMN DETAILS: Stats vs. Live Event Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-right">

            {/* Stadium Statistics comparison */}
            {result.stats && (
              <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <h3 className="font-bold text-lg text-white border-b border-slate-900 pb-3 flex items-center justify-end gap-2">
                  <span>إحصائيات اللقاء التفصيلية ({isLiveSimulating ? "تحديث حي ⏱️" : "كاملة"})</span>
                  <Activity className="w-5 h-5 text-sky-400" />
                </h3>

                <div className="space-y-6 pt-2">
                  {/* Possession */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
                      <span>{liveStats?.livePossession.teamB}${"%"}</span>
                      <span className="text-slate-300 font-sans">الاستحواذ</span>
                      <span>{liveStats?.livePossession.teamA}${"%"}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${liveStats?.livePossession.teamA}%` }}
                        className="bg-sky-500 rounded-l-full duration-500 transition-all"
                      ></div>
                      <div
                        style={{ width: `${liveStats?.livePossession.teamB}%` }}
                        className="bg-emerald-500 rounded-r-full duration-500 transition-all"
                      ></div>
                    </div>
                  </div>

                  {/* Shots */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
                      <span>{liveStats?.liveShots.teamB}</span>
                      <span className="text-slate-300 font-sans">التسديدات على المرمى</span>
                      <span>{liveStats?.liveShots.teamA}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        style={{
                          width: `${((liveStats?.liveShots.teamA ?? 0) / ((liveStats?.liveShots.teamA ?? 0) + (liveStats?.liveShots.teamB ?? 0) || 1)) * 100}%`
                        }}
                        className="bg-sky-500 rounded-l-full duration-500 transition-all"
                      ></div>
                      <div
                        style={{
                          width: `${((liveStats?.liveShots.teamB ?? 0) / ((liveStats?.liveShots.teamA ?? 0) + (liveStats?.liveShots.teamB ?? 0) || 1)) * 100}%`
                        }}
                        className="bg-emerald-500 rounded-r-full duration-500 transition-all"
                      ></div>
                    </div>
                  </div>

                  {/* Fouls */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
                      <span>{liveStats?.liveFouls.teamB}</span>
                      <span className="text-slate-300 font-sans">الأخطاء المرتكبة</span>
                      <span>{liveStats?.liveFouls.teamA}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        style={{
                          width: `${((liveStats?.liveFouls.teamA ?? 0) / ((liveStats?.liveFouls.teamA ?? 0) + (liveStats?.liveFouls.teamB ?? 0) || 1)) * 100}%`
                        }}
                        className="bg-sky-500 rounded-l-full duration-500 transition-all"
                      ></div>
                      <div
                        style={{
                          width: `${((liveStats?.liveFouls.teamB ?? 0) / ((liveStats?.liveFouls.teamA ?? 0) + (liveStats?.liveFouls.teamB ?? 0) || 1)) * 100}%`
                        }}
                        className="bg-emerald-500 rounded-r-full duration-500 transition-all"
                      ></div>
                    </div>
                  </div>

                  {/* Corners */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
                      <span>{liveStats?.liveCorners.teamB}</span>
                      <span className="text-slate-300 font-sans">الركلات الركنية</span>
                      <span>{liveStats?.liveCorners.teamA}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        style={{
                          width: `${((liveStats?.liveCorners.teamA ?? 0) / ((liveStats?.liveCorners.teamA ?? 0) + (liveStats?.liveCorners.teamB ?? 0) || 1)) * 100}%`
                        }}
                        className="bg-sky-500 rounded-l-full duration-500 transition-all"
                      ></div>
                      <div
                        style={{
                          width: `${((liveStats?.liveCorners.teamB ?? 0) / ((liveStats?.liveCorners.teamA ?? 0) + (liveStats?.liveCorners.teamB ?? 0) || 1)) * 100}%`
                        }}
                        className="bg-emerald-500 rounded-r-full duration-500 transition-all"
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Legend metadata info banner */}
                <div className="pt-4 flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    {teamB.name} {teamB.flag}
                  </span>
                  <span>دليل الألوان</span>
                  <span className="text-sky-400 flex items-center gap-1.5 font-sans">
                    {teamA.flag} {teamA.name}
                  </span>
                </div>
              </div>
            )}

            {/* Live Play Events timeline */}
            <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl">
              <h3 className="font-bold text-lg text-white border-b border-slate-900 pb-3 flex items-center justify-end gap-2">
                <span>سجل مجريات وأحداث المباراة</span>
                <Activity className="w-5 h-5 text-red-400 animate-pulse" />
              </h3>

              <div className="space-y-4 pt-2 max-h-[360px] overflow-y-auto pr-1">
                {liveStats?.pastEvents && liveStats.pastEvents.slice().reverse().map((event, index) => {
                  return (
                    <div
                      key={index}
                      className="flex gap-4 items-start duration-500 transition-all text-right animate-fade-in"
                    >
                      {/* event card text body */}
                      <div
                        className={`flex-1 border p-3.5 rounded-2xl text-xs font-sans block leading-relaxed ${getEventStyle(
                          event.type
                        )}`}
                      >
                        <span className="font-bold text-sky-400 font-mono ml-1">دقيقة {event.minute}':</span>
                        {event.desc}
                      </div>

                      {/* Timeline icon indicator */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shadow">
                          {getEventIcon(event.type)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
