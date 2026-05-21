import { useState } from "react";
import { Trophy, Calendar, Users, MapPin, Globe, Sparkles, Flame, ShieldAlert, History, Heart } from "lucide-react";
import TournamentGroups from "./components/TournamentGroups";
import TeamsList from "./components/TeamsList";
import StadiumsGuide from "./components/StadiumsGuide";
import MatchSimulator from "./components/MatchSimulator";
import AIAssistant from "./components/AIAssistant";
import WorldCupHistory from "./components/WorldCupHistory";
import UserAuth from "./components/UserAuth";
import AppSupportHub from "./components/AppSupportHub";
import { UserProfile } from "./types";
import { FUN_FACTS } from "./data/worldCupData";

type TabType = "dashboard" | "simulator" | "ai" | "stadiums" | "teams" | "history" | "support";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);


  // Custom paths for our generated final match image
  const finalMatchImagePath = "/src/assets/images/world_cup_final_banner_1779318269320.png";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="rtl" id="world-cup-app-container">
      {/* -------------------------------------------------------------
          TOP LOGO AND HEADER SECTION
         ------------------------------------------------------------- */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row-reverse sm:justify-between sm:items-center gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center justify-end gap-3.5">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[10px] bg-red-500/10 text-rose-400 border border-red-500/10 py-0.5 px-2 rounded-full uppercase font-bold tracking-wider">
                  التغطية الاستثنائية
                </span>
                <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">
                كأس العالم لكرة القدم 2026
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                النسخة الأولى بمشاركة 48 منتخباً • الولايات المتحدة، المكسيك، كندا
              </p>
            </div>
            
            {/* Golden cup badge */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-[1.5px] shadow-lg shadow-amber-500/10 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Quick Stats Summary badges & User Log In status */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start">
            <UserAuth 
              currentUser={currentUser} 
              onUserUpdate={(user) => setCurrentUser(user)} 
              onNavigateToSupport={() => setActiveTab("support")} 
            />
            
            <div className="hidden sm:flex gap-4 items-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span className="bg-slate-900 p-1 rounded">3</span>
                <span>دول مضيفة</span>
              </div>
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span className="bg-slate-900 p-1 rounded">48</span>
                <span>منتخباً مشاركاً</span>
              </div>
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span className="bg-slate-900 p-1 rounded">16</span>
                <span>ملعباً عالمياً</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* -------------------------------------------------------------
          MAIN NAVIGATION TABS (TOUCH SENSITIVE 44PX TARGETS)
         ------------------------------------------------------------- */}
      <nav className="bg-slate-950 border-b border-slate-900/60 sticky top-[81px] sm:top-[74px] z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex overflow-x-auto justify-end gap-1.5 md:gap-4 py-2.5 no-scrollbar scroll-smooth">
            
            <button
              onClick={() => setActiveTab("support")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer h-11 select-none ${
                activeTab === "support"
                  ? "bg-rose-950/40 text-rose-400 border border-rose-500/35"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>دعم المونديال وتطويره 💖</span>
              <Heart className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer h-11 select-none ${
                activeTab === "history"
                  ? "bg-slate-900 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>تاريخ المونديال</span>
              <History className="w-4.5 h-4.5 text-amber-500/85" />
            </button>

            <button
              onClick={() => setActiveTab("teams")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer h-11 select-none ${
                activeTab === "teams"
                  ? "bg-slate-900 text-white border border-slate-850"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>المنتخبات والنجوم</span>
              <Users className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => setActiveTab("stadiums")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer h-11 select-none ${
                activeTab === "stadiums"
                  ? "bg-slate-900 text-white border border-slate-850"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>دليل الملاعب</span>
              <MapPin className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer h-11 select-none ${
                activeTab === "ai"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-500/10 border border-teal-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="flex items-center gap-1">
                <span>خبير المونديال الذكي</span>
                <span className="text-[9px] bg-white/20 px-1 py-0.5 rounded text-white-400 font-bold">AI</span>
              </span>
              <Sparkles className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer h-11 select-none ${
                activeTab === "simulator"
                  ? "bg-slate-900 text-white border border-slate-850"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>محاكاة المباريات</span>
              <Calendar className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer h-11 select-none ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-white border border-slate-850"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>الرئيسية والمجموعات</span>
              <Globe className="w-4.5 h-4.5" />
            </button>

          </div>
        </div>
      </nav>

      {/* -------------------------------------------------------------
          MAIN SCROLLABLE CONTENT BODY
         ------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-fade-in" id="dashboard-tab">
            
            {/* 🎥 THE HERO World Cup Final image with descriptive card caption */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-900 shadow-2xl bg-slate-950">
              <div className="aspect-[21/9] w-full relative">
                <img
                  src={finalMatchImagePath}
                  alt="لوحة نهائي كأس العالم لكرة القدم 2026 في ملعب ميتلايف"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4000ms] ease-out brightness-[0.80]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              </div>

              {/* Float narrative description of the FIFA World Cup Final */}
              <div className="p-6 md:p-8 relative mt-[-2px] bg-slate-950 border-t border-slate-900 text-right space-y-4">
                <div className="flex flex-col md:flex-row-reverse md:justify-between md:items-center gap-4">
                  <div>
                    <span className="text-xs text-amber-400 font-mono font-bold tracking-wider block mb-1">
                      🏆 المشهد الختامي للمونديال الاستثنائي
                    </span>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white">نهائي كأس العالم لكرة القدم 2026</h2>
                    <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed font-sans">
                      صورة فنية رائعة لطموح النهائي الكروي التاريخي، حيث من المقرر إقامة المباراة الختامية الأكبر في التاريخ في 19 يوليو 2026 على أرض ملعب <strong>ميتلايف الأسطوري (نيويورك / نيوجيرسي)</strong> المستوعب لأكثر من 82 ألف متفرج في حفل ختامي لمونديال سيشهد تنافس 48 منتخباً و 104 مباريات للمرة الأولى في مجريات البطولة الكبرى.
                    </p>
                  </div>
                  
                  {/* Action prompt shortcut */}
                  <button
                    onClick={() => setActiveTab("simulator")}
                    className="self-start md:self-center bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold text-xs transition-transform active:scale-95 shadow-lg shadow-amber-500/5 cursor-pointer"
                  >
                    🚀 حاكي سيناريو النهائي الآن
                  </button>
                </div>
              </div>
            </div>

            {/* 🗺️ Interactive App Sections Road Map to facilitate understanding of the whole multi-page app */}
            <div className="bg-gradient-to-l from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 md:p-8 text-right relative overflow-hidden shadow-xl" id="pages-road-map">
              <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="mb-6">
                <div className="flex items-center justify-end gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                  <span>🗺️ خريطة تصفح ودليل خدمات التطبيق</span>
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">أقسام ومميزات التطبيق الشامل للمونديال</h3>
                <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed font-sans">
                  تم تصميم وتوزيع هذا التطبيق الشامل على ستة أقسام رئيسية متكاملة لتغطية كافة جوانب مونديال كأس العالم وتاريخية البطولة الكبرى ليسهل عليك تصفح المزايا والصفحات بسهولة فائقة:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                
                {/* Section 1: Dashboard */}
                <div className="bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 border border-slate-850 p-4 rounded-xl flex flex-col justify-between text-right">
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-xs font-bold text-sky-400">الرئيسية والمجموعات</span>
                      <Globe className="w-4 h-4 text-sky-400" />
                    </div>
                    <p className="text-slate-400 text-[10px] leading-relaxed mb-4 font-sans">
                      أول وتوزيع الـ 48 منتخباً على الـ 12 مجموعة الكبرى، مع أداة ذكية لمحاكاة الترتيب وتوقع الصدارة بالألوان.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="w-full py-1.5 px-3 bg-sky-500/10 text-sky-400 rounded-lg text-[10px] font-bold transition-all text-center"
                  >
                    أنت هنا حالياً ✨
                  </button>
                </div>

                {/* Section 2: Teams */}
                <div className="bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 border border-slate-850 p-4 rounded-xl flex flex-col justify-between text-right">
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-400">المنتخبات والنجوم</span>
                      <Users className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-slate-400 text-[10px] leading-relaxed mb-4 font-sans">
                      تصفّح قائمة المنتخبات الـ 48 مصنّفة حسب اتحادات وقارات العالم، مع تتبع النجوم الملهمين وعلاماتهم المميزة.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("teams")}
                    className="w-full py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                  >
                    تصفّح المنتخبات ⚽
                  </button>
                </div>

                {/* Section 3: Stadiums */}
                <div className="bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 border border-slate-850 p-4 rounded-xl flex flex-col justify-between text-right">
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-xs font-bold text-violet-400">دليل الملاعب الـ 16</span>
                      <MapPin className="w-4 h-4 text-violet-400" />
                    </div>
                    <p className="text-slate-400 text-[10px] leading-relaxed mb-4 font-sans">
                      استكشف الملاعب المميزة في الدول الثلاث المستضيفة، بالسعات الجماهيرية وتاريخ الإنجازات والمدن الخاصة بها.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("stadiums")}
                    className="w-full py-1.5 px-3 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                  >
                    اكتشف الملاعب 🏟️
                  </button>
                </div>

                {/* Section 4: Simulator */}
                <div className="bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 border border-slate-850 p-4 rounded-xl flex flex-col justify-between text-right">
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-xs font-bold text-amber-400">محاكاة المباريات</span>
                      <Calendar className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-slate-400 text-[10px] leading-relaxed mb-4 font-sans">
                      قم باختيار وجدولة أي مباراة لمشاهدة محاكاة تكتيكية متقدمة مباشرة للأهداف والبطاقات والإحصائيات دقيقة بدقيقة!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("simulator")}
                    className="w-full py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                  >
                    شغّل محاكي اللقاءات ⏱️
                  </button>
                </div>

                {/* Section 5: AI Assistant */}
                <div className="bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 border border-slate-850 p-4 rounded-xl flex flex-col justify-between text-right">
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-xs font-bold text-teal-400">خبير المونديال الذكي</span>
                      <Sparkles className="w-4 h-4 text-teal-400" />
                    </div>
                    <p className="text-slate-400 text-[10px] leading-relaxed mb-4 font-sans">
                      مساعد رياضي خارق يجيبك عن أسرار تكتيكية وألغاز وتفاصيل وقواعد التأهل وعراقة تاريخ الكأس بذكاء خارق.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("ai")}
                    className="w-full py-1.5 px-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                  >
                    الخبير المونديالي 🤖
                  </button>
                </div>

                {/* Section 6: World Cup History */}
                <div className="bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 border border-slate-850 p-4 rounded-xl flex flex-col justify-between text-right">
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-xs font-bold text-amber-500">الأرشيف الشامل منذ 1930</span>
                      <History className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-slate-400 text-[10px] leading-relaxed mb-4 font-sans">
                      تصفّح تاريخ بطولات المونديال الـ 22 السابقة بالهدافيين، الأبطال، الميداليات، والغرائب والمحطات القياسية.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="w-full py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                  >
                    افتح كتاب التاريخ 🏆
                  </button>
                </div>

              </div>
            </div>

            {/* 📊 BENTO GRID CHRONOLOGICAL SUMMARY FACTS OF WORLD CUP */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all text-right space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-slate-400 text-xs">ثلاثة بلدان منظمة</h4>
                <div className="text-xl font-black text-white">أمريكا الشمالية 2026</div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-sans">
                  تتوزع عبر الولايات المتحدة (11 ملعباً)، المكسيك (3 ملاعب)، وكندا (ملعبين) لتقديم نسخة قارية متناغمة.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all text-right space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-slate-400 text-xs">الفرق والمتنافسون</h4>
                <div className="text-xl font-black text-white">48 منتخباً عالمياً</div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-sans">
                  زيادة القيمة والفرصة لمنتخبات أفريقيا، آسيا، وأمريكا الشمالية عبر توسيع نظام المشاركة الأكبر على الإطلاق.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all text-right space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <h4 className="text-slate-400 text-xs">عدد مباريات البطولة</h4>
                <div className="text-xl font-black text-white">104 مباراة نارية</div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-sans">
                  مقسمة عبر 12 مجموعة، لن يخرج أي منتخب إلا بعد إتاحة الفرص الرياضية الكاملة لتقديم أفضل ما لديه.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all text-right space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="text-slate-400 text-xs">أسرع إقصاء وأقصر طريق</h4>
                <div className="text-xl font-black text-white">دور الـ 32 الإقصائي</div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-sans">
                  تتسع الأدوار الإقصائية ليتأهل 32 منتخباً في مواجهة صاعقة بخروج المغلوب تعتمد على التفاصيل والتكتيك.
                </p>
              </div>

            </div>

            {/* 🏟️ DYNAMIC FACTS TICKER */}
            <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-900 text-right">
              <h3 className="font-bold text-base text-white mb-3 flex items-center justify-end gap-2">
                <span>معلومات وحقائق استثنائية عن مونديال 2026</span>
                <Flame className="w-4 h-4 text-red-500 animate-bounce" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FUN_FACTS.map((fact, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className="text-sky-400 font-bold text-xs mt-0.5">☀️</span>
                    <span className="text-xs text-slate-300 font-sans leading-relaxed">{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Render Groups and Standings predictor here inside dashboard */}
            <TournamentGroups />

          </div>
        )}

        {activeTab === "history" && <WorldCupHistory />}

        {activeTab === "simulator" && <MatchSimulator />}

        {activeTab === "ai" && <AIAssistant />}

        {activeTab === "stadiums" && <StadiumsGuide />}

        {activeTab === "teams" && <TeamsList />}

        {activeTab === "support" && (
          <AppSupportHub 
            currentUser={currentUser} 
            onUserUpdate={(user) => setCurrentUser(user)} 
          />
        )}

      </main>

      {/* -------------------------------------------------------------
          FOOTER COPYRIGHT SECTION
         ------------------------------------------------------------- */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center" id="world-cup-footer-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-4 text-slate-500 text-xs">
          <div className="flex justify-center gap-4 text-sm">
            <span className="text-slate-400 font-bold select-none">كأس العالم 2026 الاستثنائي ⚽</span>
          </div>
          <p className="max-w-lg mx-auto font-sans leading-relaxed">
            جميع الخصائص والمحاكاة مستلهمة من قوانين الاتحاد الدولي لكرة القدم (FIFA) لبطولة كأس العالم 2026. الرعاية والبيانات تدار محلياً بدعم الذكاء الاصطناعي من مخرجات Gemini.
          </p>
          <div className="pt-2 font-mono text-[10px]">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لتطبيق المونديال الشامل. دمج التاريخ والتكنولوجيا.
          </div>
        </div>
      </footer>
    </div>
  );
}
