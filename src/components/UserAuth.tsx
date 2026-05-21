import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { TEAMS } from "../data/worldCupData";
import { User, Key, LogIn, LogOut, Award, Sparkles, CheckCircle2, UserPlus, Trophy, BookOpen, Clock } from "lucide-react";

interface UserAuthProps {
  currentUser?: UserProfile | null;
  onUserUpdate: (profile: UserProfile | null) => void;
  onNavigateToSupport?: () => void;
}

const AVATARS = ["⚽", "🏆", "👑", "🦁", "🦅", "🏹", "🧠", "🔥", "⚡", "⭐"];

const TRIVIA_QUESTIONS = [
  {
    q: "أي منتخب هو الأكثر فوزاً بلقب كأس العالم عبر التاريخ برصيد 5 ألقاب؟",
    options: ["البرازيل 🇧🇷", "إيطاليا 🇮🇹", "ألمانيا 🇩🇪", "الأرجنتين 🇦🇷"],
    correct: 0,
    credit: "تاريخ أبطال المونديال"
  },
  {
    q: "أين أقيمت أول نسخة من بطولة كأس العالم لكرة القدم عام 1930؟",
    options: ["الأرجنتين", "البرازيل", "الأوروغواي", "فرنسا"],
    correct: 2,
    credit: "طيات الأرشيف العريق"
  },
  {
    q: "من هو الهداف التاريخي لكأس العالم برصيد 16 هدفاً؟",
    options: ["بيليه 🇧🇷", "ميروسلاف كلوزه 🇩🇪", "رونالدو الظاهرة 🇧🇷", "ليونيل ميسي 🇦🇷"],
    correct: 1,
    credit: "أساطير الأرقام القياسية"
  },
  {
    q: "كم منتخباً سيشارك في النسخة القادمة لكأس العالم 2026 لأول مرة في التاريخ؟",
    options: ["32 منتخباً", "40 منتخباً", "48 منتخباً", "64 منتخباً"],
    correct: 2,
    credit: "مستقبل البطولة"
  },
  {
    q: "ما هو الملعب الذي تقرر رسمياً استضافته لنهائي مونديال 2026 في نيويورك/نيوجيرسي؟",
    options: ["ملعب أزتيكا", "ملعب ميتلايف", "ملعب مرسيدس بنز", "ملعب بي سي بليس"],
    correct: 1,
    credit: "منشآت المونديال العملاقة"
  }
];

export default function UserAuth({ currentUser, onUserUpdate, onNavigateToSupport }: UserAuthProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteTeamId, setFavoriteTeamId] = useState("bra");
  const [selectedAvatar, setSelectedAvatar] = useState("⚽");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Gamification Trivia State
  const [showTrivia, setShowTrivia] = useState(false);
  const [activeTriviaIdx, setActiveTriviaIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [triviaFeedback, setTriviaFeedback] = useState<string | null>(null);
  const [didCorrectTrivia, setDidCorrectTrivia] = useState(false);
  const [lastTriviaDay, setLastTriviaDay] = useState<string | null>(null);

  // Load profile on mount with automatic login for instant entry
  useEffect(() => {
    const savedUser = localStorage.getItem("worldcup_user_profile");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as UserProfile;
        setProfile(parsed);
        onUserUpdate(parsed);
      } catch (err) {
        console.error("Failed to parse user profile: ", err);
      }
    } else {
      // Direct automatic login on first arrival to prevent setup or entry barriers
      const defaultProfile: UserProfile = {
        username: "مشجع المونديال الرائد",
        email: "fan@worldcup2026.com",
        favoriteTeamId: "bra",
        favoriteTeamName: "🇧🇷 البرازيل",
        avatar: "👑",
        xp: 250,
        badge: "محلل ذهبي",
        isPremium: false, // Start as standard, making the Stripe Premium upgrade feature highly visible and ready to be explored!
        joinedAt: new Date().toLocaleDateString("ar-SA")
      };
      
      try {
        localStorage.setItem("worldcup_user_profile", JSON.stringify(defaultProfile));
        
        // Also register in simulated database
        const localUsersStr = localStorage.getItem("worldcup_registered_users") || "[]";
        let usersList: UserProfile[] = [];
        try { usersList = JSON.parse(localUsersStr); } catch (e) {}
        if (!usersList.some((u) => u.username === defaultProfile.username)) {
          usersList.push(defaultProfile);
          localStorage.setItem("worldcup_registered_users", JSON.stringify(usersList));
        }
        
        setProfile(defaultProfile);
        onUserUpdate(defaultProfile);
      } catch (err) {
        console.error("Could not write automatic user profile:", err);
      }
    }
    const savedTriviaDay = localStorage.getItem("worldcup_last_trivia_day");
    if (savedTriviaDay) {
      setLastTriviaDay(savedTriviaDay);
    }
  }, []);

  // Synchronize with external changes to currentUser (such as premium activation in Support Tab)
  useEffect(() => {
    if (currentUser !== undefined) {
      setProfile(currentUser);
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("worldcup_user_profile");
    setProfile(null);
    onUserUpdate(null);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username.trim()) {
      setErrorMsg("يرجى إدخال اسم المستخدم.");
      return;
    }

    // Since we are simulating, we either look up in localStorage user archives, or generate a fresh one
    const localUsersStr = localStorage.getItem("worldcup_registered_users") || "[]";
    const usersList: UserProfile[] = JSON.parse(localUsersStr);

    const existingUser = usersList.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (existingUser) {
      localStorage.setItem("worldcup_user_profile", JSON.stringify(existingUser));
      setProfile(existingUser);
      onUserUpdate(existingUser);
      setSuccessMsg(`مرحباً بعودتك يا ${existingUser.username}! ⚽`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1500);
    } else {
      // Create user automatically to make it easy for preview
      const favTeamObj = TEAMS.find((t) => t.id === favoriteTeamId) || TEAMS[0];
      const newProfile: UserProfile = {
        username: username.trim(),
        email: email || `${username}@worldcup.com`,
        favoriteTeamId: favTeamObj.id,
        favoriteTeamName: `${favTeamObj.flag} ${favTeamObj.name}`,
        avatar: selectedAvatar,
        xp: 150, // Starting bonus XP
        badge: "مبتدئ المونديال",
        isPremium: false,
        joinedAt: new Date().toLocaleDateString("ar-SA")
      };

      // Add to simulated user list database
      usersList.push(newProfile);
      localStorage.setItem("worldcup_registered_users", JSON.stringify(usersList));

      // Save as active profile
      localStorage.setItem("worldcup_user_profile", JSON.stringify(newProfile));
      setProfile(newProfile);
      onUserUpdate(newProfile);
      setSuccessMsg("تم إنشاء حسابك المونديالي بنجاح! مرحباً بك 🥇");
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1500);
    }
  };

  const currentDayKey = new Date().toDateString();

  // Handle Gamified Trivia
  const startDailyQuiz = () => {
    if (lastTriviaDay === currentDayKey) {
      setTriviaFeedback("لقد أكملت تدريبك الرياضي اليومي بالفعل! عد غداً لمزيد من التحديات والاختبارات المونديالية.");
      setSelectedAnswerIdx(null);
      setDidCorrectTrivia(false);
      setShowTrivia(true);
      return;
    }
    const randIdx = Math.floor(Math.random() * TRIVIA_QUESTIONS.length);
    setActiveTriviaIdx(randIdx);
    setSelectedAnswerIdx(null);
    setTriviaFeedback(null);
    setDidCorrectTrivia(false);
    setShowTrivia(true);
  };

  const handleAnswerSelect = (optIdx: number) => {
    if (selectedAnswerIdx !== null) return; // Prevent double clicks
    setSelectedAnswerIdx(optIdx);

    const question = TRIVIA_QUESTIONS[activeTriviaIdx];
    const isCorrect = optIdx === question.correct;

    if (isCorrect) {
      setDidCorrectTrivia(true);
      setTriviaFeedback("إجابة أسطورية صحيحة! نلت +50 نقطة خبرة كروية (XP) لتعزيز مستواك!");
      
      // Update XP in local Storage
      if (profile) {
        const updatedXP = profile.xp + 50;
        let nextBadge = profile.badge;
        if (updatedXP >= 300) nextBadge = "مستشار المونديال الأسطوري";
        else if (updatedXP >= 220) nextBadge = "محلل ذهبي";
        else if (updatedXP >= 150) nextBadge = "متابع متمرس";

        const updatedProfile: UserProfile = {
          ...profile,
          xp: updatedXP,
          badge: nextBadge
        };
        
        // Update both active state & registered archives values
        setProfile(updatedProfile);
        onUserUpdate(updatedProfile);
        localStorage.setItem("worldcup_user_profile", JSON.stringify(updatedProfile));

        const localUsersStr = localStorage.getItem("worldcup_registered_users") || "[]";
        let usersList: UserProfile[] = JSON.parse(localUsersStr);
        usersList = usersList.map(u => u.username === profile.username ? updatedProfile : u);
        localStorage.setItem("worldcup_registered_users", JSON.stringify(usersList));
      }

      // Mark as done today
      localStorage.setItem("worldcup_last_trivia_day", currentDayKey);
      setLastTriviaDay(currentDayKey);
    } else {
      setDidCorrectTrivia(false);
      setTriviaFeedback(`آه، إجابة غير دقيقة! الجواب الصحيح هو: "${question.options[question.correct]}". حاول مجدداً في السؤال القادم لتكسب النقاط!`);
      // Consume today's chance to let them try again as we love soccer
    }
  };

  return (
    <div className="text-right" id="user-auth-module">
      {/* Upper Status/Login Indicator Bar depending on auth state */}
      {profile ? (
        <div className={`flex items-center gap-3 border rounded-2xl px-3 py-2 shadow-inner transition-all ${
          profile.isPremium 
            ? "bg-slate-900 border-amber-500/35 shadow-lg shadow-amber-500/5" 
            : "bg-slate-900 border-slate-800/80"
        }`} id="logged-in-badge">
          
          {/* Quick status mini stats details */}
          <div className="hidden md:flex flex-col text-right pl-2 border-l border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-sans">
              المستوى: <strong className="text-amber-400">{profile.badge}</strong>
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              قوة التوقع: <strong className="text-emerald-400">{profile.xp} XP</strong>
            </span>
          </div>

          {/* Premium Membership Quick Trigger Badges */}
          {profile.isPremium ? (
            <div 
              onClick={onNavigateToSupport}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full text-[9px] font-black cursor-pointer animate-pulse select-none"
              title="إدارة اشتراك العضوية الذهبية الفاخرة"
            >
              <span>ذهبي VIP 👑</span>
            </div>
          ) : (
            <button 
              type="button"
              onClick={onNavigateToSupport}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-950 hover:bg-slate-850 hover:text-amber-400 text-slate-400 border border-slate-850 rounded-full text-[9px] font-sans cursor-pointer transition-colors"
              title="شيد أول تطبيق مونديالي وافتح الامتيازات"
            >
              <span>+ ترقية 👑</span>
            </button>
          )}

          <button
            type="button"
            onClick={startDailyQuiz}
            className="text-[10px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer select-none"
            title="ابدأ الاختبار الرياضي لجمع النقاط!"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>الاختبار 🎯</span>
          </button>

          {/* User Name and Profile Click triggers info */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className={`text-xs font-bold block leading-tight ${profile.isPremium ? "text-amber-400" : "text-white"}`}>
                {profile.isPremium ? `👑 ${profile.username}` : profile.username}
              </span>
              <span className="text-[9px] text-emerald-400 leading-none h-3 font-sans block">{profile.favoriteTeamName}</span>
            </div>
            <div className={`w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-lg select-none border ${
              profile.isPremium ? "border-amber-400/40 shadow-md shadow-amber-500/10" : "border-slate-800"
            }`}>
              {profile.avatar}
            </div>
          </div>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg bg-red-950/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-red-500/10 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="تسجيل الخروج"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsSignUp(false);
            setIsAuthModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-2xl transition-all shadow-md shadow-amber-500/5 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 select-none font-sans"
          id="trigger-login-btn"
        >
          <LogIn className="w-4 h-4 text-slate-950" />
          <span>تسجيل دخول الأعضاء</span>
        </button>
      )}

      {/* Auth & Registration Dialog Model */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in" id="auth-modal">
          <div className="bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800/90 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            
            {/* Modal Closer */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg cursor-pointer bg-slate-900/60 hover:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 transition-all select-none"
            >
              ✕
            </button>

            {/* Modal Heading with Logo Decor */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-400">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">بوابة مشجعي المونديال الأسطوري</h3>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                سجل اسمك للانضمام إلى قائمة الخبراء، التصويت للتطوير، وتحصيل نقاط التوقع!
              </p>
            </div>

            {/* Feedback notifications */}
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs mb-4 text-right font-sans flex items-center gap-2">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs mb-4 text-right font-sans flex items-center gap-2 animate-pulse">
                <span><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> {successMsg}</span>
              </div>
            )}

            {/* Main Form Fields */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 font-sans">اسم المستخدم</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: يوسف، خبير_البرتغال"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500/50 focus:outline-none text-slate-100 placeholder-slate-600 text-xs font-sans text-right"
                  />
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 font-sans">البريد الإلكتروني (اختياري)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500/50 focus:outline-none text-slate-100 placeholder-slate-600 text-xs font-mono text-left"
                />
              </div>

              {/* Advanced details if brand new layout chosen */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 font-sans">منتخبك المفضل</label>
                  <select
                    value={favoriteTeamId}
                    onChange={(e) => setFavoriteTeamId(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500/50 focus:outline-none text-slate-100 text-xs font-sans text-right"
                  >
                    {TEAMS.map((team, idx) => (
                      <option key={team.id} value={team.id}>
                        {team.flag} {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 font-sans">الرمز التعبيري المفضل</label>
                  <select
                    value={selectedAvatar}
                    onChange={(e) => setSelectedAvatar(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500/50 focus:outline-none text-slate-100 text-xs text-center"
                  >
                    {AVATARS.map((av, idx) => (
                      <option key={idx} value={av}>
                        {av} الرمز التعبيري
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-500/5 cursor-pointer block text-center"
              >
                <span>دخول الآن وتفعيل الحساب 🚀</span>
              </button>

            </form>

            <div className="mt-5 pt-4 border-t border-slate-900 text-center text-[10px] text-slate-500 leading-normal font-sans">
              حساب تجريبي ذكي: بمجرد كتابة اسم فريد سيقوم النظام بتخزينه وتفعيله وتلقين نقاطك مباشرة عبر الكاش المحلي.
            </div>

          </div>
        </div>
      )}

      {/* Gamified Daily Trivia Modal */}
      {showTrivia && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" id="trivia-modal">
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative text-right">
            
            {/* Modal Closer */}
            <button
              onClick={() => setShowTrivia(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg cursor-pointer bg-slate-950 hover:bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 transition-all select-none"
            >
              ✕
            </button>

            <div className="flex items-center justify-end gap-2 text-amber-400 mb-3 text-xs font-bold font-sans">
              <span>التدريب والاختبار الرياضي لخبراء المونديال</span>
              <BookOpen className="w-4 h-4 text-amber-500" />
            </div>

            {/* If user logged trivia completed today, show limit */}
            {lastTriviaDay === currentDayKey && !triviaFeedback ? (
              <div className="space-y-4 text-center py-6">
                <div className="text-4xl animate-bounce">🏆⭐</div>
                <h3 className="text-base font-black text-white">أحسنت صنعاً في تدريب اليوم!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
                  لقد حصلت بالفعل على جائزتك اليوم وعززت مستواك. يتجدد الاختبار اليومي الممتع تلقائياً كل 24 ساعة لتمكينك من تجميع XP متواصل والترقي في مراتب المحللين الأيقونيين.
                </p>
                <button
                  onClick={() => setShowTrivia(false)}
                  className="px-5 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
                >
                  الرجوع لقاعة المونديال
                </button>
              </div>
            ) : (
              <div>
                {/* Question Info Header */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl mb-5 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>سؤال اليوم</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/20 uppercase font-bold tracking-wide font-mono">
                    قسم: {TRIVIA_QUESTIONS[activeTriviaIdx].credit}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-extrabold text-white mb-5 leading-normal">
                  {TRIVIA_QUESTIONS[activeTriviaIdx].q}
                </h3>

                {/* Multiple choices */}
                <div className="space-y-3">
                  {TRIVIA_QUESTIONS[activeTriviaIdx].options.map((opt, i) => {
                    const isSelected = selectedAnswerIdx === i;
                    const isCorrect = i === TRIVIA_QUESTIONS[activeTriviaIdx].correct;
                    
                    let btnStyle = "bg-slate-950 hover:bg-slate-850 text-slate-300 border-slate-850";
                    if (selectedAnswerIdx !== null) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 font-bold";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-500/10 text-rose-400 border-rose-500/40";
                      } else {
                        btnStyle = "bg-slate-950 opacity-40 text-slate-600 border-slate-850";
                      }
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAnswerSelect(i)}
                        disabled={selectedAnswerIdx !== null}
                        className={`w-full text-right p-3.5 rounded-xl text-xs border transition-all cursor-pointer font-sans ${btnStyle}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-sans font-medium">{opt}</span>
                          <span className="font-mono text-[10px] text-slate-500">[{i + 1}]</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Question results feedback */}
                {triviaFeedback && (
                  <div className={`mt-5 p-4 rounded-xl text-xs font-sans leading-relaxed text-right border ${
                    didCorrectTrivia
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 animate-pulse"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}>
                    {triviaFeedback}
                  </div>
                )}

                {/* Bottom Close */}
                {selectedAnswerIdx !== null && (
                  <button
                    onClick={() => setShowTrivia(false)}
                    className="w-full mt-5 py-3 bg-slate-950 text-slate-300 hover:text-white font-bold rounded-xl text-xs border border-slate-850 hover:border-slate-800 transition-all cursor-pointer"
                  >
                    إغلاق والعودة للتصفح
                  </button>
                )}
              </div>
            )}

            <div className="mt-4 text-center text-[10px] text-slate-500 leading-normal font-sans border-t border-slate-850/60 pt-3">
              كل تحديث يحرز تقدماً يسجله التطبيق في خزينتك الرياضية الخاصة بك!
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
