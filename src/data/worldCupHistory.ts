export interface WorldCupEdition {
  year: number;
  host: string;
  winner: string;
  winnerFlag: string;
  runnerUp: string;
  runnerUpFlag: string;
  thirdPlace: string;
  thirdPlaceFlag: string;
  topScorer: string;
  topScorerGoals: number;
  bestPlayer: string;
  totalGoals: number;
  teamsCount: number;
  matchesCount: number;
  highlight: string;
}

export const WORLD_CUP_HISTORIC_EDITIONS: WorldCupEdition[] = [
  {
    year: 1930,
    host: "الأوروغواي",
    winner: "الأوروغواي",
    winnerFlag: "🇺🇾",
    runnerUp: "الأرجنتين",
    runnerUpFlag: "🇦🇷",
    thirdPlace: "الولايات المتحدة",
    thirdPlaceFlag: "🇺🇸",
    topScorer: "غييرمو ستابيلي (الأرجنتين)",
    topScorerGoals: 8,
    bestPlayer: "خوسيه ناسازي (الأوروغواي)",
    totalGoals: 70,
    teamsCount: 13,
    matchesCount: 18,
    highlight: "أول بطولة تاريخية لكأس العالم. أقيمت جميع مبارياتها في العاصمة مونتيفيديو، وفازت المستضيفة باللقب الأول."
  },
  {
    year: 1934,
    host: "إيطاليا",
    winner: "إيطاليا",
    winnerFlag: "🇮🇹",
    runnerUp: "تشيكوسلوفاكيا",
    runnerUpFlag: "🇨🇿",
    thirdPlace: "ألمانيا",
    thirdPlaceFlag: "🇩🇪",
    topScorer: "أولدريتش نييدلي (تشيكوسلوفاكيا)",
    topScorerGoals: 5,
    bestPlayer: "جوزيبي مياتزا (إيطاليا)",
    totalGoals: 70,
    teamsCount: 16,
    matchesCount: 17,
    highlight: "أول بطولة بنظام خروج المغلوب مباشرة. شهدت مشاركة أول منتخب عربي في التاريخ وهو منتخب مصر."
  },
  {
    year: 1938,
    host: "فرنسا",
    winner: "إيطاليا",
    winnerFlag: "🇮🇹",
    runnerUp: "المجر",
    runnerUpFlag: "🇭🇺",
    thirdPlace: "البرازيل",
    thirdPlaceFlag: "🇧🇷",
    topScorer: "ليونيداس da سيلفا (البرازيل)",
    topScorerGoals: 7,
    bestPlayer: "ليونيداس (البرازيل)",
    totalGoals: 84,
    teamsCount: 15,
    matchesCount: 18,
    highlight: "حافظت إيطاليا على لقبها بقيادة المدرب التاريخي فيتوريو بوتسو. غابت الأرجنتين والأوروغواي احتجاجاً على مكان إقامة البطولة."
  },
  {
    year: 1950,
    host: "البرازيل",
    winner: "الأوروغواي",
    winnerFlag: "🇺🇾",
    runnerUp: "البرازيل",
    runnerUpFlag: "🇧🇷",
    thirdPlace: "السويد",
    thirdPlaceFlag: "🇸🇪",
    topScorer: "أدمير (البرازيل)",
    topScorerGoals: 8,
    bestPlayer: "زيزينيو (البرازيل)",
    totalGoals: 88,
    teamsCount: 13,
    matchesCount: 22,
    highlight: "شهدت مباراة 'الماراكانازو' الشهيرة، حيث هزمت الأوروغواي البرازيل 2-1 أمام ربع مليون مشجع لتتوج باللقب الثاني."
  },
  {
    year: 1954,
    host: "سويسرا",
    winner: "ألمانيا الغربية",
    winnerFlag: "🇩🇪",
    runnerUp: "المجر",
    runnerUpFlag: "🇭🇺",
    thirdPlace: "النمسا",
    thirdPlaceFlag: "🇦🇹",
    topScorer: "ساندور كوتشيس (المجر)",
    topScorerGoals: 11,
    bestPlayer: "فرينك بوشكاش (المجر)",
    totalGoals: 140,
    teamsCount: 16,
    matchesCount: 26,
    highlight: "عُرفت المباراة النهائية بـ 'معجزة بيرن'، حيث انتصرت ألمانيا الغربية على جيل المجر الذهبي الأسطوري بنتيجة 3-2."
  },
  {
    year: 1958,
    host: "السويد",
    winner: "البرازيل",
    winnerFlag: "🇧🇷",
    runnerUp: "السويد",
    runnerUpFlag: "🇸🇪",
    thirdPlace: "فرنسا",
    thirdPlaceFlag: "🇫🇷",
    topScorer: "جاست فونتين (فرنسا)",
    topScorerGoals: 13,
    bestPlayer: "بيليه (البرازيل)",
    totalGoals: 126,
    teamsCount: 16,
    matchesCount: 35,
    highlight: "ظهور الجوهرة السوداء 'بيليه' بعمر 17 عاماً وتتويج البرازيل بلقبها الأول. سجل جاست فونتين طفرة تظل قياسية بـ 13 هدفاً في نسخة واحدة."
  },
  {
    year: 1962,
    host: "تشيلي",
    winner: "البرازيل",
    winnerFlag: "🇧🇷",
    runnerUp: "تشيكوسلوفاكيا",
    runnerUpFlag: "🇨🇿",
    thirdPlace: "تشيلي",
    thirdPlaceFlag: "🇨🇱",
    topScorer: "غارينشا، فافا وآخرين",
    topScorerGoals: 4,
    bestPlayer: "غارينشا (البرازيل)",
    totalGoals: 89,
    teamsCount: 16,
    matchesCount: 32,
    highlight: "حافظت البرازيل على لقبها رغم إصابة بيليه المبكرة بفضل عبقرية غارينشا الاستثنائية."
  },
  {
    year: 1966,
    host: "إنجلترا",
    winner: "إنجلترا",
    winnerFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    runnerUp: "ألمانيا الغربية",
    runnerUpFlag: "🇩🇪",
    thirdPlace: "البرتغال",
    thirdPlaceFlag: "🇵🇹",
    topScorer: "إيزيبيو (البرتغال)",
    topScorerGoals: 9,
    bestPlayer: "بوبي تشارلتون (إنجلترا)",
    totalGoals: 89,
    teamsCount: 16,
    matchesCount: 32,
    highlight: "اللقب الأول والوحيد لإنجلترا على أرضها. عُرف النهائي بهدف السير جيف هيرست الجدلي 'هدف خط المرمى الشهير'."
  },
  {
    year: 1970,
    host: "المكسيك",
    winner: "البرازيل",
    winnerFlag: "🇧🇷",
    runnerUp: "إيطاليا",
    runnerUpFlag: "🇮🇹",
    thirdPlace: "ألمانيا الغربية",
    thirdPlaceFlag: "🇩🇪",
    topScorer: "جيرد مولر (ألمانيا الغربية)",
    topScorerGoals: 10,
    bestPlayer: "بيليه (البرازيل)",
    totalGoals: 95,
    teamsCount: 16,
    matchesCount: 32,
    highlight: "يُعتبر جيل البرازيل 1970 أفضل فريق كرة قدم في تاريخ المونديال. احتفظت البرازيل بكأس جول ريميه للأبد."
  },
  {
    year: 1974,
    host: "ألمانيا الغربية",
    winner: "ألمانيا الغربية",
    winnerFlag: "🇩🇪",
    runnerUp: "هولندا",
    runnerUpFlag: "🇳🇱",
    thirdPlace: "بولندا",
    thirdPlaceFlag: "🇵🇱",
    topScorer: "غجيغوج لاتو (بولندا)",
    topScorerGoals: 7,
    bestPlayer: "يوهان كرويف (هولندا)",
    totalGoals: 97,
    teamsCount: 16,
    matchesCount: 38,
    highlight: "تم تقديم المجسم الجديد الحالي لكأس العالم. شهدت صعود أسلوب 'الكرة الشاملة' بقيادة كرويف مع هولندا."
  },
  {
    year: 1978,
    host: "الأرجنتين",
    winner: "الأرجنتين",
    winnerFlag: "🇦🇷",
    runnerUp: "هولندا",
    runnerUpFlag: "🇳🇱",
    thirdPlace: "البرازيل",
    thirdPlaceFlag: "🇧🇷",
    topScorer: "ماريو كيمبس (الأرجنتين)",
    topScorerGoals: 6,
    bestPlayer: "ماريو كيمبس (الأرجنتين)",
    totalGoals: 102,
    teamsCount: 16,
    matchesCount: 38,
    highlight: "تأسست البهجة في بيونس آيرس بحصول التانغو على لقبه الأول بقيادة النجم المانع ماريو كيمبس وسقوط هولندا مرة أخرى."
  },
  {
    year: 1982,
    host: "إسبانيا",
    winner: "إيطاليا",
    winnerFlag: "🇮🇹",
    runnerUp: "ألمانيا الغربية",
    runnerUpFlag: "🇩🇪",
    thirdPlace: "بولندا",
    thirdPlaceFlag: "🇵🇱",
    topScorer: "باولو روسي (إيطاليا)",
    topScorerGoals: 6,
    bestPlayer: "باولو روسي (إيطاليا)",
    totalGoals: 146,
    teamsCount: 24,
    matchesCount: 52,
    highlight: "تمت زيادة الفرق لـ 24. توجت إيطاليا للمرة الثالثة بمجهودات روسي الخارقة، وشهدت مباراة الكويت وفرنسا الشهيرة."
  },
  {
    year: 1986,
    host: "المكسيك",
    winner: "الأرجنتين",
    winnerFlag: "🇦🇷",
    runnerUp: "ألمانيا الغربية",
    runnerUpFlag: "🇩🇪",
    thirdPlace: "فرنسا",
    thirdPlaceFlag: "🇫🇷",
    topScorer: "غاري لينيكر (إنجلترا)",
    topScorerGoals: 6,
    bestPlayer: "دييغو مارادونا (الأرجنتين)",
    totalGoals: 132,
    teamsCount: 24,
    matchesCount: 52,
    highlight: "مهرجان دييغو أرماندو مارادونا الخارق. قاد الأرجنتين للقب، مسجلاً هدف القرن الشهير بمراوغة نصف منتخب إنجلترا."
  },
  {
    year: 1990,
    host: "إيطاليا",
    winner: "ألمانيا الغربية",
    winnerFlag: "🇩🇪",
    runnerUp: "الأرجنتين",
    runnerUpFlag: "🇦🇷",
    thirdPlace: "إيطاليا",
    thirdPlaceFlag: "🇮🇹",
    topScorer: "سالفاتوري سكيلاتشي (إيطاليا)",
    topScorerGoals: 6,
    bestPlayer: "سالفاتوري سكيلاتشي (إيطاليا)",
    totalGoals: 115,
    teamsCount: 24,
    matchesCount: 52,
    highlight: "شهدت البطولة تألقاً استثنائياً لمنتخب الكاميرون بقيادة العجوز روجيه ميلا والوصول كأول فريق أفريقي لربع النهائي."
  },
  {
    year: 1994,
    host: "الولايات المتحدة",
    winner: "البرازيل",
    winnerFlag: "🇧🇷",
    runnerUp: "إيطاليا",
    runnerUpFlag: "🇮🇹",
    thirdPlace: "السويد",
    thirdPlaceFlag: "🇸🇪",
    topScorer: "سالينكو (روسيا) وستويتشكوف (بلغاريا)",
    topScorerGoals: 6,
    bestPlayer: "روماريو (البرازيل)",
    totalGoals: 141,
    teamsCount: 24,
    matchesCount: 52,
    highlight: "أول نهائي يُحسم بركلات الترجيح، حيث أضاع روبيرتو باجيو ركلته الشهيرة لتتوج السامبا باللقب الرابع."
  },
  {
    year: 1998,
    host: "فرنسا",
    winner: "فرنسا",
    winnerFlag: "🇫🇷",
    runnerUp: "البرازيل",
    runnerUpFlag: "🇧🇷",
    thirdPlace: "كرواتيا",
    thirdPlaceFlag: "🇭🇷",
    topScorer: "دافور شوكر (كرواتيا)",
    topScorerGoals: 6,
    bestPlayer: "رونالدو (البرازيل)",
    totalGoals: 171,
    teamsCount: 32,
    matchesCount: 64,
    highlight: "تم توسيع البطولة إلى 32 منتخباً. تألق زين الدين زيدان في النهائي برأسيتين ليمنح الديوك الفرنسية لقبهم الأول."
  },
  {
    year: 2002,
    host: "كوريا الجنوبية / اليابان",
    winner: "البرازيل",
    winnerFlag: "🇧🇷",
    runnerUp: "ألمانيا",
    runnerUpFlag: "🇩🇪",
    thirdPlace: "تركيا",
    thirdPlaceFlag: "🇹🇷",
    topScorer: "رونالدو الظاهرة (البرازيل)",
    topScorerGoals: 8,
    bestPlayer: "أوليفر كان (ألمانيا)",
    totalGoals: 161,
    teamsCount: 32,
    matchesCount: 64,
    highlight: "أول نسخة تقام في قارة آسيا وبتنظيم مشترك. انتصار السامبا الكبير بلقبها الخامس بقيادة رونالدو، ريفالدو، ورونالدينيو."
  },
  {
    year: 2006,
    host: "ألمانيا",
    winner: "إيطاليا",
    winnerFlag: "🇮🇹",
    runnerUp: "فرنسا",
    runnerUpFlag: "🇫🇷",
    thirdPlace: "ألمانيا",
    thirdPlaceFlag: "🇩🇪",
    topScorer: "ميروسلاف كلوزه (ألمانيا)",
    topScorerGoals: 5,
    bestPlayer: "زين الدين زيدان (فرنسا)",
    totalGoals: 147,
    teamsCount: 32,
    matchesCount: 64,
    highlight: "أحد أكثر المواسم إثارة. شهد نطحة زيدان الشهيرة لماتيراتزي في المباراة النهائية، وحسم الأزوري للقب الرابع بركلات الترجيح."
  },
  {
    year: 2010,
    host: "جنوب أفريقيا",
    winner: "إسبانيا",
    winnerFlag: "🇪🇸",
    runnerUp: "هولندا",
    runnerUpFlag: "🇳🇱",
    thirdPlace: "ألمانيا",
    thirdPlaceFlag: "🇩🇪",
    topScorer: "توماس مولر (ألمانيا)",
    topScorerGoals: 5,
    bestPlayer: "دييغو فورلان (الأوروغواي)",
    totalGoals: 145,
    teamsCount: 32,
    matchesCount: 64,
    highlight: "أول بطولة تقام في قارة أفريقيا. فازت إسبانيا باللقب لأول مرة بهدف إنييستا القاتل في الأشواط الإضافية وعزف أبواق الفوفوزيلا."
  },
  {
    year: 2014,
    host: "البرازيل",
    winner: "ألمانيا",
    winnerFlag: "🇩🇪",
    runnerUp: "الأرجنتين",
    runnerUpFlag: "🇦🇷",
    thirdPlace: "هولندا",
    thirdPlaceFlag: "🇳🇱",
    topScorer: "خاميس رودريغيز (كولومبيا)",
    topScorerGoals: 6,
    bestPlayer: "ليونيل ميسي (الأرجنتين)",
    totalGoals: 171,
    teamsCount: 32,
    matchesCount: 64,
    highlight: "أقسى الهزائم للبرازيل على أرضها 7-1 أمام الماكينات الألمانية التي واصلت طريقها وهزمت التانغو بهدف غوتزه بـ 1-0."
  },
  {
    year: 2018,
    host: "روسيا",
    winner: "فرنسا",
    winnerFlag: "🇫🇷",
    runnerUp: "كرواتيا",
    runnerUpFlag: "🇭🇷",
    thirdPlace: "بلجيكا",
    thirdPlaceFlag: "🇧🇪",
    topScorer: "هاري كين (إنجلترا)",
    topScorerGoals: 6,
    bestPlayer: "لوكا مودريتش (كرواتيا)",
    totalGoals: 169,
    teamsCount: 32,
    matchesCount: 64,
    highlight: "شهدت إدخال تقنية حكم الفيديو المساعد (VAR) رسمياً. توّج شباب فرنسا باللقب الثاني عقب نهائي ممتع ومثير بنتيجة 4-2 مال لصالحهم."
  },
  {
    year: 2022,
    host: "قطر",
    winner: "الأرجنتين",
    winnerFlag: "🇦🇷",
    runnerUp: "فرنسا",
    runnerUpFlag: "🇫🇷",
    thirdPlace: "كرواتيا",
    thirdPlaceFlag: "🇭🇷",
    topScorer: "كيليان مبابي (فرنسا)",
    topScorerGoals: 8,
    bestPlayer: "ليونيل ميسي (الأرجنتين)",
    totalGoals: 172,
    teamsCount: 32,
    matchesCount: 64,
    highlight: "النسخة الاستثنائية الأولى في الوطن العربي. نهاية أسطورية تُوج خلالها ليونيل ميسي بالذهب عقب فوز تاريخي في أعظم نهائي بالتاريخ بركلات الترجيح."
  }
];

export interface HistoricRecord {
  title: string;
  value: string;
  holder: string;
  desc: string;
}

export const WORLD_CUP_RECORDS: HistoricRecord[] = [
  {
    title: "المنتخب الأكثر تتويجاً بلقب المونديال",
    value: "5 ألقاب",
    holder: "البرازيل 🇧🇷",
    desc: "توج السامبا باللقب في الأعوام: 1958، 1962، 1970، 1994، و2002."
  },
  {
    title: "الهداف التاريخي لبطولات كأس العالم",
    value: "16 هدفاً",
    holder: "ميروسلاف كلوزه (ألمانيا) 🇩🇪",
    desc: "حطم الرقم التاريخي المسجل باسم رونالدو البرازيلي خلال مباراة الـ 7-1 الأيقونية في عام 2014."
  },
  {
    title: "أكثر اللاعبين فوزاً بكأس العالم",
    value: "3 ألقاب ومؤهلات",
    holder: "بيليه (البرازيل) 🇧🇷",
    desc: "اللاعب الوحيد في تاريخ اللعبة الحائز على 3 كؤوس عالم (1958، 1962، 1970)."
  },
  {
    title: "أكثر اللاعبين خوضاً للمباريات",
    value: "26 مباراة",
    holder: "ليونيل ميسي (الأرجنتين) 🇦🇷",
    desc: "أجتاز رقم الألماني لوثار ماتيوس (25 مباراة) خلال مباراته النهائية في قطر 2022."
  },
  {
    title: "أكثر عدد أهداف في بطولة واحدة",
    value: "13 هدفاً",
    holder: "جاست فونتين (فرنسا) 🇫🇷",
    desc: "سجل هذا الرقم الأسطوري الممتع خلال منافسات بطولة السويد عام 1958."
  },
  {
    title: "أسرع هدف في تاريخ كأس العالم",
    value: "11 ثانية",
    holder: "هاكان شوكور (تركيا) 🇹🇷",
    desc: "سدده في شباك منتخب كوريا الجنوبية بالثانية 11 في مباراة تحديد المركز الثالث في عام 2002."
  }
];
