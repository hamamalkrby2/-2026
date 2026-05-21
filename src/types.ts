export interface Team {
  id: string;
  name: string;
  englishName: string;
  flag: string;
  continent: "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC" | "OFC";
  ranking: number;
  keyPlayer: string;
  manager: string;
  titles: number;
}

export interface Group {
  letter: string;
  teams: Team[];
}

export interface Stadium {
  id: string;
  name: string;
  arabicName: string;
  city: string;
  arabicCity: string;
  country: "USA" | "Canada" | "Mexico";
  capacity: number;
  yearOpened: number;
  facts: string;
}

export interface MatchEvent {
  minute: number;
  desc: string;
  type: "goal" | "card" | "substitution" | "highlight";
}

export interface SimulationStats {
  possession: { teamA: number; teamB: number };
  shots: { teamA: number; teamB: number };
  foulCount: { teamA: number; teamB: number };
  corners: { teamA: number; teamB: number };
}

export interface SimulationResult {
  winner: string;
  score: string;
  scorers: string[];
  events: MatchEvent[];
  stats: SimulationStats;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface UserProfile {
  username: string;
  email: string;
  favoriteTeamId: string;
  favoriteTeamName: string;
  avatar: string;
  xp: number;
  badge: "مبتدئ المونديال" | "متابع متمرس" | "محلل ذهبي" | "مستشار المونديال الأسطوري";
  isPremium: boolean;
  joinedAt: string;
}

export interface SupportFeatureProposal {
  id: string;
  title: string;
  description: string;
  category: "مستشار ذكاء اصطناعي" | "تحليلات وإحصاء" | "تصميم وتفاعل" | "مسابقات وتحديات";
  votes: number;
  votedBy: string[]; // list of usernames
  status: "تم التخطيط" | "قيد التطوير" | "مكتملة ومتاحة";
  submittedBy: string;
}

export interface SupportPledge {
  id: string;
  username: string;
  amount: number;
  category: "☕ رعاية قهوة" | "🥉 باقة برونزية" | "🥈 باقة فضية" | "🥇 باقة كابتن ذهبية";
  message: string;
  timestamp: string;
}

