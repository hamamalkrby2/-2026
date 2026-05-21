import { useState, useMemo } from "react";
import { WORLD_CUP_HISTORIC_EDITIONS, WORLD_CUP_RECORDS, WorldCupEdition } from "../data/worldCupHistory";
import { Trophy, Award, Search, HelpCircle, Activity, LayoutGrid, Calendar, MapPin, Milestone, Goal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function WorldCupHistory() {
  const [activeSubTab, setActiveSubTab] = useState<"editions" | "records">("editions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Performance Optimization: Use useMemo to filter historical list & avoid heavy recalculation on render
  const filteredEditions = useMemo(() => {
    return WORLD_CUP_HISTORIC_EDITIONS.filter((edition) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        edition.year.toString().includes(query) ||
        edition.host.toLowerCase().includes(query) ||
        edition.winner.toLowerCase().includes(query) ||
        edition.runnerUp.toLowerCase().includes(query) ||
        edition.topScorer.toLowerCase().includes(query) ||
        edition.highlight.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  // Selected edition helper
  const selectedEditionDetails = useMemo(() => {
    if (!selectedYear) return null;
    return WORLD_CUP_HISTORIC_EDITIONS.find(e => e.year === selectedYear) || null;
  }, [selectedYear]);

  // Quick Stats computation
  const totalTournaments = WORLD_CUP_HISTORIC_EDITIONS.length;
  const totalGoalsHistoric = WORLD_CUP_HISTORIC_EDITIONS.reduce((acc, curr) => acc + curr.totalGoals, 0);
  const averageGoalsPerEdition = Math.round(totalGoalsHistoric / totalTournaments);

  return (
    <div className="space-y-8" id="world-cup-history-section">
      
      {/* 🔮 Aesthetic Intro Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden" id="stat-card-editions">
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">إجمالي النسخ المكتملة</span>
            <h4 className="text-3xl font-black text-white mt-1 font-mono">{totalTournaments}</h4>
            <p className="text-[10px] text-amber-500 mt-1 font-semibold">1930 - 2022</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden" id="stat-card-goals">
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">إجمالي الأهداف المسجلة</span>
            <h4 className="text-3xl font-black text-rose-400 mt-1 font-mono">{totalGoalsHistoric.toLocaleString()}</h4>
            <p className="text-[10px] text-rose-400 mt-1 font-semibold">تاريخ غزير بالأهداف</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <Goal className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden" id="stat-card-avg-goals">
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">معدل الأهداف للنسخة</span>
            <h4 className="text-3xl font-black text-sky-400 mt-1 font-mono">{averageGoalsPerEdition}</h4>
            <p className="text-[10px] text-sky-400/80 mt-1">هدف في كل مونديال</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
            <Activity className="w-6 h-6 text-sky-400" />
          </div>
        </div>

        <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden" id="stat-card-history-champ">
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">البلد الأكثر تتويجاً</span>
            <h4 className="text-lg font-black text-white mt-1.5 flex items-center justify-end gap-1.5">
              <span>البرازيل</span>
              <span className="font-mono text-emerald-400">(5 مرات)</span>
            </h4>
            <p className="text-[10px] text-slate-400 mt-1">يليه إيطاليا وألمانيا بـ 4 ألقاب</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Milestone className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* 🧭 Timeline & Records Inner Navigation */}
      <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-slate-850 max-w-md mx-auto flex gap-1">
        <button
          onClick={() => setActiveSubTab("records")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all h-11 flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === "records"
              ? "bg-slate-950 text-amber-400 border border-slate-800 shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="subtab-records"
        >
          <span>🏆 الخالدون والأرقام القياسية</span>
          <Award className="w-4 h-4 text-amber-500" />
        </button>
        <button
          onClick={() => setActiveSubTab("editions")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all h-11 flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === "editions"
              ? "bg-slate-950 text-white border border-slate-800 shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="subtab-editions"
        >
          <span>🗓️ السجل الشامل للنسخ</span>
          <Calendar className="w-4 h-4 text-sky-400" />
        </button>
      </div>

      {/* Subtab 1: Sijill Al-Nusakh (The Editions Timeline) */}
      <AnimatePresence mode="wait">
        {activeSubTab === "editions" && (
          <motion.div
            key="editions-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
            id="editions-history-panel"
          >
            
            {/* Search Filter Panel */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
              <div className="text-right">
                <h4 className="text-sm font-bold text-white">ابحث في سجل المونديال الأسطوري</h4>
                <p className="text-[11px] text-slate-400 mt-1">أدخل السنة، اسم المستضيف، البطل الفائز، الهداف التاريخي، أو حتى كلمة دلالية للفلترة الحية السريعة وعرض التاريخ فورياً.</p>
              </div>
              <div className="relative max-w-sm w-full">
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-500" />
                </span>
                <input
                  type="text"
                  placeholder="ابحث عن نسخة (مثال: 1986، ميسي، المكسيك...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 text-right focus:outline-none focus:border-amber-500/55 transition-all text-ellipsis"
                  id="edition-search-input"
                />
              </div>
            </div>

            {/* main visual layout: grid of editions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEditions.map((edition) => {
                const isSelected = selectedYear === edition.year;
                return (
                  <div
                    key={edition.year}
                    onClick={() => setSelectedYear(isSelected ? null : edition.year)}
                    className={`border rounded-2xl p-5 text-right transition-all duration-300 shadow cursor-pointer select-none flex flex-col justify-between group relative overflow-hidden ${
                      isSelected
                        ? "bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30"
                        : "bg-slate-950 hover:bg-slate-900/60 border-slate-900 hover:border-slate-800"
                    }`}
                    id={`edition-card-${edition.year}`}
                  >
                    {/* Top highlights decorative subtle corner glow */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div>
                      {/* Year and host */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-850">
                          {edition.teamsCount} فرق • {edition.matchesCount} مباراة
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400">الملعب المستضيف: {edition.host}</span>
                          <span className="text-xl font-bold font-mono text-white tracking-tight">{edition.year}</span>
                        </div>
                      </div>

                      {/* Winner Highlight Card */}
                      <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-850 space-y-2 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">البطل الحائز على الكأس:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-white">{edition.winner}</span>
                            <span className="text-base">{edition.winnerFlag}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">الوصيف المكرّم:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-slate-300">{edition.runnerUp}</span>
                            <span className="text-sm">{edition.runnerUpFlag}</span>
                          </div>
                        </div>
                      </div>

                      {/* Brief line of highlights */}
                      <p className="text-slate-400 text-xs mt-4 line-clamp-2 leading-relaxed">
                        {edition.highlight}
                      </p>
                    </div>

                    {/* bottom footer */}
                    <div className="border-t border-slate-900 pt-3 mt-4 flex items-center justify-between text-[11px]">
                      <span className="text-amber-500 font-bold group-hover:translate-x-1 transition-transform">
                        {isSelected ? "إغلاق التفاصيل ✕" : "عرض إضافي واستكشاف للنسخة ←"}
                      </span>
                      <span className="text-slate-500 font-mono">⚽ {edition.totalGoals} هدفاً</span>
                    </div>

                    {/* Highly interactive detail block inline if opened */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-slate-800/80 pt-4 mt-4 space-y-3.5 text-right cursor-default"
                          onClick={(e) => e.stopPropagation()}
                          id={`edition-details-${edition.year}`}
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 text-right">
                              <span className="text-[10px] text-slate-500 block">الهداف وصاحب الحذاء الذهبي:</span>
                              <span className="text-xs font-bold text-amber-400 block mt-0.5">{edition.topScorer}</span>
                              <span className="text-[10px] text-slate-400 font-mono font-bold">🎯 {edition.topScorerGoals} أهداف</span>
                            </div>

                            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 text-right">
                              <span className="text-[10px] text-slate-500 block">أفضل لاعب وأسطورة البطولة:</span>
                              <span className="text-xs font-bold text-emerald-400 block mt-0.5">{edition.bestPlayer}</span>
                              <span className="text-[10px] text-slate-400">🌟 الكرة الذهبية</span>
                            </div>
                          </div>

                          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900 text-right">
                            <span className="text-[10px] text-slate-500 block">المركز الثالث والميدالية البرونزية:</span>
                            <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                              <span className="text-xs text-slate-300">{edition.thirdPlace}</span>
                              <span className="text-sm">{edition.thirdPlaceFlag}</span>
                            </div>
                          </div>

                          <div className="text-slate-300 text-xs leading-relaxed font-sans bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20">
                            <strong>💡 تفصيل تاريخي فريد:</strong> {edition.highlight}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}

              {filteredEditions.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-500 bg-slate-950/40 border border-slate-900 rounded-2xl" id="no-editions-found">
                  <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold">لا توجد نسخ مطابقة لبحثك في الأرشيف المونديالي</p>
                  <p className="text-xs mt-1">تأكد من كتابة التاريخ بشكل صحيح أو جرب كلمات مختلفة</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Subtab 2: Sijill Al-Arqaam (The Records Page) */}
        {activeSubTab === "records" && (
          <motion.div
            key="records-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 animate-fade-in"
            id="records-history-panel"
          >
            <div className="text-right max-w-2xl mx-auto mb-6">
              <h3 className="text-lg font-bold text-white">أشهر الأرقام القياسية المستعصية في تاريخ كأس العالم</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                سُطرت في صفحات الذهب أسماء لا يمكن نسيانها، وأرقام قياسية صمدت لعقود من السنين الطوال وتنتظر الجيل الجديد في مونديال 2026 لمحاولة كسرها وتخليد التاريخ.
              </p>
            </div>

            {/* Beautiful Bento grid for Records */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WORLD_CUP_RECORDS.map((record, index) => (
                <div
                  key={index}
                  className="bg-slate-950 border border-slate-900 hover:border-amber-500/25 p-5 rounded-2xl text-right transition-all group shadow-md flex flex-col justify-between"
                  id={`record-card-${index}`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-bold uppercase">
                        رقم كلاسيكي 🌟
                      </span>
                      <Trophy className="w-5 h-5 text-amber-400/80 group-hover:scale-110 transition-transform" />
                    </div>

                    <h4 className="font-bold text-sm text-slate-300 mb-1">{record.title}</h4>
                    
                    <div className="my-3 py-1 bg-slate-900/40 rounded-xl px-3 border border-slate-850 inline-block">
                      <span className="text-2xl font-black text-amber-400 tracking-tight font-mono">{record.value}</span>
                    </div>

                    <p className="text-[11px] text-white font-extrabold mt-1">حامل الرقم: {record.holder}</p>
                  </div>

                  <div className="border-t border-slate-900 pt-3 mt-4 text-[11px] text-slate-400 leading-relaxed font-sans">
                    {record.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Historical infographic callout box */}
            <div className="bg-gradient-to-l from-amber-600/10 to-transparent border border-amber-500/20 p-5 rounded-2xl flex flex-col md:flex-row-reverse items-center gap-4 text-right" id="historic-infographic">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 flex-shrink-0">
                <Milestone className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">التطور المستمر لكأس العالم لكرة القدم (1930 - 2026)</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  بدأت البطولة في الأوروغواي عام 1930 بـ 13 منتخباً فقط وبمشاركة اسمية، ثم توسعت لتضم 16 منتخباً لعقود طويلة. في إسبانيا عام 1982 ارتفع العدد إلى 24 منتخباً، ثم زاد إلى 32 منتخباً في فرنسا 1998 ليخلق إثارة في المجموعات الثمانية. 
                  والآن، تحتفل البطولة في الولايات المتحدة والمكسيك وكندا بحدث غير مسبوق في التاريخ مع <strong>48 منتخباً</strong> يتبارون على مدار 104 مباريات شيقة!
                </p>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
