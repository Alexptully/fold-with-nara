// Every source the deck cites. `cite` is the short footer form; `title` and `url`
// appear on the sources slide. A slide lists its sources in slides.ts (sourcesByStep).

export type Source = { cite: string; title: string; url?: string };

export const sources = {
  duolingoPrompt: {
    cite: "Duolingo x Iovine and Young prompts, Fall 2026",
    title: "Innovator's Forum Prompts, Fall 2026 (Prompt 2 brief, the Duolingo Method, character shape guide)",
  },
  naraDeerCount2026: {
    cite: "Nara Deer Preservation Foundation count, July 2026, via News On Japan",
    title: "Nara's Deer Population Hits Record High (1,687 deer counted in July 2026)",
    url: "https://newsonjapan.com/article/150303.php",
  },
  naraDeerHistory: {
    cite: "Japan Tourism Agency, Deer and Tobihino, 2018",
    title: "Deer and Tobihino: Kasuga Taisha explanation text (deer as messengers, revered 1,250+ years, bowing for crackers)",
    url: "https://www.mlit.go.jp/tagengo-db/en/H30-00900.html",
  },
  naraNaturalMonument: {
    cite: "The Standard (Hong Kong), 2026",
    title: "Nara's famous deer take an unexpected trip to downtown Osaka (deer protected as a natural monument)",
    url: "https://www.thestandard.com.hk/world/article/327471/Naras-famous-deer-take-an-unexpected-trip-to-downtown-Osaka",
  },
  ojigi: {
    cite: "Coto Academy, Guide to Bowing in Japan",
    title: "Guide to Bowing in Japan (Ojigi): greeting, thanks and apology",
    url: "https://cotoacademy.com/bowing-japan-etiquette/",
  },
  origamiWord: {
    cite: "Merriam-Webster, origami",
    title: "Origami: from Japanese ori (fold) + kami (paper)",
    url: "https://www.merriam-webster.com/dictionary/origami",
  },
  sakura: {
    cite: "Embassy of Japan in Canada, Sakura",
    title: "Sakura, the flowering cherry tree: a symbol of transience; blossoms last about a week to ten days",
    url: "https://www.ca.emb-japan.go.jp/JapaneseSite/Nikokukan/Sakura/sakura.html",
  },
  teaCeremony: {
    cite: "Embassy of Japan in India, Japanese Tea Ceremony",
    title: "Japanese Tea Ceremony: wa, kei, sei, jaku (harmony, respect, purity, tranquility) and the host's hospitality",
    url: "https://www.in.emb-japan.go.jp/About_Us/TeaCeremony.html",
  },
  kimono: {
    cite: "Vocabulary.com, kimono",
    title: "Kimono: from ki (wear) + mono (thing), literally a thing to wear",
    url: "https://www.vocabulary.com/dictionary/kimono",
  },
  senbazuru: {
    cite: "Wikipedia, One thousand origami cranes",
    title: "One thousand origami cranes (senbazuru): cranes as a symbol of long life, given to wish for recovery",
    url: "https://en.wikipedia.org/wiki/One_thousand_origami_cranes",
  },
  fuji: {
    cite: "UNESCO World Heritage List, Fujisan, 2013",
    title: "Fujisan, sacred place and source of artistic inspiration (a pilgrimage site and an internationally recognized icon of Japan)",
    url: "https://whc.unesco.org/en/list/1418",
  },
  childrensDay: {
    cite: "Japan House Los Angeles, Children's Day, 2022",
    title: "The Colorful Traditions of Children's Day (carp streamers for strength and perseverance; kabuto displayed to inspire bravery)",
    url: "https://japanhousela.com/articles/the-colorful-traditions-of-childrens-day",
  },
  retrieval: {
    cite: "Roediger and Karpicke, Psychological Science, 2006",
    title: "Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention, 17(3), 249 to 255",
    url: "https://doi.org/10.1111/j.1467-9280.2006.01693.x",
  },
  fading: {
    cite: "Renkl, Atkinson and Maier, University of Freiburg, 2000",
    title: "From Example Study to Problem Solving: Smooth Transitions Help Learning (fading worked steps, field and lab experiments)",
    url: "https://www.psycharchives.org/handle/20.500.11780/196",
  },
} as const satisfies Record<string, Source>;

export type SourceKey = keyof typeof sources;
