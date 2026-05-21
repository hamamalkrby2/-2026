import { useState, useEffect } from "react";
import { Trophy, Calendar, Users, MapPin, Globe, Sparkles, Flame, ShieldAlert, History, Heart, Layers } from "lucide-react";
import TournamentGroups from "./components/TournamentGroups";
import TeamsList from "./components/TeamsList";
import StadiumsGuide from "./components/StadiumsGuide";
import MatchSimulator from "./components/MatchSimulator";
import AIAssistant from "./components/AIAssistant";
import WorldCupHistory from "./components/WorldCupHistory";
import UserAuth from "./components/UserAuth";
import AppSupportHub from "./components/AppSupportHub";
import WorkspaceHub from "./components/WorkspaceHub";
import { UserProfile } from "./types";
import { FUN_FACTS } from "./data/worldCupData";

type TabType = "dashboard" | "simulator" | "ai" | "stadiums" | "teams" | "history" | "support" | "workspace";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [stripeActive, setStripeActive] = useState(false);
  const [stripeLoading, setStripeLoading] = useState<string | null>(null);
  const [stripeStatusMsg, setStripeStatusMsg] = useState("");

  // Detect Stripe configuration on mount
  useEffect(() => {
    fetch("/api/stripe/config")
      .then((res) => res.json())
      .then((data) => {
        setStripeActive(!!data.stripeActive);
      })
      .catch((err) => {
        console.warn("Could not retrieve Stripe configuration:", err);
      });
  }, []);

  // Monitor url queries for successful checkout redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");
    if (paymentStatus === "success") {
      const planId = params.get("planId") || "pledge";
      const amount = parseFloat(params.get("amount") || "0");
      const session_id = params.get("session_id");

      const processedSessions = JSON.parse(localStorage.getItem("worldcup_processed_stripe_sessions") || "[]");
      if (!session_id || !processedSessions.includes(session_id)) {
        if (session_id) {
          processedSessions.push(session_id);
          localStorage.setItem("worldcup_processed_stripe_sessions", JSON.stringify(processedSessions));
        }

        const localUserStr = localStorage.getItem("worldcup_user_profile");
        let activeUser = currentUser;
        if (!activeUser && localUserStr) {
          try { activeUser = JSON.parse(localUserStr); } catch (e) {}
        }

        if (activeUser) {
          const updatedUser: UserProfile = {
            ...activeUser,
            isPremium: true,
            xp: activeUser.xp + 250,
            badge: "مستشار المونديال الأسطوري"
          };
          setCurrentUser(updatedUser);
          localStorage.setItem("worldcup_user_profile", JSON.stringify(updatedUser));

          // Sync in registered list database
          const localUsersStr = localStorage.getItem("worldcup_registered_users") || "[]";
          let usersList = [];
          try { usersList = JSON.parse(localUsersStr); } catch (e) {}
          if (Array.isArray(usersList)) {
            usersList = usersList.map((u: any) => u.username === activeUser!.username ? updatedUser : u);
            localStorage.setItem("worldcup_registered_users", JSON.stringify(usersList));
          }
        }

        setStripeStatusMsg(`🏆 رائع! تم تأكيد عمليتك عبر Stripe وتفعيل العضوية الذهبية الفاخرة لحسابك فوراً بنجاح! 👑✨`);
        setTimeout(() => setStripeStatusMsg(""), 9000);
      }

      // Cleanup
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (paymentStatus === "cancel") {
      setStripeStatusMsg(`⚠️ تم إلغاء عملية الاشتراك والعودة بأمان للوحة التحكم.`);
      setTimeout(() => setStripeStatusMsg(""), 6000);

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [currentUser]);

  // Handle direct Stripe Checkout creation from Dashboard
  const handleStripeUpgrade = (planId: "monthly" | "yearly") => {
    if (stripeLoading) return;
    setStripeLoading(planId);
    setStripeStatusMsg("");

    fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: planId,
        amount: planId === "yearly" ? 79.99 : 9.99,
        username: currentUser ? currentUser.username : "عضو فخري"
      })
    })
    .then((res) => res.json())
    .then((data) => {
      setStripeLoading(null);
      if (data.url) {
        // Redirect to safe Stripe Secure payment gateway
        window.location.href = data.url;
      } else if (data.simulation) {
        // Instantly upgrade active session (Stripe simulator mode)
        const localUserStr = localStorage.getItem("worldcup_user_profile");
        let activeUser = currentUser;
        if (!activeUser && localUserStr) {
          try { activeUser = JSON.parse(localUserStr); } catch (e) {}
        }

        const defaultUser: UserProfile = activeUser || {
          username: "مشجع المونديال الرائد",
          email: "fan@worldcup2026.com",
          favoriteTeamId: "bra",
          favoriteTeamName: "🇧🇷 البرازيل",
          avatar: "👑",
          xp: 250,
          badge: "محلل ذهبي",
          isPremium: false,
          joinedAt: new Date().toLocaleDateString("ar-SA")
        };

        const updatedUser: UserProfile = {
          ...defaultUser,
          isPremium: true,
          xp: defaultUser.xp + 250,
          badge: "مستشار المونديال الأسطوري"
        };

        setCurrentUser(updatedUser);
        localStorage.setItem("worldcup_user_profile", JSON.stringify(updatedUser));

        const localUsersStr = localStorage.getItem("worldcup_registered_users") || "[]";
        let usersList = [];
        try { usersList = JSON.parse(localUsersStr); } catch (e) {}
        if (Array.isArray(usersList)) {
          if (!usersList.some((u: any) => u.username === updatedUser.username)) {
            usersList.push(updatedUser);
          } else {
            usersList = usersList.map((u: any) => u.username === updatedUser.username ? updatedUser : u);
          }
          localStorage.setItem("worldcup_registered_users", JSON.stringify(usersList));
        }

        setStripeStatusMsg("🏆 تم تفعيل وضع المحاكاة الذكي بنجاح وترقية حسابك كلياً وتفعيل العضوية وتأثيرات التاج الذهبي! 👑🎉");
        setTimeout(() => setStripeStatusMsg(""), 9000);
      } else {
        setStripeStatusMsg("خطأ: تعذر توليد رابط المعاملة الآمنة.");
        setTimeout(() => setStripeStatusMsg(""), 6000);
      }
    })
    .catch((err) => {
      console.error("Stripe error on dashboard:", err);
      setStripeLoading(null);
      setStripeStatusMsg("خطأ: تعذر الاتصال ببوابة Stripe الدفعية.");
      setTimeout(() => setStripeStatusMsg(""), 6000);
    });
  };

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
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer h-11 select-none transform hover:scale-[1.03] active:scale-95 ${
                activeTab === "support"
                  ? "bg-rose-950/40 text-rose-400 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.18)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <span>دعم المونديال وتطويره 💖</span>
              <Heart className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab("workspace")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer h-11 select-none transform hover:scale-[1.03] active:scale-95 ${
                activeTab === "workspace"
                  ? "bg-blue-900 border border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.18)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <span>مساحة العمل المتكاملة ☁️</span>
              <Layers className="w-4.5 h-4.5 text-blue-400" />
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer h-11 select-none transform hover:scale-[1.03] active:scale-95 ${
                activeTab === "history"
                  ? "bg-slate-900 text-amber-400 border border-amber-500/45 shadow-[0_0_15px_rgba(245,158,11,0.18)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <span>تاريخ المونديال</span>
              <History className="w-4.5 h-4.5 text-amber-500/85" />
            </button>

            <button
              onClick={() => setActiveTab("teams")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer h-11 select-none transform hover:scale-[1.03] active:scale-95 ${
                activeTab === "teams"
                  ? "bg-slate-900 text-sky-400 border border-sky-500/45 shadow-[0_0_15px_rgba(14,165,233,0.18)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <span>المنتخبات والنجوم</span>
              <Users className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => setActiveTab("stadiums")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer h-11 select-none transform hover:scale-[1.03] active:scale-95 ${
                activeTab === "stadiums"
                  ? "bg-slate-900 text-emerald-400 border border-emerald-500/45 shadow-[0_0_15px_rgba(16,185,129,0.18)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <span>دليل الملاعب</span>
              <MapPin className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer h-11 select-none transform hover:scale-[1.03] active:scale-95 ${
                activeTab === "ai"
                  ? "bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.25)] border border-teal-400/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-1">
                <span>خبير المونديال الذكي</span>
                <span className="text-[9px] bg-white/20 px-1 py-0.5 rounded text-white font-bold">AI</span>
              </span>
              <Sparkles className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer h-11 select-none transform hover:scale-[1.03] active:scale-[0.95] ${
                activeTab === "simulator"
                  ? "bg-slate-900 text-indigo-400 border border-indigo-500/45 shadow-[0_0_15px_rgba(99,102,241,0.18)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <span>محاكاة المباريات</span>
              <Calendar className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4.5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer h-11 select-none transform hover:scale-[1.03] active:scale-95 ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-slate-100 border border-slate-700/60 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
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

            {/* 👑 PREMIUM SUBSCRIPTION STRIPE PROMO BLOCK */}
            <div className="bg-gradient-to-r from-amber-950/45 via-slate-900 to-slate-950 border border-amber-500/25 rounded-3xl p-6 relative overflow-hidden shadow-xl text-right">
              {/* Decorative dynamic gold glow */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex flex-col lg:flex-row-reverse justify-between items-center gap-6">
                
                {/* Visual Gold badge and feature stats */}
                <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end justify-center">
                  <div className="relative group mb-3">
                    <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-md group-hover:blur-lg transition-all animate-pulse"></div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-350 p-0.5 flex items-center justify-center relative">
                      <Trophy className="w-9 h-9 text-amber-400" />
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-right">
                    <h3 className="text-lg font-bold text-amber-400">العضوية الذهبية الأسطورية 👑</h3>
                    <p className="text-[11px] text-slate-400 mt-1 font-sans">بوابة دفع Stripe مشفرة بـ SSL بالكامل 🔒</p>
                  </div>
                  
                  {/* Stripe Active Indicator Badge */}
                  <div className="mt-3 flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                    <span className={`w-2 h-2 rounded-full ${stripeActive ? "bg-emerald-500 animate-pulse" : "bg-yellow-500"}`}></span>
                    <span className="text-[10px] text-slate-300 font-sans">
                      {stripeActive ? "بوابة Stripe: نشطة ومباشرة 🟢" : "بوابة Stripe: وضع المحاكاة الذكي ⚙️"}
                    </span>
                  </div>
                </div>

                {/* Main dynamic premium pitch info */}
                <div className="flex-1 text-center lg:text-right space-y-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-400 text-[10px] uppercase font-bold py-0.5 px-3 rounded-full border border-amber-400/15">
                      <span>عرض خاص بمناسبة المونديال 🏆</span>
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <h2 className="text-2xl font-black text-white">ابدأ رحلتك الفاخرة مع العضوية الذهبية!</h2>
                    <p className="text-slate-300 text-xs leading-relaxed max-w-2xl font-sans">
                      انضم لنخبة المشجعين والخبراء الرياضيين، وافتح ميزات التوقع الذكي للأبطال، وتصفح إحصائيات المباريات الحصرية دقيقة بدقيقة، ومساعدة الذكاء الاصطناعي الأسرع مع شارة التاج الذهبي الأنيقة 👑.
                    </p>
                  </div>

                  {/* Status Banner inside promotional pitch */}
                  {stripeStatusMsg && (
                    <div className="bg-amber-500/15 border border-amber-500/35 p-3 rounded-xl text-amber-300 text-xs font-semibold font-sans animate-pulse">
                      {stripeStatusMsg}
                    </div>
                  )}

                  {currentUser?.isPremium ? (
                    <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl text-right flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold py-0.5 px-2 rounded font-sans uppercase">عضوية نشطة</span>
                        <h4 className="text-white font-bold text-sm mt-0.5">تهانينا! اشتراكك بالباقة الذهبية فعال كلياً 🎉</h4>
                        <p className="text-slate-400 text-[10px] mt-0.5 font-sans">حسابك يتمتع الآن بجميع الصلاحيات الفاخرة وشارات التحليل المتقدمة.</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <span className="text-xl">⭐️</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row-reverse items-center justify-center lg:justify-start gap-4 pt-1.5">
                      {/* Plan 1 Button */}
                      <button
                        onClick={() => handleStripeUpgrade("monthly")}
                        disabled={!!stripeLoading}
                        className="bg-gradient-to-l from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition-transform transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {stripeLoading === "monthly" ? (
                          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span>العضوية الذهبية (شهرية) • $9.99 👑</span>
                        )}
                      </button>

                      {/* Plan 2 Button */}
                      <button
                        onClick={() => handleStripeUpgrade("yearly")}
                        disabled={!!stripeLoading}
                        className="bg-slate-900 hover:bg-slate-850 text-amber-400 font-extrabold px-6 py-3 rounded-xl text-xs transition-transform transform hover:scale-[1.02] active:scale-95 shadow-lg border border-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {stripeLoading === "yearly" ? (
                          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span>باقة التوفير السنوية • $79.99 🏆</span>
                        )}
                      </button>

                      <span className="text-[10px] text-slate-400 font-sans">معالجة مشفرة وآمنة بنسبة 100%</span>
                    </div>
                  )}

                </div>

              </div>
            </div>
            
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

        {activeTab === "workspace" && <WorkspaceHub />}

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
