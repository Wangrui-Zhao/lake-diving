// ===== 命题库 =====
export const PROMPTS = [
  // 感知类
  "描述一下此刻窗外的天空，用三个颜色来表达",
  "闭上眼睛听一分钟，写下你听到的所有声音",
  "今天你闻到了什么特别的气味？它让你想起了什么？",
  "描述今天的月亮，或者想象一下今晚的月亮",
  "现在你的身体有哪里感到不舒服，哪里感到舒适？",
  "描述一下今天阳光或光线的样子",
  "你最近触摸过的一个东西是什么感觉？",

  // 情感类
  "今天让你感到温暖的一件小事是什么？",
  "用一种天气来描述你今天的心情",
  "此刻你最想对谁说一句话？说什么？",
  "最近有什么事让你感到有点委屈，但又说不出口？",
  "今天有没有一个瞬间让你感到「活着真好」？",
  "你现在的情绪像什么颜色？为什么？",
  "最近什么事情让你感到平静？",

  // 想象类
  "如果你今天是一朵云，你会飘到哪里去？",
  "给一年前的自己写一句话",
  "想象十年后的你正在做什么",
  "如果你能变成一种动物度过今天，你选什么？为什么？",
  "描述一个理想中的下午",
  "如果今天的心情是一首歌，那是什么歌？为什么？",
  "想象你拥有一个秘密花园，里面有什么？",

  // 记录类
  "今天吃了什么？有没有哪一口特别好吃？",
  "今天遇到了哪些人？有谁让你印象深刻？",
  "今天做了一件完全没计划的事是什么？",
  "今天你浪费了多少时间？在做什么？",
  "今天有没有改变主意的一刻？",
  "写下今天三个不重要但真实发生的小细节",
  "今天你说的最后一句话是什么，对谁说的？",

  // 思考类
  "最近有什么事情一直在你脑子里转，挥不去？",
  "你最近学到的一件新事物是什么？",
  "如果你的生活是一部电影，今天是第几分钟？发生了什么？",
  "有什么事你一直想做但总是推迟？为什么？",
  "你对「家」这个字的理解是什么？",
];

// 容器类型
export const CONTAINER_TYPES = [
  { id: 'bottle', label: '玻璃瓶', emoji: '🍶', color: '#7ecef0' },
  { id: 'shell',  label: '蚌壳',   emoji: '🐚', color: '#f0c870' },
  { id: 'chest',  label: '宝箱',   emoji: '📦', color: '#c8a46e' },
];

// ===== 存储层 =====
const STORAGE_KEY = 'hudi_entries';

export function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveEntry(entry) {
  const entries = loadEntries();
  entries.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getRecentPrompts(n = 5) {
  const entries = loadEntries();
  return entries.slice(0, n).map(e => e.prompt);
}

export function pickRandomPrompt() {
  const recent = new Set(getRecentPrompts(6));
  const available = PROMPTS.filter(p => !recent.has(p));
  const pool = available.length > 0 ? available : PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickRandomContainers(count = 3) {
  const shuffled = [...CONTAINER_TYPES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
