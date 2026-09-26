// 标准盲文六点编号：左列 1/2/3，右列 4/5/6。
// cell_pattern 为凸起点位升序以 "-" 拼接，空阵为 ""。
const letterSymbols = [
  { letter: "a", pinyin: "啊 ā", cell_pattern: "1" },
  { letter: "b", pinyin: "玻 bō", cell_pattern: "1-2" },
  { letter: "c", pinyin: "雌 cí", cell_pattern: "1-4" },
  { letter: "d", pinyin: "得 dé", cell_pattern: "1-4-5" },
  { letter: "e", pinyin: "鹅 é", cell_pattern: "1-5" },
  { letter: "f", pinyin: "佛 fó", cell_pattern: "1-2-4" },
  { letter: "g", pinyin: "哥 gē", cell_pattern: "1-2-4-5" },
  { letter: "h", pinyin: "喝 hē", cell_pattern: "1-2-5" },
  { letter: "i", pinyin: "衣 yī", cell_pattern: "2-4" },
  { letter: "j", pinyin: "基 jī", cell_pattern: "2-4-5" },
  { letter: "k", pinyin: "科 kē", cell_pattern: "1-3" },
  { letter: "l", pinyin: "勒 lè", cell_pattern: "1-2-3" },
  { letter: "m", pinyin: "摸 mō", cell_pattern: "1-3-4" },
  { letter: "n", pinyin: "讷 nè", cell_pattern: "1-3-4-5" },
  { letter: "o", pinyin: "喔 ō", cell_pattern: "1-3-5" },
  { letter: "p", pinyin: "坡 pō", cell_pattern: "1-2-3-4" },
  { letter: "q", pinyin: "欺 qī", cell_pattern: "1-2-3-4-5" },
  { letter: "r", pinyin: "日 rì", cell_pattern: "1-2-3-5" },
  { letter: "s", pinyin: "思 sī", cell_pattern: "2-3-4" },
  { letter: "t", pinyin: "特 tè", cell_pattern: "2-3-4-5" },
  { letter: "u", pinyin: "乌 wū", cell_pattern: "1-3-6" },
  { letter: "v", pinyin: "迂 yū", cell_pattern: "1-2-3-6" },
  { letter: "w", pinyin: "蛙 wā", cell_pattern: "2-4-5-6" },
  { letter: "x", pinyin: "希 xī", cell_pattern: "1-3-4-6" },
  { letter: "y", pinyin: "呀 yā", cell_pattern: "1-3-4-5-6" },
  { letter: "z", pinyin: "资 zī", cell_pattern: "1-3-5-6" }
];

export const mockData = {
  brailleSymbol: letterSymbols.map((item, index) => {
    const id = index + 1;
    return {
      id,
      cell_pattern: item.cell_pattern,
      letter: item.letter,
      pinyin: item.pinyin,
      category: "LETTER",
      difficulty: index < 10 ? "EASY" : index < 20 ? "MEDIUM" : "HARD",
      audio_hint_key: `letter.${item.letter}`
    };
  }),
  lesson: [
    {
      id: 1,
      title: "汉语拼音字母六点入门",
      symbol_ids: letterSymbols.map((_, index) => index + 1),
      stage: "入门",
      estimated_minutes: "15",
      unlock_rule: "NONE"
    }
  ],
  // 练习会话与答题记录运行时落在 IndexedDB，种子不再灌入脏数据
  practiceSession: [],
  answerRecord: []
} as const;
