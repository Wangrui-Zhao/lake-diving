// ===== 命题库 =====
export const PROMPTS = [
  "描述一下此刻窗外的天空，用三个颜色来表达",
  "闭上眼睛听一分钟，写下你听到的所有声音",
  "今天你闻到了什么特别的气味？它让你想起了什么？",
  "描述今天的月亮，或者想象一下今晚的月亮",
  "现在你的身体有哪里感到不舒服，哪里感到舒适？",
  "描述一下今天阳光或光线的样子",
  "你最近触摸过的一个东西是什么感觉？",
  "今天让你感到温暖的一件小事是什么？",
  "用一种天气来描述你今天的心情",
  "此刻你最想对谁说一句话？说什么？",
  "最近有什么事让你感到有点委屈，但又说不出口？",
  "今天有没有一个瞬间让你感到「活着真好」？",
  "你现在的情绪像什么颜色？为什么？",
  "最近什么事情让你感到平静？",
  "如果你今天是一朵云，你会飘到哪里去？",
  "给一年前的自己写一句话",
  "想象十年后的你正在做什么",
  "如果你能变成一种动物度过今天，你选什么？为什么？",
  "描述一个理想中的下午",
  "如果今天的心情是一首歌，那是什么歌？为什么？",
  "想象你拥有一个秘密花园，里面有什么？",
  "今天吃了什么？有没有哪一口特别好吃？",
  "今天遇到了哪些人？有谁让你印象深刻？",
  "今天做了一件完全没计划的事是什么？",
  "今天你浪费了多少时间？在做什么？",
  "今天有没有改变主意的一刻？",
  "写下今天三个不重要但真实发生的小细节",
  "今天你说的最后一句话是什么，对谁说的？",
  "最近有什么事情一直在你脑子里转，挥不去？",
  "你最近学到的一件新事物是什么？",
  "如果你的生活是一部电影，今天是第几分钟？发生了什么？",
  "有什么事你一直想做但总是推迟？为什么？",
  "你对「家」这个字的理解是什么？",
];

// ===== 定制 SVG 容器图标 =====
const SVG_BOTTLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="44" height="44" shape-rendering="crispEdges">
  <rect x="6" y="0" width="4" height="1" fill="#6B4A14"/>
  <rect x="6" y="1" width="4" height="1" fill="#8B6018"/>
  <rect x="6" y="2" width="1" height="4" fill="#3A7A9A"/>
  <rect x="9" y="2" width="1" height="4" fill="#285A78"/>
  <rect x="7" y="2" width="2" height="4" fill="#A8E0F8" opacity="0.6"/>
  <rect x="7" y="2" width="1" height="4" fill="#D0F0FF" opacity="0.4"/>
  <rect x="4" y="6" width="1" height="2" fill="#2A6888"/>
  <rect x="11" y="6" width="1" height="2" fill="#1E5070"/>
  <rect x="5" y="6" width="6" height="1" fill="#3A88A8"/>
  <rect x="5" y="7" width="6" height="1" fill="#88CCE8" opacity="0.7"/>
  <rect x="3" y="8" width="1" height="7" fill="#1E5070"/>
  <rect x="12" y="8" width="1" height="7" fill="#163C58"/>
  <rect x="3" y="15" width="10" height="1" fill="#1E5070"/>
  <rect x="4" y="8" width="8" height="7" fill="#70BADA" opacity="0.35"/>
  <rect x="5" y="8" width="1" height="7" fill="#D8F2FF" opacity="0.55"/>
  <rect x="6" y="8" width="1" height="7" fill="#EEFAFF" opacity="0.25"/>
  <rect x="4" y="11" width="8" height="4" fill="#4AAACE" opacity="0.45"/>
  <rect x="5" y="11" width="6" height="1" fill="#88DDFF" opacity="0.3"/>
  <rect x="9" y="9" width="1" height="1" fill="#FFFFFF" opacity="0.6"/>
  <rect x="7" y="12" width="1" height="1" fill="#FFFFFF" opacity="0.4"/>
</svg>`;

const SVG_SHELL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="44" height="44" shape-rendering="crispEdges">
  <rect x="5" y="1" width="6" height="1" fill="#9A7020"/>
  <rect x="3" y="2" width="10" height="1" fill="#B88830"/>
  <rect x="2" y="3" width="12" height="1" fill="#D4A840"/>
  <rect x="1" y="4" width="14" height="1" fill="#E8BE54"/>
  <rect x="1" y="5" width="14" height="1" fill="#E8BE54"/>
  <rect x="2" y="6" width="12" height="1" fill="#D4A840"/>
  <rect x="3" y="3" width="10" height="3" fill="#F8E898" opacity="0.7"/>
  <rect x="4" y="2" width="1" height="5" fill="#9A7020" opacity="0.35"/>
  <rect x="7" y="1" width="1" height="5" fill="#9A7020" opacity="0.25"/>
  <rect x="10" y="2" width="1" height="5" fill="#9A7020" opacity="0.35"/>
  <rect x="5" y="7" width="6" height="1" fill="#7A5010"/>
  <rect x="6" y="7" width="4" height="1" fill="#AA7820"/>
  <rect x="2" y="8" width="12" height="1" fill="#C89030"/>
  <rect x="1" y="9" width="14" height="4" fill="#E8C858"/>
  <rect x="2" y="13" width="12" height="1" fill="#C89030"/>
  <rect x="3" y="14" width="10" height="1" fill="#9A7020"/>
  <rect x="2" y="9" width="12" height="4" fill="#FFF8D8" opacity="0.6"/>
  <rect x="5" y="9" width="6" height="4" fill="#FFFFFF" opacity="0.35"/>
  <rect x="6" y="9" width="4" height="4" fill="#FFEEFF" opacity="0.4"/>
  <rect x="6" y="10" width="4" height="2" fill="#FFFFFF" opacity="0.9"/>
  <rect x="7" y="10" width="2" height="2" fill="#FFE8FF"/>
  <rect x="7" y="10" width="1" height="1" fill="#FFFFFF"/>
  <rect x="3" y="9"  width="1" height="1" fill="#FFFFFF" opacity="0.7"/>
  <rect x="12" y="12" width="1" height="1" fill="#FFFFFF" opacity="0.5"/>
</svg>`;

const SVG_CHEST = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="44" height="44" shape-rendering="crispEdges">
  <rect x="3" y="2" width="10" height="1" fill="#4A1E00"/>
  <rect x="2" y="3" width="12" height="1" fill="#7A3808"/>
  <rect x="1" y="4" width="14" height="2" fill="#A05018"/>
  <rect x="2" y="4" width="12" height="1" fill="#D07828" opacity="0.5"/>
  <rect x="1" y="6" width="14" height="1" fill="#6B380A"/>
  <rect x="1" y="7" width="14" height="1" fill="#8B4810"/>
  <rect x="1" y="8" width="14" height="7" fill="#9A4A10"/>
  <rect x="1" y="8" width="2" height="7" fill="#6B3008"/>
  <rect x="13" y="8" width="2" height="7" fill="#5A2808"/>
  <rect x="1" y="11" width="14" height="2" fill="#7A3A08"/>
  <rect x="3" y="8" width="10" height="1" fill="#C06020" opacity="0.45"/>
  <rect x="1"  y="8"  width="1" height="1" fill="#C8A030"/>
  <rect x="14" y="8"  width="1" height="1" fill="#C8A030"/>
  <rect x="1"  y="14" width="1" height="1" fill="#C8A030"/>
  <rect x="14" y="14" width="1" height="1" fill="#C8A030"/>
  <rect x="6" y="9" width="4" height="1" fill="#E0B020"/>
  <rect x="5" y="10" width="6" height="3" fill="#C89018"/>
  <rect x="6" y="10" width="4" height="3" fill="#F0C828"/>
  <rect x="7" y="11" width="2" height="1" fill="#3A1800"/>
  <rect x="7" y="12" width="1" height="1" fill="#3A1800"/>
  <rect x="1" y="15" width="14" height="1" fill="#3A1800"/>
</svg>`;

export const CONTAINER_TYPES = [
  { id: 'bottle', label: '玻璃瓶', svg: SVG_BOTTLE, color: '#7ecef0', glowColor: 'rgba(126,206,240,0.6)' },
  { id: 'shell',  label: '蚌壳',   svg: SVG_SHELL,  color: '#f0c870', glowColor: 'rgba(240,200,112,0.6)' },
  { id: 'chest',  label: '宝箱',   svg: SVG_CHEST,  color: '#c8a46e', glowColor: 'rgba(240,180,80,0.7)'  },
];

// ===== 存储层 =====
const STORAGE_KEY = 'hudi_entries';

export function loadEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

export function saveEntry(entry) {
  const entries = loadEntries();
  entries.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function setEntryStatus(id, status) {
  const entries = loadEntries();
  const idx = entries.findIndex(e => e.id === id);
  if (idx !== -1) {
    entries[idx].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}

export function getRecentPrompts(n = 5) {
  return loadEntries().slice(0, n).map(e => e.prompt);
}

export function pickRandomPrompt() {
  const recent = new Set(getRecentPrompts(6));
  const available = PROMPTS.filter(p => !recent.has(p));
  const pool = available.length > 0 ? available : PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickRandomContainers(count = 3) {
  return [...CONTAINER_TYPES].sort(() => Math.random() - 0.5).slice(0, count);
}

// ===== 像素图标 =====
export const SVG_TRASH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14" shape-rendering="crispEdges">
  <rect x="4" y="0" width="4" height="1" fill="#aaa"/>
  <rect x="1" y="1" width="10" height="2" fill="#bbb"/>
  <rect x="1" y="1" width="10" height="1" fill="#ddd"/>
  <rect x="2" y="3" width="1" height="10" fill="#999"/>
  <rect x="9" y="3" width="1" height="10" fill="#888"/>
  <rect x="2" y="12" width="8" height="1" fill="#999"/>
  <rect x="3" y="3" width="6" height="9" fill="#aaa"/>
  <rect x="3" y="3" width="6" height="1" fill="#ccc" opacity=".5"/>
  <rect x="4" y="4" width="1" height="7" fill="#777" opacity=".6"/>
  <rect x="7" y="4" width="1" height="7" fill="#777" opacity=".6"/>
</svg>`;

export const SVG_PARCHMENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14" shape-rendering="crispEdges">
  <rect x="2" y="0" width="8" height="2" fill="#c8a040"/>
  <rect x="1" y="1" width="10" height="1" fill="#d8b050"/>
  <rect x="0" y="2" width="12" height="10" fill="#f0d880"/>
  <rect x="1" y="2" width="10" height="10" fill="#fef4c0"/>
  <rect x="2" y="3" width="8" height="1" fill="#b89030" opacity=".5"/>
  <rect x="2" y="5" width="7" height="1" fill="#b89030" opacity=".4"/>
  <rect x="2" y="7" width="6" height="1" fill="#b89030" opacity=".4"/>
  <rect x="2" y="9" width="5" height="1" fill="#b89030" opacity=".35"/>
  <rect x="1" y="12" width="10" height="1" fill="#d8b050"/>
  <rect x="2" y="13" width="8" height="1" fill="#c8a040"/>
</svg>`;
