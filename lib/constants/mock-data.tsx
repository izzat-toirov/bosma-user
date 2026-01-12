export interface Article {
  id: string
  slug: string
  titleUz: string
  titleRu: string
  contentUz: string
  contentRu: string
  category: string
  thumbnail: string
  issueDate: string
}

export interface Newspaper {
  id: string
  title: string
  coverImage: string
  issueDate: string
  pdfUrl: string
}

export const articles: Article[] = [
  {
    id: "1",
    slug: "silicon-valley-startup",
    titleUz: "Silicon Valley Startup-i Yangi Milliardga Erishdi",
    titleRu: "Стартап из Кремниевой Долины достиг миллиарда долларов",
    contentUz:
      "<p>Technologiya sohasi bugun juda tez rivojlanmoqda. Yangi startup 500 million dollar investitsiya qabul qildi.</p><p>Bu qadamdan sonra kompaniya 50 ta yangi ish orinini tashkil etadi.</p>",
    contentRu:
      "<p>Технологический сектор развивается очень быстро. Новый стартап получил инвестиции в размере 500 миллионов долларов.</p><p>После этого компания создаст 50 новых рабочих мест.</p>",
    category: "Teknologiya",
    thumbnail: "/silicon-valley-office-building.jpg",
    issueDate: "2025-01-09",
  },
  {
    id: "2",
    slug: "climate-summit",
    titleUz: "Iqlim Sammiti Yangi Qo'llanmalarni Qabul Qildi",
    titleRu: "Климатический саммит принял новые рекомендации",
    contentUz:
      "<p>Dunyo mamlakatlarining raislari Parizhda iqlimni saqlash bo'yicha uchrashdi.</p><p>Ushbu sammitda 195 ta davlat yangi ekologik protokollarga imzo chiqardi.</p>",
    contentRu:
      "<p>Лидеры мировых держав встретились в Париже для обсуждения защиты климата.</p><p>На этом саммите 195 стран подписали новые экологические протоколы.</p>",
    category: "Atrof-muhit",
    thumbnail: "/climate-conference-sustainability.jpg",
    issueDate: "2025-01-08",
  },
  {
    id: "3",
    slug: "sports-championship",
    titleUz: "Futbol Chempionati: Yangi Jumlani Kuchchisi",
    titleRu: "Футбольный чемпионат: новый сильнейший в лиге",
    contentUz:
      "<p>Jang futbol chempionatida Germaniya jamoasi oldinga chiqqan.</p><p>Ular to'rt o'yin o'ynab, hammasida g'alaba qozonishdi.</p>",
    contentRu:
      "<p>На чемпионате по футболу немецкая команда вышла вперед.</p><p>Они выиграли все четыре матча подряд.</p>",
    category: "Sport",
    thumbnail: "/soccer-football-match-stadium.jpg",
    issueDate: "2025-01-07",
  },
  {
    id: "4",
    slug: "medical-breakthrough",
    titleUz: "Tibbiyot: Saraton Dorisinining Yangi Usuli",
    titleRu: "Медицина: новый метод лечения рака",
    contentUz:
      "<p>Tadqiqotchilar saraton dorisinining yangi usulini topdilar.</p><p>Bu usul 85% bemorlarni yoqotgan.</p>",
    contentRu: "<p>Исследователи обнаружили новый метод лечения рака.</p><p>Этот метод помог 85% пациентов.</p>",
    category: "Sog'liq",
    thumbnail: "/medical-laboratory-research-scientist.jpg",
    issueDate: "2025-01-06",
  },
  {
    id: "5",
    slug: "market-trends",
    titleUz: "Bozor Tendentsiylari: Kripto Valyutasi Ko'tarildi",
    titleRu: "Тренды на рынке: рост криптовалют",
    contentUz:
      "<p>Kripto valyutasi bozorida katta o'zgarishlar ro'y berdi.</p><p>Bitcoin 45,000 dollardan oshib ketdi.</p>",
    contentRu:
      "<p>На рынке криптовалют произошли значительные изменения.</p><p>Биткойн превысил отметку в 45 000 долларов.</p>",
    category: "Iqtisod",
    thumbnail: "/stock-market-trading-screen-financial.jpg",
    issueDate: "2025-01-05",
  },
  {
    id: "6",
    slug: "space-exploration",
    titleUz: "Kosmik Arashtirish: Mars Missiyasining Muvaffaqiyati",
    titleRu: "Исследование космоса: успешная миссия на Марс",
    contentUz:
      "<p>NASA-ning yangi Mars missiyasi muvaffaqiyat bilan amalga oshdi.</p><p>Rover sayyoraga muvaffaqiyat bilan qo'nib, ishlashni boshladi.</p>",
    contentRu:
      "<p>Новая марсианская миссия НАСА прошла успешно.</p><p>Ровер успешно приземлился на планету и начал работу.</p>",
    category: "Fanning",
    thumbnail: "/mars-rover-space-exploration-nasa.jpg",
    issueDate: "2025-01-04",
  },
]

export const newspapers: Newspaper[] = [
  {
    id: "1",
    title: "Yanvar 2025 - Birinchi Soni",
    coverImage: "/newspaper-cover-design.jpg",
    issueDate: "2025-01-01",
    pdfUrl: "#",
  },
  {
    id: "2",
    title: "Dekabr 2024 - Oxirgi Soni",
    coverImage: "/newspaper-cover-design.jpg",
    issueDate: "2024-12-01",
    pdfUrl: "#",
  },
  {
    id: "3",
    title: "Noyabr 2024",
    coverImage: "/newspaper-cover-design.jpg",
    issueDate: "2024-11-01",
    pdfUrl: "#",
  },
]
