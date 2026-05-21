import { useState } from "react";
import { STADIUMS } from "../data/worldCupData";
import { Stadium } from "../types";
import { MapPin, Users, Calendar, Info, Globe } from "lucide-react";

export default function StadiumsGuide() {
  const [selectedCountry, setSelectedCountry] = useState<"ALL" | "USA" | "Canada" | "Mexico">("ALL");

  const filteredStadiums = STADIUMS.filter((stadium) => {
    return selectedCountry === "ALL" || stadium.country === selectedCountry;
  });

  const getCountryFlagAndName = (country: "USA" | "Canada" | "Mexico") => {
    switch (country) {
      case "USA":
        return { name: "الولايات المتحدة", flag: "🇺🇸" };
      case "Canada":
        return { name: "كندا", flag: "🇨🇦" };
      case "Mexico":
        return { name: "المكسيك", flag: "🇲🇽" };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="stadiums-section">
      {/* Intro section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-right shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">دليل الملاعب الـ 16 المستضيفة للكأس</h2>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          تقام مباريات المونديال الأكبر تاريخياً في 16 مدينة مضيفة تتوزع عبر أمريكا الشمالية. المكسيك تقدم ملاعب تاريخية ومملوءة بالحماس الكروي، والولايات المتحدة تضيف صروحاً معمارية فائقة التقنية والحداثة، في حين تُرحب كندا بالمشجعين في ملاعبها المتميزة.
        </p>
      </div>

      {/* Country Filters Tab */}
      <div className="flex justify-end gap-3 border-b border-slate-900 pb-4">
        <button
          onClick={() => setSelectedCountry("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none cursor-pointer ${
            selectedCountry === "ALL"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/10"
              : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-900"
          }`}
        >
          <span>كل الملاعب ({STADIUMS.length})</span>
          <Globe className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setSelectedCountry("USA")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none cursor-pointer ${
            selectedCountry === "USA"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/10"
              : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-900"
          }`}
        >
          <span>الولايات المتحدة 🇺🇸</span>
        </button>

        <button
          onClick={() => setSelectedCountry("Mexico")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none cursor-pointer ${
            selectedCountry === "Mexico"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/10"
              : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-900"
          }`}
        >
          <span>المكسيك 🇲🇽</span>
        </button>

        <button
          onClick={() => setSelectedCountry("Canada")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none cursor-pointer ${
            selectedCountry === "Canada"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/10"
              : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-900"
          }`}
        >
          <span>كندا 🇨🇦</span>
        </button>
      </div>

      {/* Stadium Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStadiums.map((stadium) => {
          const countryInfo = getCountryFlagAndName(stadium.country);
          const isFinalStadium = stadium.id === "metlife";
          const isOpeningStadium = stadium.id === "azteca";

          return (
            <div
              key={stadium.id}
              className={`bg-slate-950/80 border rounded-2xl p-6 text-right flex flex-col justify-between transition-all hover:shadow-2xl hover:border-slate-700 relative overflow-hidden group ${
                isFinalStadium
                  ? "border-amber-500/40 ring-1 ring-amber-500/25"
                  : isOpeningStadium
                  ? "border-emerald-500/40 ring-1 ring-emerald-500/25"
                  : "border-slate-900"
              }`}
              id={`stadium-card-${stadium.id}`}
            >
              {/* Highlight Badges */}
              {isFinalStadium && (
                <div className="absolute top-3 left-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
                  🏟️ ملعب النهائي الكروي
                </div>
              )}
              {isOpeningStadium && (
                <div className="absolute top-3 left-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
                  🔥 ملعب الافتتاح التاريخي
                </div>
              )}

              <div>
                {/* Stadium title and locations */}
                <div className="mb-4">
                  <div className="flex items-center justify-end gap-1.5 text-slate-500 text-xs mb-1 font-mono">
                    <span>{stadium.name}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight mb-2">
                    {stadium.arabicName}
                  </h3>
                  <div className="flex items-center justify-end gap-1.5 text-slate-400 text-xs">
                    <span>{stadium.arabicCity} ، {countryInfo?.name}</span>
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                  </div>
                </div>

                {/* Facts / Short description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 bg-slate-900/45 p-3 rounded-xl border border-slate-900/60 font-sans">
                  {stadium.facts}
                </p>
              </div>

              {/* Capacities and year specs */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-4 mt-auto">
                <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-900 text-center">
                  <div className="flex justify-center items-center gap-1 text-[11px] text-slate-500 mb-0.5">
                    <span>السعة الجماهيرية</span>
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-base text-slate-200 font-mono">
                    {stadium.capacity.toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-900 text-center">
                  <div className="flex justify-center items-center gap-1 text-[11px] text-slate-500 mb-0.5">
                    <span>سنة التأسيس</span>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-base text-slate-200 font-mono">
                    {stadium.yearOpened}م
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
