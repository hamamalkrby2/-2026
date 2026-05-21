import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle, HelpCircle, Trophy } from "lucide-react";

const SUGGESTIONS = [
  "ما هو السجل التاريخي للبطل القياسي البرازيل؟ 🇧🇷",
  "حدثني عن قصة وتفاصيل 'معجزة بيرن' التاريخية لمونديال 1954؟ 🇩🇪",
  "من هو الهداف التاريخي لكأس العالم وما هي قصته؟ ⚽",
  "كيف تطور عدد المنتخبات المشاركة من 13 منتخباً في 1930 إلى 48 منتخباً في 2026؟ 🌎",
  "أين ستقام المباراة النهائية لكأس العالم 2026 وما هي الطاقة الاستيعابية للملعب؟ 🗽"
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "intro",
        sender: "bot",
        text: "مرحباً بك! أنا «خبير المونديال الأسطوري» الذكي. يسعدني جداً الإجابة التفصيلية والتحليلية عن كل ما يتعلق بكأس العالم منذ انطلاقتها الأولى في الأوروغواي عام 1930، مروراً بالنسخ التاريخية والنجوم الخالدين والأرقام القياسية الأسطورية، ووصولاً لنسخة 2026 الاستثنائية بـ 48 منتخباً وقواعد التأهل الجديدة. اسألني أي سؤال كروي يخطر ببالك!",
        timestamp: new Date().toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/worldcup/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages.slice(-10) // Keep the dialogue optimized
        })
      });

      if (!response.ok) {
        throw new Error("فشل الاتصال بخوادم خبير المونديال الذكي. يرجى إعادة المحاولة.");
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "bot",
        text: data.reply || "عذرًا صديقي، لم أستطع صياغة إجابة كروية دقيقة لهذه المعلومة المونديالية.",
        timestamp: new Date().toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "حدث خطأ غير متوقع في جلب معلومات الذكاء الاصطناعي.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "intro",
        sender: "bot",
        text: "تم تصفير ذاكرة اللقاءات وإعادة تشغيل المحادثة بنجاح! جاهز تماماً للإجابة عن أسئلتك التاريخية والرياضية ومحاكاة النهائي الأهم في حياتنا. تفضل بسؤالي!",
        timestamp: new Date().toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right animate-fade-in" id="ai-assistant-section">
      
      {/* Dynamic Suggestions & Sidebar info with Amber/Teal Palette */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-900/90 rounded-3xl p-6 shadow-xl relative overflow-hidden" id="expert-tips-card">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center justify-end gap-2 text-amber-400 mb-3">
            <span className="font-bold text-xs uppercase tracking-wider">مستشار المونديال المعتمد ⚽</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          
          <h3 className="text-base font-black text-white mb-2">استشر خبير التاريخ الرياضي</h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-5 font-sans">
            قمت بإعداد مجموعة من الأسئلة التاريخية الشائعة التي تجسّد عظمة المونديال منذ عام 1930 وإلى اليوم. اضغط على أي بطاقة لتوجيه سؤال مباشر أو اكتب استفسارك الخاص!
          </p>

          <div className="space-y-3">
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(sug)}
                disabled={isLoading}
                className="w-full text-right bg-slate-950 select-none hover:bg-amber-500/10 text-slate-300 hover:text-amber-300 p-3 rounded-2xl text-[11px] border border-slate-900 hover:border-amber-500/20 transition-all font-sans cursor-pointer block leading-normal line-clamp-2"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button: Reset chat */}
        <button
          onClick={clearChat}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-2xl text-xs font-bold border border-slate-800/80 transition-all cursor-pointer flex items-center justify-center gap-2 shadow"
        >
          <span>إعادة تصفير محادثة خبير المونديال</span>
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Main Dialogue Timeline Block */}
      <div className="lg:col-span-2 flex flex-col bg-slate-950/70 border border-slate-900 rounded-3xl overflow-hidden h-[560px] shadow-2xl">
        
        {/* Chat Window Custom Header */}
        <div className="bg-gradient-to-l from-slate-900/90 to-slate-950 border-b border-slate-900 px-6 py-4.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">متصل الآن بالشبكة الذكية</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h3 className="font-extrabold text-white text-sm">خبير المونديال التاريخي</h3>
              <span className="text-[10px] text-slate-400 block font-sans">محلل كروي ومؤرخ لتفاصيل الكأس الذهبية</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Dynamic Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-trigger">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                className={`flex gap-4 items-start ${isBot ? "" : "flex-row-reverse text-left"}`}
                id={`chat-msg-${msg.id}`}
              >
                {/* Custom Avatar Icon depending on sender */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm ${
                    isBot
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      : "bg-teal-500/10 border-teal-500/20 text-teal-400"
                  }`}
                >
                  {isBot ? <Sparkles className="w-4 h-4 text-amber-400" /> : <User className="w-4.5 h-4.5 text-teal-400" />}
                </div>

                {/* Speech Bubble Container */}
                <div className="space-y-1 max-w-[82%]">
                  <div
                    className={`px-4.5 py-3.5 rounded-2xl text-xs leading-relaxed font-sans inline-block text-right break-words shadow-sm ${
                      isBot
                        ? "bg-slate-900/90 text-slate-100 border border-slate-800"
                        : "bg-teal-600 text-white rounded-tr-none shadow shadow-teal-500/10"
                    }`}
                  >
                    {msg.text.split("\n").map((line, k) => (
                      <span key={k} className="block mt-1 font-sans">
                        {line}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-500 block font-mono pr-1 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing/Generating state feedback */}
          {isLoading && (
            <div className="flex gap-4 items-start" id="chat-loading-state">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 text-slate-400 px-4.5 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow font-sans">
                <span>يقوم خبير المونديال بتحليل السجلات الأرشيفية وتوليد الإجابة...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-300"></span>
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-center gap-2 max-w-lg mx-auto" id="chat-error-state">
              <AlertCircle className="w-4.5 h-4.5 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-4 bg-slate-900/60 border-t border-slate-900/90 flex gap-3.5"
          id="chat-input-form"
        >
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-850 text-slate-950 font-bold rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-4 h-4 -rotate-90 transform" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="اسأل خبير المونديال عن أحداث 1930، بيليه، هدف مارادونا، أو ملاعب 2026..."
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl focus:border-amber-500/60 focus:outline-none text-slate-100 placeholder-slate-500 text-sm text-right font-sans"
            id="chat-input-field"
          />
        </form>
      </div>

    </div>
  );
}
