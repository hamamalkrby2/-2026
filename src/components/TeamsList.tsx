import { useState, useMemo } from "react";
import { TEAMS } from "../data/worldCupData";
import { Team } from "../types";
import { Search, Globe, Award, Star, User } from "lucide-react";

const CONTINENT_LABELS: Record<string, string> = {
  ALL: "جميع المنتخبات",
  UEFA: "أوروبا (UEFA)",
  CONMEBOL: "أمريكا الجنوبية (CONMEBOL)",
  CONCACAF: "أمريكا الشمالية (CONCACAF)",
  CAF: "أفريقيا (CAF)",
  AFC: "آسيا (AFC)",
  OFC: "أوقيانوسيا (OFC)"
};

export default function TeamsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>("ALL");

  const filteredTeams = useMemo(() => {
    return TEAMS.filter((team) => {
      const matchesSearch =
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.keyPlayer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesContinent =
        selectedContinent === "ALL" || team.continent === selectedContinent;

      return matchesSearch && matchesContinent;
    }).sort((a, b) => a.ranking - b.ranking); // Sort by FIFA ranking
  }, [searchTerm, selectedContinent]);

  return (
    <div className="space-y-8 animate-fade-in" id="teams-explorer-section">
      {/* Intro info header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-right shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">مستكشف المنتخبات والنجوم المشاركين</h2>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          تصفح قائمة الدول الثمانية والأربعين المشاركة في كأس العالم 2026، واكتشف أبرز اللاعبين المفاتيح لكل بلد، والمدربين الذين يقودون أحلامهم، ومستوياتهم الحالية وفق تصنيف الفيفا العالمي وتاريخ تتويجهم باللقب الذهبي الغالي.
        </p>
      </div>

      {/* Filters and search box */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-900">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="بحث عن منتخب، لاعب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500 text-sm text-right"
          />
          <Search className="absolute right-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          {Object.entries(CONTINENT_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedContinent(key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold select-none transition-all cursor-pointer ${
                selectedContinent === key
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid count stats */}
      <div className="text-right text-xs text-slate-500 font-mono">
        تم العثور على {filteredTeams.length} منتخبات مشاركة من مختلف القارات
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all shadow-md text-right flex flex-col justify-between hover:-translate-y-1 duration-200"
            id={`team-explorer-card-${team.id}`}
          >
            {/* Header: Flag, Continent and Titles */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-mono uppercase bg-slate-900 text-slate-400 px-2 py-0.5 rounded-lg">
                  {team.continent}
                </span>
                {team.titles > 0 && (
                  <div className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/15 px-2 py-0.5 rounded-lg">
                    <span>{team.titles} {team.titles > 10 ? "ألقاب" : "بطولات"}</span>
                    <Award className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{team.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">تصنيف الفيفا: #{team.ranking}</span>
                </div>
                <span className="text-3xl select-none" role="img" aria-label={team.name}>
                  {team.flag}
                </span>
              </div>
            </div>

            {/* Core player info and manager */}
            <div className="space-y-2.5 pt-3 border-t border-slate-900 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium font-sans">{team.keyPlayer}</span>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <span>اللاعب الأبرز</span>
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-sans">{team.manager}</span>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <span>المدير الفني</span>
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredTeams.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500">
            لا توجد نتائج مطابقة لمصطلح البحث. حاول البحث عن بلد آخر.
          </div>
        )}
      </div>
    </div>
  );
}
