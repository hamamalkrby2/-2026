import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// Initialize Stripe Client Lazy initialization
let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-01-27.acacia" as any,
    });
  }
  return stripeClient;
}

// Initialize Gemini client (Lazy initialization safe-guard)
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. AI Assistant & Match Simulator will run in offline simulation mode.");
    }
    ai = new GoogleGenAI({
      apiKey: key || "DUMMY_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Stripe Integration configuration endpoint
app.get("/api/stripe/config", (req, res) => {
  const stripeActive = !!process.env.STRIPE_SECRET_KEY;
  res.json({
    stripeActive: stripeActive,
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || null
  });
});

// Secure Stripe Checkout Session creator
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  const { planId, amount, username, customMessage } = req.body;

  try {
    const stripe = getStripeClient();
    if (!stripe) {
      // Returning clean simulation signal if user hasn't added STRIPE_SECRET_KEY in AI Studio Settings yet
      res.json({
        simulation: true,
        message: "تم تفعيل وضع محاكاة بوابة الدفع (المطور) بنجاح لعدم توفر مفتاح Stripe بالخادم بعد."
      });
      return;
    }

    let lineItemName = "العضوية الذهبية الأسطورية كاس العالم (شهرية) 👑";
    let finalAmount = 9.99;

    if (planId === "yearly") {
      lineItemName = "العضوية الذهبية الأسطورية كاس العالم (سنوية) 🏆";
      finalAmount = 79.99;
    } else if (planId === "pledge") {
      lineItemName = "رعاية ودعم تطوير منصة مونديال ٢٠٢٦ 💖";
      finalAmount = Math.max(1.0, parseFloat(amount || "10.0"));
    }

    const appUrl = process.env.APP_URL || `http://localhost:3000`;

    // Create checkout session with Stripe SDK
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: lineItemName,
              description: `دعم مباشر وتفعيل الميزات الفاخرة للمشجع: ${username || "عضو فخري"}`,
            },
            unit_amount: Math.round(finalAmount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        username: username || "anonymous",
        planId: planId || "pledge",
        finalAmount: finalAmount.toString(),
        customMessage: customMessage || ""
      },
      success_url: `${appUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}&planId=${planId || "pledge"}&amount=${finalAmount}&username=${encodeURIComponent(username || "")}&msg=${encodeURIComponent(customMessage || "")}`,
      cancel_url: `${appUrl}/?payment=cancel`
    });

    res.json({ id: session.id, url: session.url, simulation: false });
  } catch (error: any) {
    console.error("Stripe Checkout Create Error:", error);
    res.status(500).json({ error: error.message || "حدث خطأ أثناء الاتصال ببوابة Stripe." });
  }
});

// AI Assistant for World Cup 2026
app.post("/api/worldcup/chat", async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    res.status(400).json({ error: "Missing message parameter" });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Offline fallback simulator to avoid breaking the application
      res.json({
        reply: `[وضع المحاكاة المحلي] أهلاً بك! لقد سألت عن: "${message}". لم يتم توفير مفتاح GEMINI_API_KEY في الإعدادات بعد، ولكن إليك معلومة سريعة عن مونديال 2026: ستقام هذه البطولة التاريخية بمشاركة 48 منتخباً لأول مرة في التاريخ، وستستضيفها 3 دول هي الولايات المتحدة والمكسيك وكندا، بـ 16 مدينة مضيفة ونظام من 12 مجموعة تضم كل منها 4 منتخبات.`
      });
      return;
    }

    const client = getGeminiClient();
    
    // Format history for Gemini chat if provided
    const contents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const turn of chatHistory) {
        contents.push({
          role: turn.sender === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const systemInstruction = `أنت "خبير المونديال الأسطوري"، مؤرخ ومحلل رياضي دولي متخصص وودود للغاية في شؤون بطولة كأس العالم لكرة القدم منذ انطلاقتها الأولى عام 1930 وإلى نسخة 2026 التي ستقام في الولايات المتحدة وكندا والمكسيك.
هذه النسخة القادمة تاريخية لأنها المرة الأولى التي يشارك فيها 48 منتخباً وتلعب فيها 104 مباريات.
تحدث دائماً باللغة العربية بأسلوب راقٍ، بليغ وشائق مليء بالمتعة الكروية والحقائق الرياضية التوثيقية الدقيقة. يمكنك استخدام الرموز التعبيرية بحكمة لنثر الحماس الكروي.
تأكد من إجابة أسئلة المستخدمين بدقة عن تاريخ المونديالات الـ 22 السابقة (أبطال السنوات السابقة، الأرقام القياسية مثل ألقاب البرازيل الخمسة، رونالدو الظاهرة، وأرقام بيليه وكلوزه ومارادونا وميسي، والهدافين)، ونظام البطولة لـ 2026 (12 مجموعة من 4 فرق، يتأهل أول وثاني كل مجموعة، مع أفضل 8 منتخبات تحتل المركز الثالث إلى دور الـ 32)، والملاعب الـ 16 (مثل ميتلايف وأزتيكا)، والمنتخبات المشاركة من مختلف القارات.
إذا طلب المستخدم التنبؤ أو المقارنة، فافعل ذلك بتحليل رياضي ممتع وعادل ومحايد يبرز مواطن القوة الفنية وعراقة المنتخبات تاريخياً.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1200,
      }
    });

    res.json({ reply: response.text || "عذرًا، لم أتمكن من معالجة هذا الرد بشكل صحيح." });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "حدث خطأ أثناء الاتصال بمساعد الذكاء الاصطناعي." });
  }
});

// Dynamic Match Simulator (creates structured high-fidelity statistics and events)
app.post("/api/worldcup/simulate", async (req, res) => {
  const { teamA, teamB, stadium } = req.body;

  if (!teamA || !teamB) {
    res.status(400).json({ error: "Missing teamA or teamB parameters" });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Offline fallback simulator to create beautiful results in JSON
      const minutes = [8, 14, 27, 41, 55, 68, 79, 87, 90];
      const selectedMinutes = minutes.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3));
      selectedMinutes.sort((a, b) => a - b);
      
      let goalsA = 0;
      let goalsB = 0;
      const scorers: string[] = [];
      const events: { minute: number; desc: string; type: "goal" | "card" | "substitution" | "highlight" }[] = [];

      selectedMinutes.forEach((min) => {
        const isGoal = Math.random() > 0.4;
        const activeTeam = Math.random() > 0.5 ? teamA : teamB;
        if (isGoal) {
          if (activeTeam === teamA) {
            goalsA++;
          } else {
            goalsB++;
          }
          const scorer = activeTeam === teamA ? 
            `${teamA === "السعودية" ? "سالم الدوسري" : "مهاجم " + teamA}` : 
            `${teamB === "المغرب" ? "حكيم زياش" : "مهاجم " + teamB}`;
          scorers.push(`${scorer} (${min}')`);
          events.push({
            minute: min,
            desc: `⚽ هدف رائع وصاعق لصالح ${activeTeam}! سدده اللاعب ${scorer} بعد تمريرة حاسمة متقنة خطفت الأنفاس.`,
            type: "goal"
          });
        } else {
          const rand = Math.random();
          if (rand < 0.4) {
            events.push({
              minute: min,
              desc: `🟨 بطاقة صفراء للاعب من ${activeTeam} نتيجة تدخل خشن لوقف هجمة مرتدة سريعة للمنافس.`,
              type: "card"
            });
          } else if (rand < 0.7) {
            events.push({
              minute: min,
              desc: `🔄 تبديل تكتيكي في صفوف ${activeTeam} بهدف تعزيز خط الوسط والضغط الهجومي المضاد.`,
              type: "substitution"
            });
          } else {
            events.push({
              minute: min,
              desc: `🔥 هجمة خطيرة جداً! حارس مرمى ${activeTeam === teamA ? teamB : teamA} يتألق ويبعد تسديدة صاروخية حاسمة عن المرمى في آخر لحظة.`,
              type: "highlight"
            });
          }
        }
      });

      // Ensure at least someone wins or match is draw
      const finalScore = `${goalsA} - ${goalsB}`;

      res.json({
        winner: goalsA > goalsB ? teamA : goalsB > goalsA ? teamB : "تعادل",
        score: finalScore,
        scorers: scorers,
        events: [
          { minute: 1, desc: `🏁 إنطلاق صافرة الحكم لبداية هذه المواجهة الملحمية والمترقبة بين منتخبي ${teamA} و ${teamB} في ${stadium || "ملعب ميتلايف بنيوجيرسي"} وسط حضور جماهيري مهيب!`, type: "highlight" },
          ...events,
          { minute: 90, desc: `🏁 صافرة النهاية تعلن نهاية هذه المباراة المثيرة المشوقة بنتيجة ${goalsA} مقابل ${goalsB}. أداء رائع وروح رياضية عالية!`, type: "highlight" }
        ],
        stats: {
          possession: { teamA: 40 + Math.floor(Math.random() * 20), teamB: 0 }, // calculated in client later
          shots: { teamA: 5 + Math.floor(Math.random() * 12), teamB: 5 + Math.floor(Math.random() * 12) },
          foulCount: { teamA: 8 + Math.floor(Math.random() * 8), teamB: 8 + Math.floor(Math.random() * 8) },
          corners: { teamA: 2 + Math.floor(Math.random() * 8), teamB: 2 + Math.floor(Math.random() * 8) }
        }
      });
      return;
    }

    const client = getGeminiClient();
    const prompt = `أنت محرّك محاكاة رياضي متميز مخصص لكأس العالم 2026.
قم بمحاكاة مباراة كرة قدم مثيرة وكاملة في نهائيات كأس العالم 2026 بين:
الفريق الأول (Team A): ${teamA}
الفريق الثاني (Team B): ${teamB}
الملعب المستضيف (Stadium): ${stadium || "ملعب ميتلايف بنيوجيرسي (المستضيف للنهائي)"}

يجب أن تقوم بإنشاء تفاصيل المباراة كاملة بصيغة JSON حقيقية وصالحة تماماً، تلتزم باللغة العربية في الوصف النصوص.
قم بإرجاع كائن JSON له البنية الدقيقة التالية (ولا ترجع أي نصوص أخرى خارج الـ JSON):
{
  "winner": "اسم الفريق الفائز أو كلمة 'تعادل'",
  "score": "A - B (مثال: '2 - 1' أو '0 - 0' أو '3 - 3')",
  "scorers": ["قائمة بأسماء مسجلي الأهداف مع الدقيقة، مثال: اسم اللاعب (12')"],
  "events": [
    {
      "minute": 1,
      "desc": "وصف مفصل مشوق جداً بلهجة رياضية لصافرة البداية والتكتيك",
      "type": "highlight"
    },
    ... قائمة الأحداث مرتبة تصاعدياً من الدقيقة 1 إلى الدقيقة 90 (بحوالي 5 إلى 9 أحداث بارزة تشتمل على الأهداف والبطاقات والتبديلات والهجمات الخطيرة)
  ],
  "stats": {
    "possession": {
      "teamA": نسبة الاستحواذ للفريق أ كعدد صحيح بين 25 و 75,
      "teamB": نسبة الاستحواذ للفريق ب كعدد صحيح مكمل لـ 100
    },
    "shots": {
      "teamA": عدد التسديدات للفريق أ,
      "teamB": عدد التسديدات للفريق ب
    },
    "foulCount": {
      "teamA": الأخطاء للفريق أ,
      "teamB": الأخطاء للفريق ب
    },
    "corners": {
      "teamA": الركنيات للفريق أ,
      "teamB": الركنيات للفريق ب
    }
  }
}

تأكد من جعل المباراة مطابقة لطبيعة المنتخبين تاريخياً ورياضياً ونقاط قوتهم بنكهة مشوقة.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [prompt],
      config: {
        responseMimeType: "application/json",
        temperature: 0.85,
      }
    });

    const outputText = response.text || "{}";
    // Parse to verify it is valid JSON
    const parsedData = JSON.parse(outputText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Simulation Error:", error);
    res.status(500).json({ error: error.message || "حدث خطأ أثناء محاكاة المباراة." });
  }
});

// -------------------------------------------------------------
// VITE AND STATIC FILES SERVING (COMPLIANT IMPLEMENTATION)
// -------------------------------------------------------------

async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production build static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚽ World Cup 2026 App server listening on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
