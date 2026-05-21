import { Team, Group, Stadium } from "../types";

export const TEAMS: Team[] = [
  // COCONCAF (Host and others)
  { id: "usa", name: "الولايات المتحدة", englishName: "USA", flag: "🇺🇸", continent: "CONCACAF", ranking: 16, keyPlayer: "كريستيان بوليستش", manager: "ماوريسيو بوتشيتينو", titles: 0 },
  { id: "mex", name: "المكسيك", englishName: "Mexico", flag: "🇲🇽", continent: "CONCACAF", ranking: 15, keyPlayer: "سانتياغو خيمينيز", manager: "خافيير أغيري", titles: 0 },
  { id: "can", name: "كندا", englishName: "Canada", flag: "🇨🇦", continent: "CONCACAF", ranking: 37, keyPlayer: "ألفونسو ديفيس", manager: "جيسي مارش", titles: 0 },
  { id: "crc", name: "كوستاريكا", englishName: "Costa Rica", flag: "🇨🇷", continent: "CONCACAF", ranking: 50, keyPlayer: "مانفريد أوغالدي", manager: "كلاوديو فيفاس", titles: 0 },
  { id: "pan", name: "بنما", englishName: "Panama", flag: "🇵🇦", continent: "CONCACAF", ranking: 39, keyPlayer: "أدالبيرتو كاراسكيا", manager: "توماس كريستيانسن", titles: 0 },
  { id: "jam", name: "جامايكا", englishName: "Jamaica", flag: "🇯🇲", continent: "CONCACAF", ranking: 53, keyPlayer: "ليون بيلي", manager: "ستيف مكلارين", titles: 0 },

  // CONMEBOL
  { id: "arg", name: "الأرجنتين", englishName: "Argentina", flag: "🇦🇷", continent: "CONMEBOL", ranking: 1, keyPlayer: "ليونيل ميسي", manager: "ليونيل سكالوني", titles: 3 },
  { id: "bra", name: "البرازيل", englishName: "Brazil", flag: "🇧🇷", continent: "CONMEBOL", ranking: 5, keyPlayer: "فينيسيوس جونيور", manager: "دوريفال جونيور", titles: 5 },
  { id: "col", name: "كولومبيا", englishName: "Colombia", flag: "🇨🇴", continent: "CONMEBOL", ranking: 10, keyPlayer: "لويس دياز", manager: "نستور لورينزو", titles: 0 },
  { id: "uru", name: "الأوروغواي", englishName: "Uruguay", flag: "🇺🇾", continent: "CONMEBOL", ranking: 11, keyPlayer: "داروين نونيز", manager: "مارسيلو بيلسا", titles: 2 },
  { id: "ecu", name: "الإكوادور", englishName: "Ecuador", flag: "🇪🇨", continent: "CONMEBOL", ranking: 27, keyPlayer: "مويسيس كايسيدو", manager: "سيباستيان بيكاسيسي", titles: 0 },
  { id: "ven", name: "فنزويلا", englishName: "Venezuela", flag: "🇻🇪", continent: "CONMEBOL", ranking: 44, keyPlayer: "سالومون روندون", manager: "فرناندو باتيستا", titles: 0 },

  // UEFA
  { id: "fra", name: "فرنسا", englishName: "France", flag: "🇫🇷", continent: "UEFA", ranking: 2, keyPlayer: "كيليان مبابي", manager: "ديدييه ديشان", titles: 2 },
  { id: "esp", name: "إسبانيا", englishName: "Spain", flag: "🇪🇸", continent: "UEFA", ranking: 3, keyPlayer: "لامين يامال", manager: "لويس دي لا فوينتي", titles: 1 },
  { id: "eng", name: "إنجلترا", englishName: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", continent: "UEFA", ranking: 4, keyPlayer: "جود بيلينجهام", manager: "توماس توخيل", titles: 1 },
  { id: "bel", name: "بلجيكا", englishName: "Belgium", flag: "🇧🇪", continent: "UEFA", ranking: 6, keyPlayer: "كيفين دي بروين", manager: "دومينيكو تيديسكو", titles: 0 },
  { id: "por", name: "البرتغال", englishName: "Portugal", flag: "🇵🇹", continent: "UEFA", ranking: 7, keyPlayer: "كريستيانو رونالدو", manager: "روبرتو مارتينيز", titles: 0 },
  { id: "ned", name: "هولندا", englishName: "Netherlands", flag: "🇳🇱", continent: "UEFA", ranking: 8, keyPlayer: "فيرجيل فان دايك", manager: "رونالد كومان", titles: 0 },
  { id: "ita", name: "إيطاليا", englishName: "Italy", flag: "🇮🇹", continent: "UEFA", ranking: 9, keyPlayer: "نيكولو باريلا", manager: "لوتشيانو سباليتي", titles: 4 },
  { id: "ger", name: "ألمانيا", englishName: "Germany", flag: "🇩🇪", continent: "UEFA", ranking: 12, keyPlayer: "جمال موسيالا", manager: "يوليان ناغلسمان", titles: 4 },
  { id: "cro", name: "كرواتيا", englishName: "Croatia", flag: "🇭🇷", continent: "UEFA", ranking: 13, keyPlayer: "لوكا مودريتش", manager: "زلاتكو داليتش", titles: 0 },
  { id: "sui", name: "سويسرا", englishName: "Switzerland", flag: "🇨🇭", continent: "UEFA", ranking: 15, keyPlayer: "غرانيت تشاكا", manager: "مراد ياكين", titles: 0 },
  { id: "den", name: "الدنمارك", englishName: "Denmark", flag: "🇩🇰", continent: "UEFA", ranking: 20, keyPlayer: "كريستيان إريكسن", manager: "بريان ريمر", titles: 0 },
  { id: "tur", name: "تركيا", englishName: "Turkey", flag: "🇹🇷", continent: "UEFA", ranking: 26, keyPlayer: "أردا غولر", manager: "فينشينسو مونتيلا", titles: 0 },
  { id: "ukr", name: "أوكرانيا", englishName: "Ukraine", flag: "🇺🇦", continent: "UEFA", ranking: 22, keyPlayer: "أرتيم دوفبيك", manager: "سيرهي ريبروف", titles: 0 },

  // CAF
  { id: "mar", name: "المغرب", englishName: "Morocco", flag: "🇲🇦", continent: "CAF", ranking: 14, keyPlayer: "أشرف حكيمي", manager: "وليد الركراكي", titles: 0 },
  { id: "sen", name: "السنغال", englishName: "Senegal", flag: "🇸🇳", continent: "CAF", ranking: 21, keyPlayer: "ساديو ماني", manager: "آليو سيسيه", titles: 0 },
  { id: "egy", name: "مصر", englishName: "Egypt", flag: "🇪🇬", continent: "CAF", ranking: 30, keyPlayer: "محمد صلاح", manager: "حسام حسن", titles: 0 },
  { id: "nga", name: "نيجيريا", englishName: "Nigeria", flag: "🇳🇬", continent: "CAF", ranking: 36, keyPlayer: "فيكتور أوسيمين", manager: "إيميكا إيزيوقو", titles: 0 },
  { id: "alg", name: "الجزائر", englishName: "Algeria", flag: "🇩🇿", continent: "CAF", ranking: 41, keyPlayer: "رياض محرز", manager: "فلاديمير بيتكوفيتش", titles: 0 },
  { id: "tun", name: "تونس", englishName: "Tunisia", flag: "🇹🇳", continent: "CAF", ranking: 47, keyPlayer: "عيسى العيدوني", manager: "فوزي البنزرتي", titles: 0 },
  { id: "cmr", name: "الكاميرون", englishName: "Cameroon", flag: "🇨🇲", continent: "CAF", ranking: 49, keyPlayer: "بريان مبيومو", manager: "مارك بريس", titles: 0 },
  { id: "civ", name: "ساحل العاج", englishName: "Ivory Coast", flag: "🇨🇮", continent: "CAF", ranking: 33, keyPlayer: "سيمون أدينغرا", manager: "إيميرس فاييه", titles: 0 },

  // AFC
  { id: "jpn", name: "اليابان", englishName: "Japan", flag: "🇯🇵", continent: "AFC", ranking: 17, keyPlayer: "تاكيفوسا كوبو", manager: "هاجيمي مورياسو", titles: 0 },
  { id: "irn", name: "إيران", englishName: "Iran", flag: "🇮🇷", continent: "AFC", ranking: 19, keyPlayer: "مهدي طارمي", manager: "أحمد قلعة نويي", titles: 0 },
  { id: "kor", name: "كوريا الجنوبية", englishName: "South Korea", flag: "🇰🇷", continent: "AFC", ranking: 23, keyPlayer: "سون هيونغ مين", manager: "هونغ ميونغ بو", titles: 0 },
  { id: "aus", name: "أستراليا", englishName: "Australia", flag: "🇦🇺", continent: "AFC", ranking: 24, keyPlayer: "أيدين هروستيتش", manager: "توني بوبوفيتش", titles: 1 }, // Note OFC history, currently AFC
  { id: "ksa", name: "السعودية", englishName: "Saudi Arabia", flag: "🇸🇦", continent: "AFC", ranking: 56, keyPlayer: "سالم الدوسري", manager: "هيرفي رينارد", titles: 0 },
  { id: "qat", name: "قطر", englishName: "Qatar", flag: "🇶🇦", continent: "AFC", ranking: 46, keyPlayer: "أكرم عفيف", manager: "ماركيز لوبيز", titles: 0 },
  { id: "irq", name: "العراق", englishName: "Iraq", flag: "🇮🇶", continent: "AFC", ranking: 55, keyPlayer: "أيمن حسين", manager: "خيسوس كاساس", titles: 0 },
  { id: "uzb", name: "أوزبكستان", englishName: "Uzbekistan", flag: "🇺🇿", continent: "AFC", ranking: 60, keyPlayer: "إلدور شومورودوف", manager: "سريتشكو كاتانيتش", titles: 0 },

  // OFC
  { id: "nzl", name: "نيوزيلندا", englishName: "New Zealand", flag: "🇳🇿", continent: "OFC", ranking: 91, keyPlayer: "كريس وود", manager: "دارين بازيلي", titles: 0 },

  // Rest of the 48 placeholder spots to complete groups
  { id: "rsa", name: "جنوب أفريقيا", englishName: "South Africa", flag: "🇿🇦", continent: "CAF", ranking: 59, keyPlayer: "بيرسي تاو", manager: "هوغو بروس", titles: 0 },
  { id: "wal", name: "ويلز", englishName: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", continent: "UEFA", ranking: 29, keyPlayer: "برينان جونسون", manager: "كريغ بيلامي", titles: 0 },
  { id: "swe", name: "السويد", englishName: "Sweden", flag: "🇸🇪", continent: "UEFA", ranking: 28, keyPlayer: "فيكتور غيوكيرس", manager: "يون دال توماسون", titles: 0 },
  { id: "pol", name: "بولندا", englishName: "Poland", flag: "🇵🇱", continent: "UEFA", ranking: 31, keyPlayer: "روبرت ليفاندوفسكي", manager: "ميشال بروبيرز", titles: 0 },
  { id: "nor", name: "النرويج", englishName: "Norway", flag: "🇳🇴", continent: "UEFA", ranking: 46, keyPlayer: "إيرلينغ هالاند", manager: "ستوله سولباكن", titles: 0 },
  { id: "clt", name: "تشيلي", englishName: "Chile", flag: "🇨🇱", continent: "CONMEBOL", ranking: 43, keyPlayer: "أليكسيس سانشيز", manager: "ريكاردو غاريكا", titles: 0 }
];

// Helper to construct Groups A to L (12 groups)
export const GROUPS: Group[] = Array.from({ length: 12 }, (_, i) => {
  const code = String.fromCharCode(65 + i); // A, B, C, ... L
  const startIndex = i * 4;
  const groupTeams = TEAMS.slice(startIndex, startIndex + 4);
  return {
    letter: code,
    teams: groupTeams
  };
});

// Storing the 16 hosting stadiums with beautiful translations and details
export const STADIUMS: Stadium[] = [
  // USA (11 Stadiums)
  {
    id: "metlife",
    name: "MetLife Stadium",
    arabicName: "ملعب ميتلايف",
    city: "New York/New Jersey",
    arabicCity: "نيويورك / نيوجيرسي",
    country: "USA",
    capacity: 82500,
    yearOpened: 2010,
    facts: "المستضيف الرسمي للمباراة النهائية الكبيرة لكأس العالم 2026 في 19 يوليو 2026. يقع على بعد كيلومترات قليلة من مدينة مانهاتن."
  },
  {
    id: "sof",
    name: "SoFi Stadium",
    arabicName: "ملعب سوفي",
    city: "Los Angeles",
    arabicCity: "لوس أنجلوس",
    country: "USA",
    capacity: 70240,
    yearOpened: 2020,
    facts: "أحد أكثر الملاعب حداثة في العالم بتكلفة بناء تجاوزت 5 مليارات دولار. مستضيف المباراة الافتتاحية للمنتخب الأمريكي."
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz Stadium",
    arabicName: "ملعب مرسيدس بنز",
    city: "Atlanta",
    arabicCity: "أتلانتا",
    country: "USA",
    capacity: 71000,
    yearOpened: 2017,
    facts: "متميز بسقفه القابل للطي بشكل فريد وشاشته الدائرية العملاقة الفريدة من نوعها."
  },
  {
    id: "att",
    name: "AT&T Stadium",
    arabicName: "ملعب إيه تي آند تي",
    city: "Dallas",
    arabicCity: "دالاس",
    country: "USA",
    capacity: 80000,
    yearOpened: 2009,
    facts: "يُعرف باسم 'قصر الجينات' بفضل شاشته المعلقة الضخمة التي كانت الأكبر عالمياً عند افتتاح الملعب."
  },
  {
    id: "hardrock",
    name: "Hard Rock Stadium",
    arabicName: "ملعب هارد روك",
    city: "Miami",
    arabicCity: "ميامي",
    country: "USA",
    capacity: 64767,
    yearOpened: 1987,
    facts: "استضاف العديد من بطولات السوبر بول ومنافسات الفورمولا 1 ومباريات كوبا أمريكا التاريخية."
  },
  {
    id: "nrg",
    name: "NRG Stadium",
    arabicName: "ملعب إن آر جي",
    city: "Houston",
    arabicCity: "هيوستن",
    country: "USA",
    capacity: 72220,
    yearOpened: 2002,
    facts: "هو الأول في تاريخ دوري كرة القدم الأمريكية (NFL) الذي تم تزويده بسقف قابل للسحب بالكامل."
  },
  {
    id: "arrowhead",
    name: "GEHA Field at Arrowhead Stadium",
    arabicName: "ملعب أروهيد",
    city: "Kansas City",
    arabicCity: "كانساس سيتي",
    country: "USA",
    capacity: 76416,
    yearOpened: 1972,
    facts: "سجل الرقم القياسي العالمي في موسوعة غينيس لأعلى مستوى ضوضاء جماهيرية مسجلة في ملعب رياضي خارجي."
  },
  {
    id: "gillette",
    name: "Gillette Stadium",
    arabicName: "ملعب جيليت",
    city: "Boston",
    arabicCity: "بوسطن",
    country: "USA",
    capacity: 65878,
    yearOpened: 2002,
    facts: "المعقل التاريخي لفريق نيو إنغلاند باتريوتس، ويتميز بمنارته الجديدة وجسر الجماهير الأيقوني."
  },
  {
    id: "lincoln",
    name: "Lincoln Financial Field",
    arabicName: "ملعب لينكون فاينانشال فيلد",
    city: "Philadelphia",
    arabicCity: "فيلادلفيا",
    country: "USA",
    capacity: 69796,
    yearOpened: 2003,
    facts: "صُمم ليكون صديقاً للبيئة بنسبة 100%، حيث يولد طاقته بالكامل عبر الألواح الشمسية وتوربينات الرياح المبنية داخله."
  },
  {
    id: "lumen",
    name: "Lumen Field",
    arabicName: "ملعب لومن فيلد",
    city: "Seattle",
    arabicCity: "سياتل",
    country: "USA",
    capacity: 69000,
    yearOpened: 2002,
    facts: "يتميز بهندسته المعمارية الفريدة على شكل هلالين وتأثير الجماهير المرعب الملقب بـ 'الرجل الثاني عشر'."
  },
  {
    id: "levis",
    name: "Levi's Stadium",
    arabicName: "ملعب ليفايز",
    city: "San Francisco",
    arabicCity: "سان فرانسيسكو / سان خوسيه",
    country: "USA",
    capacity: 68500,
    yearOpened: 2014,
    facts: "يقع في قلب وادي السيليكون، وهو واحد من أكثر الملاعب ذكاءً واعتماداً على التكنولوجيا الخضراء والإنترنت فائق السرعة."
  },

  // Mexico (3 Stadiums)
  {
    id: "azteca",
    name: "Estadio Azteca",
    arabicName: "ملعب أزتيكا الأسطوري",
    city: "Mexico City",
    arabicCity: "مكسيكو سيتي",
    country: "Mexico",
    capacity: 87523,
    yearOpened: 1966,
    facts: "الملعب الوحيد في التاريخ الذي يستضيف افتتاح كأس العالم في 3 نسخ مختلفة (1970، 1986، 2026). شهد 'هدف القرن' لمارادونا."
  },
  {
    id: "bbva",
    name: "Estadio BBVA",
    arabicName: "ملعب بي بي في إيه (العملاق الفولاذي)",
    city: "Monterrey",
    arabicCity: "مونتيري",
    country: "Mexico",
    capacity: 53500,
    yearOpened: 2015,
    facts: "يُلقب بـ 'العملاق الفولاذي' ويتميز بإطلالته الجبلية الساحرة على جبل 'سيرو دي لا سيلا' كلوحة طبيعية خلف المدرجات."
  },
  {
    id: "akron",
    name: "Estadio Akron",
    arabicName: "ملعب أكرون",
    city: "Guadalajara",
    arabicCity: "غوادالاخارا",
    country: "Mexico",
    capacity: 48070,
    yearOpened: 2010,
    facts: "يُحاكي تصميمه الخارجي شكلاً بركانياً يندمج كلياً مع المشهد الطبيعي المحيط به."
  },

  // Canada (2 Stadiums)
  {
    id: "bcplace",
    name: "BC Place",
    arabicName: "ملعب بي سي بليس",
    city: "Vancouver",
    arabicCity: "فانكوفر",
    country: "Canada",
    capacity: 54500,
    yearOpened: 1983,
    facts: "شهد تجديدات واسعة النطاق لتركيب سقف مدعوم بالكابلات الفولاذية هو الأكبر من نوعه في العالم."
  },
  {
    id: "bmo",
    name: "BMO Field",
    arabicName: "ملعب بي إم أو",
    city: "Toronto",
    arabicCity: "تورونتو",
    country: "Canada",
    capacity: 45736,
    yearOpened: 2007,
    facts: "المعقل الرئيسي لمنتخب كندا. تتم زيادة سعته الاستيعابية لاستيعاب أجواء حماس المونديال الحاشدة."
  }
];

export const FUN_FACTS = [
  "هي أول نسخة في تاريخ البطولة تضم 48 منتخباً بدلاً من 32 منتخباً.",
  "ستقام المنافسات عبر 3 دول قارية مجتمعة (الولايات المتحدة، المكسيك، كندا) لأول مرة في التاريخ.",
  "سيشهد المونديال زيادة عدد المباريات إلى 104 مباراة على مدار 39 يوماً تفاعلياً شيقاً ممتداً.",
  "يتأهل أول وثاني كل مجموعة من المجموعات الـ 12، بالإضافة إلى أفضل 8 منتخبات تحتل المركز الثالث لدور الـ 32 لتبدأ الأدوار الإقصائية المباشرة الصعبة.",
  "يعد ملعب أزتيكا الأسطوري في المكسيك أول ملعب يستضيف مباريات كأس العالم في ثلاث نسخ مختلفة (1970، 1986، 2026).",
  "ملعب ميتلايف في نيويورك/نيوجيرسي هو المسرح المعلن رسمياً لاستضافة النهائي والاحتفال بتتويج البطل الجديد."
];
