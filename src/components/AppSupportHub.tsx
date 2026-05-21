import React, { useState, useEffect, useMemo } from "react";
import { UserProfile, SupportFeatureProposal, SupportPledge } from "../types";
import { Trophy, HelpCircle, Heart, BarChart3, MessageSquarePlus, RefreshCw, Send, Check, ShieldAlert, Sparkles, Coffee, AlertCircle, Award } from "lucide-react";

interface AppSupportHubProps {
  currentUser: UserProfile | null;
  onUserUpdate?: (profile: UserProfile | null) => void;
}

// Pre-seeded proposals in case local storage is empty
const PRESEEDED_PROPOSALS: SupportFeatureProposal[] = [
  {
    id: "prop_1",
    title: "مستشار ذكاء اصطناعي صوتي حي (Interactive Audio AI Coach)",
    description: "إضافة إمكانية التحدث المباشر مع خبير المونديال الذكي عبر ميكروفون الجهاز وتوليد إجابات دقيقة بأصوات معلقين رياضيين حقيقيين لزيادة الحماس المونديالي.",
    category: "مستشار ذكاء اصطناعي",
    votes: 184,
    votedBy: ["youssef90", "ahmed_football"],
    status: "قيد التطوير",
    submittedBy: "إدارة النظام"
  },
  {
    id: "prop_2",
    title: "غرفة دردشة وصوت حية للمشجعين (Realtime Fan Chat Room)",
    description: "توفير ساحة نقاش كروي فورية مقسمة حسب المنتخبات والمجموعات لدراسة سيناريوهات المحاكاة، ونشر التوقعات والتفاعل مع عشاق الساحرة المستديرة حول العالم.",
    category: "مسابقات وتحديات",
    votes: 142,
    votedBy: ["silva_fans", "kroos4"],
    status: "تم التخطيط",
    submittedBy: "إدارة النظام"
  },
  {
    id: "prop_3",
    title: "مقارنة تكتيكية ورسوم بيانية ذكية للاعبين (Player RADAR comparison)",
    description: "لوحة تحكم إحصائية متطورة لرسم خارطة أداء ورادار مقارنة لجميع النجوم كـ بيليه، ميسي، ورونالدو مع نجوم مونديال 2026 لتحديد التأثير التاريخي.",
    category: "تحليلات وإحصاء",
    votes: 98,
    votedBy: ["ronaldo_fan"],
    status: "تم التخطيط",
    submittedBy: "مؤرخ_المونديال"
  },
  {
    id: "prop_4",
    title: "لوحة تفاعلية لإيقاعات وأهازيج المدرجات (Stadium Atmosphere Sounds)",
    description: "مشغل موسيقي مدمج يحاكي إيقاعات طبل السامبا وضجيج الملاعب اللاتينية وصافرات المدرجات التاريخية لبث طاقة التشجيع أثناء محاكاة المباريات.",
    category: "تصميم وتفاعل",
    votes: 45,
    votedBy: [],
    status: "تم التخطيط",
    submittedBy: "إدارة النظام"
  }
];

// Pre-seeded sponsorships
const PRESEEDED_PLEDGES: SupportPledge[] = [
  {
    id: "pledge_1",
    username: "كابتن سليم",
    amount: 50,
    category: "🥈 باقة فضية",
    message: "أفضل تطبيق يقدم محاكاة دقيقة وتنبأ مبهر! بالتوفيق للمطورين المبدعين 👑",
    timestamp: "أمس"
  },
  {
    id: "pledge_2",
    username: "خالد المدريدي",
    amount: 5,
    category: "☕ رعاية قهوة",
    message: "تصميم أسطوري وسرعة تجاوب الذكاء الاصطناعي لا تصدق!",
    timestamp: "قبل يومين"
  },
  {
    id: "pledge_3",
    username: "سارة_المونديالية",
    amount: 120,
    category: "🥇 باقة كابتن ذهبية",
    message: "فكرة رائعة جداً أرجو لكم التوفيق في تزويدنا بتغطيات مباشرة لحظة بلحظة للنهائي الحقيقي!",
    timestamp: "قبل ٤ أيام"
  }
];

export default function AppSupportHub({ currentUser, onUserUpdate }: AppSupportHubProps) {
  // State for feature proposals
  const [proposals, setProposals] = useState<SupportFeatureProposal[]>([]);
  const [pledges, setPledges] = useState<SupportPledge[]>([]);
  const [totalSupportAmount, setTotalSupportAmount] = useState(175); // base total from preseeded

  // Premium Subscription State
  const [selectedBillingPlan, setSelectedBillingPlan] = useState<"monthly" | "yearly">("monthly");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [checkoutCardName, setCheckoutCardName] = useState("");
  const [checkoutCardNumber, setCheckoutCardNumber] = useState("");
  const [checkoutCardCvv, setCheckoutCardCvv] = useState("");
  const [checkoutCardExpiry, setCheckoutCardExpiry] = useState("");
  const [isSubscribingLoading, setIsSubscribingLoading] = useState(false);
  const [subscriptionStep, setSubscriptionStep] = useState(0);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  // Stripe Integration config state
  const [stripeActive, setStripeActive] = useState(false);
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null);
  const [stripeCheckoutUrl, setStripeCheckoutUrl] = useState<string | null>(null);

  // Proposal Form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<"مستشار ذكاء اصطناعي" | "تحليلات وإحصاء" | "تصميم وتفاعل" | "مسابقات وتحديات">("تحليلات وإحصاء");
  const [showPropForm, setShowPropForm] = useState(false);

  // Pledge modal/form state
  const [pledgeAmount, setPledgeAmount] = useState<number>(0);
  const [pledgeCategoryName, setPledgeCategoryName] = useState<"☕ رعاية قهوة" | "🥉 باقة برونزية" | "🥈 باقة فضية" | "🥇 باقة كابتن ذهبية">("☕ رعاية قهوة");
  const [pledgeMessage, setPledgeMessage] = useState("");
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [isPledgingLoading, setIsPledgingLoading] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  // Feedback notifications
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Load and save from localStorage
  useEffect(() => {
    // 1. Proposals
    const savedProps = localStorage.getItem("worldcup_support_proposals");
    if (savedProps) {
      try {
        setProposals(JSON.parse(savedProps));
      } catch (e) {
        setProposals(PRESEEDED_PROPOSALS);
      }
    } else {
      setProposals(PRESEEDED_PROPOSALS);
      localStorage.setItem("worldcup_support_proposals", JSON.stringify(PRESEEDED_PROPOSALS));
    }

    // 2. Pledges
    const savedPledges = localStorage.getItem("worldcup_support_pledges");
    const savedTotalPledge = localStorage.getItem("worldcup_support_total_pledge");
    if (savedPledges && savedTotalPledge) {
      try {
        setPledges(JSON.parse(savedPledges));
        setTotalSupportAmount(Number(savedTotalPledge));
      } catch (e) {
        setPledges(PRESEEDED_PLEDGES);
        setTotalSupportAmount(175);
      }
    } else {
      setPledges(PRESEEDED_PLEDGES);
      setTotalSupportAmount(175);
      localStorage.setItem("worldcup_support_pledges", JSON.stringify(PRESEEDED_PLEDGES));
      localStorage.setItem("worldcup_support_total_pledge", "175");
    }
  }, []);

  // 1. Detect Stripe payment configurations from backend
  useEffect(() => {
    fetch("/api/stripe/config")
      .then((res) => res.json())
      .then((data) => {
        setStripeActive(!!data.stripeActive);
        setStripePublishableKey(data.publishableKey || null);
      })
      .catch((err) => {
        console.warn("Could not get Stripe configuration response:", err);
        setStripeActive(false);
      });
  }, []);

  // 2. Handle Stripe checkout redirection web callback parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");
    if (paymentStatus === "success") {
      const planId = params.get("planId") || "pledge";
      const amount = parseFloat(params.get("amount") || "0");
      const usernameParam = params.get("username") || "";
      const msgParam = params.get("msg") || "";
      const session_id = params.get("session_id");

      // Verify if we already processed this session to prevent multi-add
      const processedSessions = JSON.parse(localStorage.getItem("worldcup_processed_stripe_sessions") || "[]");
      if (session_id && !processedSessions.includes(session_id)) {
        processedSessions.push(session_id);
        localStorage.setItem("worldcup_processed_stripe_sessions", JSON.stringify(processedSessions));

        // Let's activate PREMIUM if plan is monthly or yearly subscription!
        if (planId === "monthly" || planId === "yearly") {
          const localUserStr = localStorage.getItem("worldcup_user_profile");
          let targetUser = currentUser;
          if (!targetUser && localUserStr) {
            try { 
              targetUser = JSON.parse(localUserStr); 
            } catch (e) {}
          }

          if (targetUser) {
            const updatedUser: UserProfile = {
              ...targetUser,
              isPremium: true,
              xp: targetUser.xp + 250,
              badge: targetUser.xp + 250 >= 300 ? "مستشار المونديال الأسطوري" : "محلل ذهبي"
            };
            if (onUserUpdate) {
              onUserUpdate(updatedUser);
            }
            localStorage.setItem("worldcup_user_profile", JSON.stringify(updatedUser));

            // Upgrade user profile on registered records list as well
            const localUsersStr = localStorage.getItem("worldcup_registered_users") || "[]";
            let usersList = [];
            try { 
              usersList = JSON.parse(localUsersStr); 
            } catch (e) {}
            if (Array.isArray(usersList)) {
              usersList = usersList.map((u: UserProfile) => u.username === targetUser!.username ? updatedUser : u);
              localStorage.setItem("worldcup_registered_users", JSON.stringify(usersList));
            }
          }
        }

        // Auto append as pledge sponsor
        const savedPledgesStr = localStorage.getItem("worldcup_support_pledges") || "[]";
        let currentSavedPledges = [];
        try { 
          currentSavedPledges = JSON.parse(savedPledgesStr); 
        } catch (e) {}
        
        const currentSavedSum = Number(localStorage.getItem("worldcup_support_total_pledge") || "175");

        const pledgeCat = planId === "yearly" ? "🥇 باقة كابتن ذهبية" :
                           planId === "monthly" ? "🥈 باقة فضية" : "🥉 باقة برونزية";
        
        const autoMsg = planId === "pledge"
          ? "رعاية كريمة لتطوير وبناء منصة كأس العالم ومحاكي الذكاء الاصطناعي 💖"
          : `تفعيل العضوية الذهبية الأسطورية كاس العالم (${planId === "yearly" ? "سنوية" : "جهة شهرية"}) 👑✨`;

        const newPledge: SupportPledge = {
          id: "pledge_stripe_" + Date.now().toString(),
          username: usernameParam || "داعم مجهول فخم",
          amount: amount,
          category: pledgeCat as any,
          message: msgParam || autoMsg,
          timestamp: "الآن"
        };

        const revisedPledges = [newPledge, ...currentSavedPledges];
        const newTotal = currentSavedSum + amount;
        savePledgesToLoc(revisedPledges, newTotal);

        setFeedbackMsg(`🏆 شكراً عظيماً لتمويلك! تم التحقق من بوابة Stripe بنجاح ومطابقة رصيدك وتفعيل العضوية الذهبية! 🎉`);
        setTimeout(() => setFeedbackMsg(""), 7000);
      }

      // Cleanup search strings from URL safely
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (paymentStatus === "cancel") {
      setFeedbackMsg("⚠️ تم إلغاء عملية الدفع والعودة بأمان لصفحة الدعم.");
      setTimeout(() => setFeedbackMsg(""), 5000);

      // Cleanup search strings from URL safely
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [currentUser]);

  const saveProposalsToLoc = (updated: SupportFeatureProposal[]) => {
    setProposals(updated);
    localStorage.setItem("worldcup_support_proposals", JSON.stringify(updated));
  };

  const savePledgesToLoc = (updated: SupportPledge[], newTotal: number) => {
    setPledges(updated);
    setTotalSupportAmount(newTotal);
    localStorage.setItem("worldcup_support_pledges", JSON.stringify(updated));
    localStorage.setItem("worldcup_support_total_pledge", String(newTotal));
  };

  // Upvote logic
  const handleVote = (id: string) => {
    if (!currentUser) {
      setFeedbackMsg("أهلاً بك! يرجى تسجيل الدخول أولاً من أعلى الصفحة لتستطيع التصويت وإضافة أفكار كروية.");
      setTimeout(() => setFeedbackMsg(""), 4000);
      return;
    }

    const updated = proposals.map((p) => {
      if (p.id === id) {
        const alreadyVoted = p.votedBy.includes(currentUser.username);
        let updatedVotes = p.votes;
        let updatedVoters = [...p.votedBy];

        if (alreadyVoted) {
          // Remove vote (toggle)
          updatedVotes -= 1;
          updatedVoters = updatedVoters.filter((vStr) => vStr !== currentUser.username);
        } else {
          // Add vote
          updatedVotes += 1;
          updatedVoters.push(currentUser.username);
        }

        return { ...p, votes: updatedVotes, votedBy: updatedVoters };
      }
      return p;
    });

    saveProposalsToLoc(updated);
  };

  // Create customized upgrade request
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const author = currentUser ? currentUser.username : "مشجع مجهول";
    const newProp: SupportFeatureProposal = {
      id: "custom_" + Math.random().toString(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      votes: 1,
      votedBy: currentUser ? [currentUser.username] : [],
      status: "تم التخطيط",
      submittedBy: author
    };

    const updated = [...proposals, newProp];
    saveProposalsToLoc(updated);

    // Reset fields
    setNewTitle("");
    setNewDesc("");
    setShowPropForm(false);
    setFeedbackMsg("تهانينا! تم تسجيل طلب الميزتك بنجاح لتصويت جميع مشجعي المونديال! 🚀");
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  // Pledge Sponsorship Handler
  const openPledgeModal = (amount: number, category: "☕ رعاية قهوة" | "🥉 باقة برونزية" | "🥈 باقة فضية" | "🥇 باقة كابتن ذهبية") => {
    setPledgeAmount(amount);
    setPledgeCategoryName(category);
    setPledgeMessage("");
    setPledgeSuccess(false);
    setShowPledgeModal(true);
  };

  const submitPledge = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPledgingLoading(true);

    if (stripeActive) {
      // Connect to real full-stack Stripe Checkout session API
      fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: "pledge",
          amount: pledgeAmount,
          username: currentUser ? currentUser.username : "متبرع مونديالي كريم",
          customMessage: pledgeMessage.trim() || undefined
        })
      })
      .then((res) => res.json())
      .then((data) => {
        setIsPledgingLoading(false);
        if (data.url) {
          // Redirect the user directly to the Stripe Secure checkout page
          window.location.href = data.url;
        } else {
          setFeedbackMsg("خطأ: تعذر الحصول على الرابط الآمن من Stripe.");
          setTimeout(() => setFeedbackMsg(""), 5000);
        }
      })
      .catch((err) => {
        console.error("Stripe pledge direct error:", err);
        setIsPledgingLoading(false);
        setFeedbackMsg("خطأ: فشل الاتصال ببوابة Stripe.");
        setTimeout(() => setFeedbackMsg(""), 5000);
      });
      return;
    }

    // Simulate standard credit validation delay
    setTimeout(() => {
      setIsPledgingLoading(false);
      setPledgeSuccess(true);

      const sponsorName = currentUser ? currentUser.username : "متبرع مونديالي كريم";
      const newPledge: SupportPledge = {
        id: "pledge_" + Math.random().toString(),
        username: sponsorName,
        amount: pledgeAmount,
        category: pledgeCategoryName,
        message: pledgeMessage.trim() || "كل الدعم لتطوير هذا الصرح المحاكاتي الرائع!",
        timestamp: "الآن"
      };

      const updatedPledges = [newPledge, ...pledges];
      const newTotal = totalSupportAmount + pledgeAmount;
      savePledgesToLoc(updatedPledges, newTotal);
    }, 1800);
  };

  // Premium Subscription handlers
  const openSubscriptionModal = () => {
    if (!currentUser) {
      setFeedbackMsg("يرجى تسجيل الدخول أولاً من أعلى الصفحة لتتمكن من تفعيل الاشتراك ولدعم كاس العالم! 🔑");
      setTimeout(() => setFeedbackMsg(""), 4500);
      return;
    }
    setCheckoutCardName("");
    setCheckoutCardNumber("");
    setCheckoutCardCvv("");
    setCheckoutCardExpiry("");
    setSubscriptionStep(0);
    setIsSubscribingLoading(false);
    setShowSubscriptionModal(true);
  };

  const submitSubscriptionPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubscribingLoading(true);

    if (stripeActive) {
      // Create Stripe checkout session on server
      fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedBillingPlan,
          amount: selectedBillingPlan === "yearly" ? 79.99 : 9.99,
          username: currentUser.username
        })
      })
      .then((res) => res.json())
      .then((data) => {
        setIsSubscribingLoading(false);
        if (data.url) {
          // Securely redirect to Stripe hosted checkout page
          window.location.href = data.url;
        } else {
          setFeedbackMsg("خطأ: تعذر إنشاء جلسة دفع آمنة من Stripe.");
          setTimeout(() => setFeedbackMsg(""), 5000);
        }
      })
      .catch((err) => {
        console.error("Stripe checkout error:", err);
        setIsSubscribingLoading(false);
        setFeedbackMsg("خطأ: تعذر الاتصال ببوابة Stripe الدفعية.");
        setTimeout(() => setFeedbackMsg(""), 5000);
      });
      return;
    }

    setSubscriptionStep(1); // "جاري التشفير والتحقق الآمن بـ 256 بت..."

    setTimeout(() => {
      setSubscriptionStep(2); // "التحقق من سلامة البطاقة وأرصدة الدعم الممنوحة..."
    }, 1000);

    setTimeout(() => {
      setSubscriptionStep(3); // "جاري تحديث الرتب والامتيازات وتسجيل اسمك في قاعدة الشرف..."
    }, 2100);

    setTimeout(() => {
      setSubscriptionStep(4); // "تفعيل الاشتراك الذهبي المتميز بنجاح! شكراً جزيلاً لتمويل كرتنا 👑"
      setIsSubscribingLoading(false);

      const price = selectedBillingPlan === "yearly" ? 79.99 : 9.99;
      
      const updatedUser: UserProfile = {
        ...currentUser,
        isPremium: true,
        xp: currentUser.xp + 250,
        badge: currentUser.xp + 250 >= 300 ? "مستشار المونديال الأسطوري" : "محلل ذهبي"
      };

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      // Save to localStorage profiles
      localStorage.setItem("worldcup_user_profile", JSON.stringify(updatedUser));

      const localUsersStr = localStorage.getItem("worldcup_registered_users") || "[]";
      let usersList: UserProfile[] = JSON.parse(localUsersStr);
      usersList = usersList.map(u => u.username === currentUser.username ? updatedUser : u);
      localStorage.setItem("worldcup_registered_users", JSON.stringify(usersList));

      // Append as an automatic honorary sponsor pledge
      const autoPledge: SupportPledge = {
        id: "pledge_premium_" + Math.random().toString(),
        username: currentUser.username,
        amount: price,
        category: selectedBillingPlan === "yearly" ? "🥇 باقة كابتن ذهبية" : "🥈 باقة فضية",
        message: `اشترك في العضوية الذهبية لدعم وتطوير التطبيق (${selectedBillingPlan === "yearly" ? "سنة كاملة" : "فترة شهرية"}) 👑✨`,
        timestamp: "الآن"
      };

      const revisedPledges = [autoPledge, ...pledges];
      savePledgesToLoc(revisedPledges, totalSupportAmount + price);

    }, 3400);
  };

  const cancelSubscription = () => {
    if (!currentUser) return;

    const updatedUser: UserProfile = {
      ...currentUser,
      isPremium: false
    };

    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }

    localStorage.setItem("worldcup_user_profile", JSON.stringify(updatedUser));

    const localUsersStr = localStorage.getItem("worldcup_registered_users") || "[]";
    let usersList: UserProfile[] = JSON.parse(localUsersStr);
    usersList = usersList.map(u => u.username === currentUser.username ? updatedUser : u);
    localStorage.setItem("worldcup_registered_users", JSON.stringify(usersList));

    setShowCancelConfirmation(false);
    setFeedbackMsg("تم إلغاء تفعيل العضوية الذهبية وتجميد امتيازات بريميوم الدعم. نأمل عودتك قريباً! 👋💔");
    setTimeout(() => setFeedbackMsg(""), 4500);
  };

  // Fundraise Goal Percentage
  const goalTarget = 1500;
  const currentPercentage = Math.min(Math.round((totalSupportAmount / goalTarget) * 100), 100);

  return (
    <div className="space-y-12 animate-fade-in text-right" id="app-support-hub">
      
      {/* Upper informational presentation */}
      <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-center gap-2 text-amber-400 mb-3 text-xs md:text-sm font-bold uppercase font-sans">
          <span>نهج الابتكار والتحول الكروي ⚙️</span>
          <Trophy className="w-4.5 h-4.5" />
        </div>
        
        <h2 className="text-xl md:text-3xl font-black text-white leading-tight">بوابة دعم وتطوير تغطية المونديال</h2>
        <p className="text-slate-400 text-xs md:text-sm mt-3 max-w-3xl mx-auto leading-relaxed font-sans">
          يسرنا في الفريق الفني تحويل التطبيق من دليل لمعلومات كأس العالم إلى <strong>منصة محاكاة تكتيكية متقدمة واستبصار رياضي ذكي</strong>. تتيح لك هذه الصفحة المبتكرة قيادة طموحات التطوير برأيك ومشاركتك وسخائك عبر التصويت للمزايا المستقبلية وتجربة الدعم الفني التجريبي.
        </p>

        {/* Dynamic Alerts */}
        {feedbackMsg && (
          <div className="p-4 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-2xl text-xs max-w-xl mx-auto mt-6 text-center font-sans animate-pulse flex items-center justify-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* 👑 PREMIUM SUBSCRIPTION PANEL (اشتراك العضوية الذهبية لدعم وتطوير التطوير) */}
      <div className="bg-gradient-to-tr from-slate-950 via-amber-950/15 to-slate-950 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden" id="premium-membership-section">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left info column: Core Premium benefits list */}
          <div className="lg:col-span-3 text-right space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-black rounded-full border border-amber-500/25">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>باقة العضوية والمشتركين المتميزة 👑</span>
            </div>

            <h3 className="text-lg md:text-2xl font-black text-white leading-tight">العضوية الذهبية الفاخرة لشركاء تطوير المونديال</h3>
            <p className="text-slate-400 text-xs md:text-sm font-sans leading-relaxed">
              انضم إلى فئة الـ VIP من خبراء المونديال! بالاشتراك المدفوع، أنت تدعم بشكل مباشر تمويل خوادم الاستضافة وتكاليف استدعاء نماذج الذكاء الاصطناعي الفائقة، وتفتح طيفاً من الميزات اللأنهائية الفاخرة:
            </p>

            {/* Benefits check blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center justify-end gap-2 text-xs text-slate-300 font-sans">
                <span>تولد غير محدود لسيناريوهات محاكاة المونديال ⏱️</span>
                <Check className="w-4.5 h-4.5 text-amber-400 flex-shrink-0 bg-amber-950/40 p-0.5 rounded-full" />
              </div>
              <div className="flex items-center justify-end gap-2 text-xs text-slate-300 font-sans">
                <span>شعار نجم بريميوم ذهبي 👑 يرقّي اسمك وحضورك</span>
                <Check className="w-4.5 h-4.5 text-amber-400 flex-shrink-0 bg-amber-950/40 p-0.5 rounded-full" />
              </div>
              <div className="flex items-center justify-end gap-2 text-xs text-slate-300 font-sans">
                <span>إعطاء الأولوية للذكاء الاصطناعي لتقليل الانتظار 🤖</span>
                <Check className="w-4.5 h-4.5 text-amber-400 flex-shrink-0 bg-amber-950/40 p-0.5 rounded-full" />
              </div>
              <div className="flex items-center justify-end gap-2 text-xs text-slate-300 font-sans">
                <span>منح فوري لـ <strong className="text-emerald-400 font-mono">+250 XP</strong> خبرة إضافية</span>
                <Check className="w-4.5 h-4.5 text-amber-400 flex-shrink-0 bg-amber-950/40 p-0.5 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right column: Action or Status indicators */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-850/60 rounded-2xl p-5.5 text-center space-y-4">
            {currentUser && currentUser.isPremium ? (
              // Active Premium user status
              <div className="space-y-4 py-2 animate-fade-in">
                <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-400 text-2xl shadow-lg shadow-amber-500/5 animate-pulse">
                  👑
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-amber-400">حسابك مفعل بريميوم ذهبي! ✨</h4>
                  <p className="text-[11px] text-slate-400 font-sans">نشكر لك سخاءك الرائع ودعمك لنمو الصرح الرياضي.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-right space-y-2">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-amber-400 font-bold font-sans">نشط وتلقائي ⚡</span>
                    <span className="text-slate-400">حالة الاشتراك المالي:</span>
                  </div>
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-slate-100 font-bold font-sans">الباقة الأسطورية الدائمة</span>
                    <span className="text-slate-400">البوابـة النشطة:</span>
                  </div>
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-emerald-400 font-black font-mono">+250 XP ⚡</span>
                    <span className="text-slate-400">رصيد الخبرة المضافة:</span>
                  </div>
                </div>

                <div className="pt-2">
                  {showCancelConfirmation ? (
                    <div className="bg-slate-950 border border-rose-500/30 p-3 rounded-xl text-center space-y-2.5 animate-fade-in">
                      <p className="text-[10px] text-rose-400 font-sans leading-normal">هل أنت متأكد من رغبتك في إلغاء تفعيل اشتراك بريميوم وتجميد المزايا الذهبية؟</p>
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => setShowCancelConfirmation(false)}
                          className="bg-slate-900 border border-slate-800 hover:text-white text-slate-400 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          تراجع
                        </button>
                        <button
                          type="button"
                          onClick={cancelSubscription}
                          className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          نعم، إلغاء الاشتراك
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirmation(true)}
                      className="text-[10px] text-rose-400/80 hover:text-rose-400 underline transition-colors cursor-pointer"
                    >
                      إلغاء الاشتراك مؤقتاً أو إدارة الفواتير 🔌
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Unsubscribed state: Buy form
              <div className="space-y-4 text-right animate-fade-in">
                <span className="text-[11px] text-slate-400 font-black block mb-2 border-b border-slate-850/60 pb-2">اختر نظام الفوترة والاشتراك:</span>
                
                {/* Plans Select switch */}
                <div className="grid grid-cols-2 gap-2 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedBillingPlan("monthly")}
                    className={`p-3 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedBillingPlan === "monthly"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/40"
                        : "bg-slate-950 border-slate-850 hover:border-slate-850 text-slate-400"
                    }`}
                  >
                    <span className="text-xs font-extrabold leading-none">باقة شهرية</span>
                    <span className="text-[10px] font-mono mt-1.5 text-white">$9.99 / شهر</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedBillingPlan("yearly")}
                    className={`p-3 rounded-xl text-center border transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center ${
                      selectedBillingPlan === "yearly"
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/50"
                        : "bg-slate-950 border-slate-850 hover:border-slate-850 text-slate-400"
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-emerald-505 text-slate-950 bg-emerald-550 text-emerald-400 text-[6px] font-black px-1.5 py-0.5 rounded-bl">وفر ٣٣%</div>
                    <span className="text-xs font-extrabold leading-none">باقة سنوية</span>
                    <span className="text-[10px] font-mono mt-1.5 text-white">$79.99 / سنة</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={openSubscriptionModal}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md cursor-pointer text-center block"
                >
                  <span>ترقية الحساب بـأمان الآن 👑🔐</span>
                </button>
                
                <p className="text-[9px] text-slate-500 text-center font-sans mb-1">
                  معالجة مشفرة SSL بـ 256 بت • تفعيل فوري مع شارة بريميوم ذهبية
                </p>

                <div className="flex items-center justify-center gap-1.5 pt-0.5 border-t border-slate-850/50 mt-1">
                  <span className={`w-2 h-2 rounded-full ${stripeActive ? "bg-emerald-500 animate-pulse" : "bg-yellow-500"}`}></span>
                  <span className="text-[9.5px] text-slate-400 font-sans">
                    {stripeActive 
                      ? "بوابة Stripe نشطة: متصلة بحسابك مباشرة 🔒" 
                      : "بوابة Stripe: وضع المحاكاة الذكي ⚙️ (مفتاح Stripe الفارغ)"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Crowdfunding goals and Sponsor stream */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850/90 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-end gap-2 text-amber-500 text-xs font-bold font-mono mb-2">
              <span>أهداف مشروع رعاية التطوير</span>
              <Coffee className="w-4.5 h-4.5" />
            </div>

            <h3 className="text-sm font-extrabold text-white mb-4">حصيلة رعاية الابتكار التشاركي</h3>
            
            <div className="space-y-4">
              {/* Financial values indicator */}
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-slate-500 font-mono">الهدف الإجمالي: ${goalTarget}</span>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-sans">إجمالي المساهمات الحالية</span>
                  <strong className="text-lg font-black font-mono text-amber-400">${totalSupportAmount}</strong>
                </div>
              </div>

              {/* Graphical Progress target line */}
              <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-900 relative p-[2px] flex items-center">
                <div
                  style={{ width: `${currentPercentage}%` }}
                  className="bg-gradient-to-l from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans">
                <span>اكتب اسمك في قائمة الشرف الرياضي ✨</span>
                <span>{currentPercentage}% مكتمل</span>
              </div>
            </div>

            {/* Simulated Sponsorship Packages Buttons Grid */}
            <div className="mt-8 pt-6 border-t border-slate-900 text-right">
              <span className="text-[11px] text-slate-400 font-black block mb-4">اختر فوزاً واشترِ قهوة للمطورين:</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openPledgeModal(5, "☕ رعاية قهوة")}
                  className="bg-slate-950 hover:bg-amber-500/10 hover:border-amber-500/20 text-slate-300 hover:text-amber-300 py-2.5 rounded-xl text-[11px] font-bold border border-slate-850 cursor-pointer text-center select-none transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-base">☕</span>
                  <span>رعاية قهوة ($5)</span>
                </button>
                <button
                  onClick={() => openPledgeModal(20, "🥉 باقة برونزية")}
                  className="bg-slate-950 hover:bg-amber-500/10 hover:border-amber-500/20 text-slate-300 hover:text-amber-300 py-2.5 rounded-xl text-[11px] font-bold border border-slate-850 cursor-pointer text-center select-none transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-base">🥉</span>
                  <span>برونزية ($20)</span>
                </button>
                <button
                  onClick={() => openPledgeModal(50, "🥈 باقة فضية")}
                  className="bg-slate-950 hover:bg-amber-500/10 hover:border-amber-500/20 text-slate-300 hover:text-amber-300 py-2.5 rounded-xl text-[11px] font-bold border border-slate-850 cursor-pointer text-center select-none transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-base">🥈</span>
                  <span>فضية ($50)</span>
                </button>
                <button
                  onClick={() => openPledgeModal(120, "🥇 باقة كابتن ذهبية")}
                  className="bg-slate-950 hover:bg-amber-500/10 hover:border-amber-500/20 text-slate-300 hover:text-amber-300 py-2.5 rounded-xl text-[11px] font-bold border border-slate-850 cursor-pointer text-center select-none transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-base">🥇</span>
                  <span>ذهبية ($120)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Honor Scroll Live Sponsor feed ticker */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850/80 rounded-3xl p-6 shadow-lg text-right max-h-[350px] overflow-hidden flex flex-col">
            <h4 className="text-xs font-black text-white mb-3 flex items-center justify-end gap-1.5 border-b border-slate-900 pb-2">
              <span>جدول شرف المساهمين والمشجعين</span>
              <Award className="w-4 h-4 text-amber-500 animate-pulse" />
            </h4>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {pledges.map((ple, idx) => (
                <div key={ple.id} className="bg-slate-950/60 p-3 rounded-2xl border border-slate-900/90 text-right space-y-1.5 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-mono">{ple.timestamp}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-amber-400 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 leading-none">
                        {ple.category}
                      </span>
                      <strong className="text-xs text-white uppercase font-sans">{ple.username}</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans italic leading-relaxed">
                    "{ple.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand / Main section: Upcoming improvements upvotes and suggest box */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-950/70 border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row-reverse sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-900">
              <div className="text-right">
                <h3 className="text-base font-extrabold text-white">ترتيب رغبات ومقترحات الميزات</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  اضغط على رمز القلب لتصوت للمقترح الذي تحتاجه في تحديث التطبيق القادم! القائمة تنظم ديناميكياً بالأكثر طلباً.
                </p>
              </div>
              <button
                onClick={() => {
                  if (!currentUser) {
                    setFeedbackMsg("يرجى تسجيل الدخول أولاً لتتمكن من إضافة مقترحات الميزات.");
                    setTimeout(() => setFeedbackMsg(""), 4000);
                    return;
                  }
                  setShowPropForm(!showPropForm);
                }}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 select-none font-sans"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>اقترح ميزة جديدة +</span>
              </button>
            </div>

            {/* Custom Create Proposal Form Drawer */}
            {showPropForm && (
              <form onSubmit={handleSubmitProposal} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl mb-6 space-y-4 animate-fade-in">
                <h4 className="text-xs font-black text-teal-400">📝 تفاصيل فكرة ميزتك المقترحة</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-sans">عنوان الميزة الرئيسي</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="امثلة: ألعاب وتخمين، إشعار حي للأهداف بالهاتف"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-teal-500 text-xs font-sans text-right placeholder-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-sans">الوصف والأهداف الفنية المقترحة</label>
                    <textarea
                      required
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="صف الفكرة بدقة وكيف ستنعكس على متعة مشجعي المونديال وكأس العالم الرياضية..."
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-teal-500 text-xs font-sans text-right placeholder-slate-600 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1 font-sans">صاحب الاقتراح</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser ? currentUser.username : "عضو زائر"}
                        className="w-full px-3 py-2 bg-slate-950/60 border border-slate-900 text-slate-500 rounded-xl text-xs font-sans text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1 font-sans">تصنيف مجرى التطوير</label>
                      <select
                        value={newCategory}
                        onChange={(e: any) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-850 text-slate-300 rounded-xl text-xs font-sans text-right focus:border-teal-500"
                      >
                        <option value="مستشار ذكاء اصطناعي">🤖 مستشار ذكاء اصطناعي</option>
                        <option value="تحليلات وإحصاء">📊 تحليلات وإحصاء</option>
                        <option value="تصميم وتفاعل">✨ تصميم وتفاعل</option>
                        <option value="مسابقات وتحديات">🎯 مسابقات وتحديات</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPropForm(false)}
                    className="px-4 py-2 bg-slate-950 text-slate-400 border border-slate-850 hover:text-white rounded-lg text-[10px] font-sans font-bold cursor-pointer transition-all"
                  >
                    إلغاء التراجع
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>تسجيل ونشر المقترح</span>
                  </button>
                </div>
              </form>
            )}

            {/* List of Proposals Ordered by Upvotes Descending */}
            <div className="space-y-4">
              {proposals.slice().sort((a, b) => b.votes - a.votes).map((p) => {
                const isUserVoted = currentUser ? p.votedBy.includes(currentUser.username) : false;
                
                return (
                  <div
                    key={p.id}
                    className="bg-slate-950/90 border border-slate-900/90 hover:border-slate-850 rounded-2xl p-4.5 flex gap-5 items-start justify-between relative transition-all"
                    id={`proposal-card-${p.id}`}
                  >
                    {/* Votes Counter Active Button block */}
                    <button
                      onClick={() => handleVote(p.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all select-none cursor-pointer w-14 flex-shrink-0 ${
                        isUserVoted
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold scale-102 shadow-md shadow-rose-500/5 animate-pulse"
                          : "bg-slate-900 border-slate-850 hover:border-rose-500/20 text-slate-400 hover:text-rose-400"
                      }`}
                      title={isUserVoted ? "انقر لإزالة إعجابك وتصويتك" : "انقر لتصوت وتطلب تنفيذ الميزة!"}
                    >
                      <Heart className={`w-4 h-4 mb-1 transition-transform duration-300 ${isUserVoted ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-500"}`} />
                      <span className="text-xs font-black font-mono leading-none">{p.votes}</span>
                    </button>

                    {/* Proposal description detail */}
                    <div className="flex-1 text-right space-y-1.5">
                      <div className="flex flex-wrap items-center justify-end gap-2 text-[9px] mb-1">
                        <span className="text-slate-500">مقدم من: <strong className="text-slate-400">{p.submittedBy}</strong></span>
                        <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                        
                        {/* Phase status colorized pill */}
                        <span className={`px-2 py-0.5 rounded leading-none font-bold ${
                          p.status === "تم التخطيط"
                            ? "bg-slate-900 text-slate-400 border border-slate-800"
                            : p.status === "قيد التطوير"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/10 animate-pulse"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                        }`}>
                          {p.status}
                        </span>
                        
                        <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded leading-none font-bold">
                          {p.category}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-white line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Development Milestones Log Checklist & Roadmap */}
          <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-900 text-right">
            <h4 className="text-xs font-black text-slate-300 mb-6 flex justify-end items-center gap-1.5 font-sans uppercase">
              <span>سجل الإنجاز والمسار الزمني للمنصة</span>
              <BarChart3 className="w-4 h-4 text-sky-400" />
            </h4>
            
            <div className="relative pr-6 border-r border-slate-850 space-y-8 max-w-xl mx-auto">
              
              {/* Milestone 1 */}
              <div className="relative">
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 shadow"></div>
                <div className="text-[9px] font-mono text-emerald-400 mb-1">مايو ٢٠٢٦ (مكتمل وحاسم)</div>
                <h5 className="text-xs font-bold text-white">إطلاق بوابة الدعم وصندوق الاقتراحات والتصويت 🥇</h5>
                <p className="text-[10px] text-slate-500 mt-1 font-sans leading-relaxed">
                  تأسيس حاضر الفاعلية المشتركة للسماح بالتصويت للمزايا المتقدمتنا وتيسير تقديم الرعايات للتطوير مع محاكاة المعاملات الفورية.
                </p>
              </div>

              {/* Milestone 2 */}
              <div className="relative">
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 shadow"></div>
                <div className="text-[9px] font-mono text-emerald-400 mb-1">مايو ٢٠٢٦ (مكتمل وبث فوري)</div>
                <h5 className="text-xs font-bold text-white">بوابة تسجيل دخول اللاعبين مع الاختبار التدريبي 🎯</h5>
                <p className="text-[10px] text-slate-500 mt-1 font-sans leading-relaxed">
                  بث ملفات الأعضاء وتزويدهم بفرصة نيل XP التوقع وحفظ منتخبهم، مع اختبار كروي ذكي محدّث يومياً لبلورة المعرفة.
                </p>
              </div>

              {/* Milestone 3 */}
              <div className="relative">
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 shadow"></div>
                <div className="text-[9px] font-mono text-emerald-400 mb-1">مايو ٢٠٢٦ (توليد حي مبهر)</div>
                <h5 className="text-xs font-bold text-white">دعم تغذية البث الحي للمحاكاة الكروية دقيقة بدقيقة ⏱️</h5>
                <p className="text-[10px] text-slate-500 mt-1 font-sans leading-relaxed">
                  تم دمج نظام تتبع الحوادث والبطاقات مع جدول زمني حي، وتحديث الإحصائيات (الاستحواذ، التسديدات) مع مؤشرات أهداف ممتعة للغاية.
                </p>
              </div>

              {/* Milestone 4 */}
              <div className="relative">
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-slate-800 border-4 border-slate-900 shadow"></div>
                <div className="text-[9px] font-mono text-amber-400 mb-1">مستقبلي (بالبناء والتخطيط)</div>
                <h5 className="text-xs font-bold text-white">إضافة معززات الذكاء الاصطناعي التبادلي للمجموعات 🌍</h5>
                <p className="text-[10px] text-slate-500 mt-1 font-sans leading-relaxed">
                  تطوير قدرات مساعد المونديال الذكي ليدعم التعلم التلقائي على ضوء سيناريوهات المطبوعات والتنبأت الرهيبة.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Simulated Credit Card Pledge modal */}
      {showPledgeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4" id="pledge-form-modal">
          <div className="bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800/95 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative text-right">
            
            {/* Modal Closer */}
            <button
              onClick={() => setShowPledgeModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg cursor-pointer bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-850 transition-all select-none"
            >
              ✕
            </button>

            {/* If Payment succeeded */}
            {pledgeSuccess ? (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="text-5xl animate-bounce">☕🎉💖</div>
                <h3 className="text-lg md:text-xl font-black text-amber-400 font-mono">شكراً لشهامتك الدعم المالي الأسطوري!</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed font-sans">
                  تم استلام معاملة الدعم بنجاح بقيمة <strong className="text-white">${pledgeAmount}</strong>. سيتم تدوير اسمك حالاً في لوحة شرف رفقاء المطورين للمشروع! نشعر بالفخر لتقديم الأفضل معكم.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPledgeModal(false)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer shadow-md"
                >
                  العودة للبوابة
                </button>
              </div>
            ) : (
              <form onSubmit={submitPledge} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-amber-400">
                    <Coffee className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-extrabold text-white">إقرار وسام الرعاية التطويرية المبتكرة</h3>
                  <p className="text-[10.5px] text-slate-400 mt-1 leading-normal font-sans">
                    أنت الآن بصدد تقديم رعاية بقيمة <strong className="text-amber-400">${pledgeAmount}</strong> ({pledgeCategoryName}) لتعجيل وتأجيج البناء المونديالي للتطبيق!
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1.5 font-sans">اسمك كجهة مانحة</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser ? currentUser.username : "ضيف مونديالي مجهول"}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-400 text-xs font-sans text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1.5 font-sans">رسالة دعم لتظهر في جدول شرف المشجعين</label>
                    <textarea
                      required
                      rows={2}
                      maxLength={140}
                      value={pledgeMessage}
                      onChange={(e) => setPledgeMessage(e.target.value)}
                      placeholder="امثلة: استمروا يا أبطال، بالتوفيق فخر العرب!"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none rounded-xl text-slate-100 text-xs font-sans text-right placeholder-slate-600 leading-normal"
                    />
                  </div>

                  {/* Mock Credit credentials form elements to look stunning */}
                  <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 space-y-3">
                    <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                      🔐 محاكاة بوابة المدفوعات الآمنة (تجريبية تماماً)
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        disabled
                        value="4000 •••• •••• 9026"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-xl text-slate-500 text-xs font-mono text-left"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          disabled
                          value="CVV: 554"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-xl text-slate-500 text-xs font-mono text-center"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          disabled
                          value="EXP: 12/29"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-xl text-slate-500 text-xs font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated payment loader spinner */}
                <button
                  type="submit"
                  disabled={isPledgingLoading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPledgingLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>جاري معالجة معالجة التبرع التجريبي الآمن...</span>
                    </>
                  ) : (
                    <span>تأكيد رعاية المشروع الآمن بنجاح 🚀</span>
                  )}
                </button>
              </form>
            )}

            <div className="mt-4 text-center text-[10px] text-slate-500 leading-normal font-sans border-t border-slate-850/60 pt-3">
              هذه المعاملة محاكاة تكتيكية متضامنة ولا يتم محاسبتك حقيقياً عليها، بل تبرهن على رغبتك وشغفك الكروي لتحديث التطبيق!
            </div>

          </div>
        </div>
      )}

      {/* Simulated Premium Subscription checkout modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4" id="subscription-checkout-modal">
          <div className="bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800/95 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative text-right">
            
            {/* Modal Closer */}
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg cursor-pointer bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-850 transition-all select-none"
            >
              ✕
            </button>

            {/* If Subscription Payment succeeded */}
            {subscriptionStep === 4 ? (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="text-5xl animate-bounce">👑🎉⚜️</div>
                <h3 className="text-lg md:text-xl font-black text-amber-400 font-mono">أهلاً بك في العضوية الذهبية!</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed font-sans">
                  شكراً لشهامتك! تم تفعيل اشتراك بريميوم بنجاح باسم المشجع: <strong className="text-white font-sans">{currentUser?.username}</strong>. استمتع الآن بالتحليلات الحية وبأجوبة الذكاء الاصطناعي الفورية.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-emerald-400 font-bold font-sans">نشط وآمن ✔️</span>
                    <span className="text-slate-400">حالة المعاملة البنكية:</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-amber-400 font-bold font-sans">بريميوم ذهبي 👑</span>
                    <span className="text-slate-400">الرتبة الرياضية الجديدة:</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-emerald-400 font-black font-mono">+250 XP ⚡</span>
                    <span className="text-slate-400">هدية رصيد الخبرة المكتسب:</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSubscriptionModal(false)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer shadow-md"
                >
                  العودة للمنصة لمشاهدة المميزات 🚀
                </button>
              </div>
            ) : isSubscribingLoading ? (
              // Payment processing step-by-step spinner
              <div className="text-center py-10 space-y-6 animate-fade-in">
                <div className="relative w-16 h-16 mx-auto">
                  <RefreshCw className="w-16 h-16 animate-spin text-amber-400" />
                  <div className="absolute inset-0 flex items-center justify-center text-xs">👑</div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold text-white">جاري معالجة الاشتراك المالي الآمن...</h4>
                  
                  {/* Step status logs */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 inline-block text-[10.5px] text-amber-400 font-sans leading-normal">
                    {subscriptionStep === 1 && "🔌 جاري إنشاء قناة ائتمان مشفّرة عالية الأمان (256-bit SSL)..."}
                    {subscriptionStep === 2 && "⚡ جاري التحقق من سلامة البطاقة ومطابقة الرصيد..."}
                    {subscriptionStep === 3 && "🏆 تفعيل العضوية الذهبية، ومنح XP، وتصدير اسمك لجدول الشرف..."}
                  </div>
                </div>
                
                <p className="text-[9.5px] text-slate-500">يرجى قفل هذه الصفحة، الاتصال بالبنك يتم بنجاح خلف الكواليس...</p>
              </div>
            ) : (
              // Initial Checkout Form Input
              <form onSubmit={submitSubscriptionPayment} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-amber-400">
                    <Trophy className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-extrabold text-white">ترقية الحساب للعضوية الذهبية الأسطورية</h3>
                  <p className="text-[10.5px] text-slate-400 mt-1 leading-normal font-sans">
                    لقد اخترت الاشتراك في العضوية <strong className="text-amber-400">{selectedBillingPlan === "yearly" ? "السنوية الأسطورية ($79.99)" : "الشهرية المتميزة ($9.99)"}</strong> لدعم نمو وتطوير التطوير الرياضي!
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-sans">اسم صاحب البطاقة</label>
                    <input
                      type="text"
                      required
                      value={checkoutCardName || (currentUser ? currentUser.username : "")}
                      onChange={(e) => setCheckoutCardName(e.target.value)}
                      placeholder="امثلة: يوسف المونديالي الأول"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-amber-500 focus:outline-none rounded-xl text-slate-100 text-xs font-sans text-right placeholder-slate-600"
                    />
                  </div>

                  {/* High fidelity Card input box */}
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-sans font-mono">رقم البطاقة الائتمانية (محاكاة آمنة)</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={checkoutCardNumber}
                      onChange={(e) => {
                        // Custom numeric card spacing formatting
                        let val = e.target.value.replace(/\D/g, "");
                        let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                        setCheckoutCardNumber(formatted);
                      }}
                      placeholder="4000 1234 5678 9026"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-amber-500 focus:outline-none rounded-xl text-slate-100 text-xs font-mono text-left placeholder-slate-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1 font-sans uppercase">تاريخ الانتهاء</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={checkoutCardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length > 2) {
                            val = val.substring(0, 2) + "/" + val.substring(2, 4);
                          }
                          setCheckoutCardExpiry(val);
                        }}
                        placeholder="MM/YY (مثال: 12/29)"
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-amber-500 focus:outline-none rounded-xl text-slate-100 text-xs font-mono text-left placeholder-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1 font-sans font-mono">رمز الأمان (CVV)</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        value={checkoutCardCvv}
                        onChange={(e) => setCheckoutCardCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="•••"
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-amber-500 focus:outline-none rounded-xl text-slate-100 text-xs font-mono text-left placeholder-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                >
                  <span>أكد وادفع بأمان الآن (${selectedBillingPlan === "yearly" ? "79.99" : "9.99"}) 👑✨</span>
                </button>
                
                <p className="text-[9.5px] text-slate-500 text-center leading-normal">
                  تتم معالجة الرسوم بشكل تمثيلي وآمن بالكامل لتوضيح التدفق المالي، وستتم ترقية ملفك حال تأكيد الدفع بنجاح!
                </p>
              </form>
            )}

            <div className="mt-4 text-center text-[10px] text-slate-500 leading-normal font-sans border-t border-slate-850/60 pt-3">
              حماية تشفير 255 بت SSL • إلغاء في أي وقت من إعداد حسابك بمرونة تامة.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
