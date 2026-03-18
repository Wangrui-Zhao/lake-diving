import {
  CONTAINER_TYPES, SVG_TRASH, SVG_PARCHMENT,
  loadEntries, saveEntry, setEntryStatus,
  pickRandomPrompt, pickRandomContainers,
} from './data.js';

// ===== 音效（每次播放建立新實例，避免狀態問題）=====
function play(file, vol = 0.7) {
  try {
    const a = new Audio('sounds/' + file);
    a.volume = vol;
    a.play().catch(() => {});
  } catch(e) {}
}
const SFX_BUBBLE = () => play('bubble.mp3',      0.55);
const SFX_GOLD   = () => play('treasure.mp3',    0.8);
const SFX_PAPER  = () => play('papershuffle.mp3',0.7);

// ===== 狀態 =====
let state = {
  scene: 'shore',          // shore|diving|underwater|writing|surfacing|classify|vault|trash
  containers: [],
  selectedContainer: null,
  currentPrompt: '',
  draftText: '',
};

function setState(patch) { Object.assign(state, patch); render(); }

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  const scenes = {
    shore:      renderShore,
    diving:     () => renderTransition('diving'),
    underwater: renderUnderwater,
    writing:    renderWriting,
    surfacing:  () => renderTransition('surfacing'),
    classify:   renderClassify,
    vault:      renderVault,
    trash:      renderTrash,
  };
  if (scenes[state.scene]) app.appendChild(scenes[state.scene]());
}

// ============================================================
// ===== 開局場景（白天湖岸）=====
// ============================================================
function renderShore() {
  const scene = el('div', 'scene', { id: 'scene-shore' });

  // 天空层（云朵/太阳）
  const sky = el('div', 'shore-sky');

  // 太阳（橙色像素 SVG，带螺旋纹）
  const sunEl = el('div', 'pixel-sun');
  sunEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges" width="52" height="52">
    <rect x="8" y="1" width="8" height="2" fill="#ff7800"/>
    <rect x="5" y="3" width="14" height="1" fill="#ff8000"/>
    <rect x="3" y="4" width="18" height="2" fill="#ff8800"/>
    <rect x="1" y="6" width="22" height="12" fill="#ff9010"/>
    <rect x="3" y="18" width="18" height="2" fill="#ff8000"/>
    <rect x="5" y="20" width="14" height="1" fill="#ff7000"/>
    <rect x="8" y="21" width="8" height="2" fill="#ff6800"/>
    <rect x="4" y="5" width="16" height="14" fill="#ff9010"/>
    <rect x="5" y="4" width="14" height="16" fill="#ff9010"/>
    <rect x="5" y="6" width="14" height="12" fill="#ffaa28"/>
    <rect x="6" y="5" width="12" height="14" fill="#ffaa28"/>
    <rect x="7" y="7" width="10" height="1" fill="#c05000" opacity="0.7"/>
    <rect x="17" y="8" width="1" height="8" fill="#c05000" opacity="0.7"/>
    <rect x="7" y="16" width="10" height="1" fill="#c05000" opacity="0.7"/>
    <rect x="7" y="8" width="1" height="8" fill="#c05000" opacity="0.7"/>
    <rect x="9" y="9" width="6" height="1" fill="#a04000" opacity="0.65"/>
    <rect x="15" y="10" width="1" height="4" fill="#a04000" opacity="0.65"/>
    <rect x="10" y="14" width="5" height="1" fill="#a04000" opacity="0.65"/>
    <rect x="9" y="10" width="1" height="5" fill="#a04000" opacity="0.65"/>
    <rect x="10" y="10" width="4" height="4" fill="#ffe060"/>
    <rect x="11" y="11" width="2" height="2" fill="#fff8a0"/>
  </svg>`;
  sky.appendChild(sunEl);

  // 像素小鸟
  const birdData = [
    { y: 10, dur: 22, delay: 0   },
    { y: 21, dur: 28, delay: -9  },
    { y: 14, dur: 18, delay: -16 },
  ];
  birdData.forEach(({ y, dur, delay }) => {
    const b = el('div', 'pixel-bird');
    b.style.cssText = `top:${y}%; --bird-dur:${dur}s; --bird-delay:${delay}s;`;
    b.innerHTML = `<svg viewBox="0 0 14 8" shape-rendering="crispEdges" width="14" height="8">
      <rect x="0" y="5" width="2" height="2" fill="#2a2a3a"/>
      <rect x="2" y="3" width="2" height="2" fill="#2a2a3a"/>
      <rect x="4" y="1" width="2" height="2" fill="#2a2a3a"/>
      <rect x="8" y="1" width="2" height="2" fill="#2a2a3a"/>
      <rect x="10" y="3" width="2" height="2" fill="#2a2a3a"/>
      <rect x="12" y="5" width="2" height="2" fill="#2a2a3a"/>
    </svg>`;
    sky.appendChild(b);
  });

  // 像素云（固定位置，不同速度）
  const clouds = [
    { x: -60,  y: 18,  dur: 35,  delay: 0   },
    { x: 80,   y: 42,  dur: 48,  delay: -12 },
    { x: 200,  y: 12,  dur: 40,  delay: -22 },
    { x: 340,  y: 38,  dur: 55,  delay: -35 },
    { x: 130,  y: 28,  dur: 42,  delay: -28 },
    { x: 290,  y: 8,   dur: 38,  delay: -18 },
  ];
  clouds.forEach(({ x, y, dur, delay }) => {
    const c = el('div', 'pixel-cloud');
    c.style.cssText = `left:${x}px; top:${y}px; --dur:${dur}s; --delay:${delay}s;`;
    sky.appendChild(c);
  });

  scene.appendChild(sky);

  // 地面/草地
  scene.appendChild(el('div', 'shore-ground'));

  // 树木
  const t1 = makeTree(); t1.style.cssText = 'position:absolute; left:12px; top:50%;';
  const t2 = makeTree(); t2.style.cssText = 'position:absolute; right:10px; top:52%;';
  scene.appendChild(t1); scene.appendChild(t2);

  // 水面
  const water = el('div', 'shore-water');
  const surf = el('div', 'water-surface');
  surf.appendChild(el('div', 'water-wave'));
  surf.appendChild(el('div', 'water-wave water-wave2'));
  water.appendChild(surf);
  water.appendChild(el('div', 'sun-sparkle'));

  // 像素水波纹
  const rippleData = [
    { l:8,  t:14, dur:2.5, delay:0   },
    { l:24, t:32, dur:3.2, delay:0.6 },
    { l:40, t:16, dur:2.8, delay:1.2 },
    { l:56, t:30, dur:3.5, delay:1.8 },
    { l:70, t:18, dur:2.6, delay:2.4 },
    { l:84, t:34, dur:3.0, delay:3.0 },
  ];
  rippleData.forEach(({ l, t, dur, delay }) => {
    const r = el('div', 'water-px-ripple');
    r.style.cssText = `left:${l}%; top:${t}%; --rdur:${dur}s; --rdelay:${delay}s;`;
    water.appendChild(r);
  });

  // 水面气泡
  for (let i = 0; i < 14; i++) {
    const b = el('div', 'shore-bubble');
    const sz = 2 + Math.floor(Math.random() * 4);
    b.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${(Math.random() * 92).toFixed(1)}%;
      top:${(8 + Math.random() * 55).toFixed(1)}%;
      --dur:${(5 + Math.random() * 6).toFixed(1)}s;
      --delay:${(Math.random() * 6).toFixed(1)}s;
    `;
    water.appendChild(b);
  }
  scene.appendChild(water);

  // 像素小人（站在岸边，放大 1.45x）
  const person = makePerson();
  person.style.cssText = 'position:absolute; bottom:27%; left:50%; transform:translateX(-50%) scale(1.45); transform-origin:bottom center;';
  scene.appendChild(person);

  // UI 面板
  const entries = loadEntries();
  const nTreasure = entries.filter(e => e.status === 'treasure').length;

  const ui = el('div', 'shore-ui');

  const titleBox = el('div', 'shore-title-box');
  const t = el('div', 'px-title'); t.textContent = '湖底打捞';
  const sub = el('div', 'subtitle'); sub.textContent = '潜入湖底，打捞你的故事';
  titleBox.appendChild(t); titleBox.appendChild(sub);
  ui.appendChild(titleBox);

  const diveBtn = el('button', 'px-btn-dive');
  diveBtn.textContent = '▼ 开始打捞';
  diveBtn.onclick = startDiving;
  ui.appendChild(diveBtn);

  const vaultBtn = el('button', 'px-btn-vault');
  vaultBtn.textContent = `◈ 珍宝库（${nTreasure}）`;
  vaultBtn.onclick = () => setState({ scene: 'vault' });
  ui.appendChild(vaultBtn);

  scene.appendChild(ui);
  return scene;
}

function makeTree() {
  const t = el('div', 'pixel-tree');
  t.innerHTML = `<div class="leaves3"></div><div class="leaves2"></div><div class="leaves"></div><div class="trunk"></div>`;
  return t;
}

function makePerson() {
  const p = el('div', 'pixel-person');
  p.innerHTML = `
    <div class="person-hair"></div>
    <div class="person-head">
      <div class="person-eye"></div>
      <div class="person-eye"></div>
      <div class="person-mouth"></div>
    </div>
    <div class="person-neck"></div>
    <div class="person-body">
      <div class="person-arm"></div>
      <div class="person-torso"></div>
      <div class="person-arm"></div>
    </div>
    <div class="person-legs">
      <div class="person-leg"></div>
      <div class="person-leg"></div>
    </div>
    <div class="person-feet">
      <div class="person-foot"></div>
      <div class="person-foot"></div>
    </div>
  `;
  return p;
}

// ===== 下潛/上岸過渡 =====
function renderTransition(type) {
  const scene = el('div', 'scene', { id: 'scene-transition' });
  const bWrap = el('div', 'transition-bubbles');
  spawnBubbles(bWrap, 20);
  scene.appendChild(bWrap);

  const person = makePerson();
  person.classList.add('transition-person');
  if (type === 'surfacing') person.classList.add('surfacing');
  person.style.position = 'relative';
  scene.appendChild(person);

  const txt = el('div', 'transition-text');
  txt.textContent = type === 'diving' ? '正在下潜...\n探索湖底的秘密' : '正在上岸...\n带着你的收获';
  scene.appendChild(txt);

  setTimeout(() => setState({ scene: type === 'diving' ? 'underwater' : 'classify' }),
    type === 'diving' ? 1600 : 1200);
  return scene;
}

// ===== 水下場景 =====
function renderUnderwater() {
  const scene = el('div', 'scene', { id: 'scene-underwater' });

  // 氣泡粒子層
  const pLayer = el('div', 'bubble-particle-layer');
  spawnBubbles(pLayer, 26);
  scene.appendChild(pLayer);

  // 背景裝飾
  const bg = el('div', 'underwater-bg');
  [50, 170, 320].forEach((left, i) => {
    const ray = el('div', 'light-ray');
    ray.style.cssText = `left:${left}px; height:${210+i*55}px; transform:rotate(${(i-1)*7}deg);`;
    bg.appendChild(ray);
  });
  [18,38,62,88,110,330,368,402,438,462].forEach((left, i) => {
    const w = el('div', 'seaweed');
    w.style.cssText = `left:${left}px; height:${28+Math.floor(Math.random()*52)}px; animation-delay:${(i*.3)%2}s;`;
    bg.appendChild(w);
  });
  ['#e87060','#60c0ee','#eed050'].forEach((col, i) => {
    const f = el('div', 'pixel-fish');
    f.style.cssText = `top:${130+i*88}px; left:${28+i*118}px; background:${col}; animation-delay:${i*.9}s; animation-duration:${2.8+i*.6}s;`;
    const tail = el('div', 'pixel-fish-tail');
    tail.style.borderRightColor = col;
    f.appendChild(tail);
    bg.appendChild(f);
  });
  scene.appendChild(bg);

  const hint = el('div', 'underwater-hint');
  hint.textContent = '点击一个容器，打捞你的故事';
  scene.appendChild(hint);

  const diver = makePerson();
  diver.classList.add('underwater-diver');
  diver.style.position = 'absolute';
  scene.appendChild(diver);

  // 容器
  if (!state.containers.length) state.containers = pickRandomContainers(3);
  const row = el('div', 'container-row');
  [2.4, 3.1, 2.7].forEach((dur, i) => {
    const c = state.containers[i];
    const wrap = el('div', 'treasure-container');
    wrap.style.setProperty('--bob-dur',   dur + 's');
    wrap.style.setProperty('--bob-delay', [0, .6, 1.2][i] + 's');
    wrap.style.setProperty('--glow-col',  c.glowColor);
    const body = el('div', 'container-body');
    body.style.background = hexToRgba(c.color, 0.1);
    body.innerHTML = c.svg;
    const label = el('div', 'container-label'); label.textContent = c.label;
    wrap.appendChild(body); wrap.appendChild(label);
    wrap.onclick = () => selectContainer(c, wrap, body);
    row.appendChild(wrap);
  });
  scene.appendChild(row);
  return scene;
}

function spawnBubbles(parent, n) {
  for (let i = 0; i < n; i++) {
    const b = el('div', 'bubble');
    const sz = 1 + Math.floor(Math.random() * 5);
    b.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${(Math.random()*95).toFixed(1)}%;
      bottom:${(Math.random()*70).toFixed(1)}%;
      animation-delay:${(Math.random()*4).toFixed(1)}s;
      animation-duration:${(3+Math.random()*4).toFixed(1)}s;
    `;
    parent.appendChild(b);
  }
}

function selectContainer(container, wrap, body) {
  if (state.selectedContainer) return;
  SFX_BUBBLE();
  wrap.classList.add('opening'); body.classList.add('glow');
  setTimeout(() => setState({
    selectedContainer: container,
    currentPrompt: pickRandomPrompt(),
    draftText: '', scene: 'writing',
  }), 600);
}

// ===== 寫作場景 =====
function renderWriting() {
  const c = state.selectedContainer;
  const scene = el('div', 'scene', { id: 'scene-writing' });

  const header = el('div', 'writing-header');
  const iconW = el('div', 'writing-container-icon'); iconW.innerHTML = c.svg;
  const title = el('div', 'px-title');
  title.style.cssText = 'font-size:8px; color:#6a8aaa; flex:1;';
  title.textContent = `打捞到一个${c.label}`;
  header.appendChild(iconW); header.appendChild(title);
  scene.appendChild(header);

  const pBox = el('div', 'writing-prompt-box');
  const pLabel = el('div', 'writing-prompt-label'); pLabel.textContent = '— 命题 —';
  const pText  = el('div', 'writing-prompt-text');  pText.textContent  = state.currentPrompt;
  pBox.appendChild(pLabel); pBox.appendChild(pText);
  scene.appendChild(pBox);

  const aWrap   = el('div', 'writing-area-wrap');
  const textarea = el('textarea', 'writing-textarea');
  textarea.placeholder = '在这里写下你的文字…';
  textarea.value = state.draftText;

  const footer   = el('div', 'writing-footer');
  const cntWrap  = el('div', '');
  const cntEl    = el('div', 'word-count');
  const hintEl   = el('div', 'word-count-hint');
  updateCount(cntEl, hintEl, state.draftText.trim().length);
  cntWrap.appendChild(cntEl); cntWrap.appendChild(hintEl);

  const submitBtn = el('button', 'px-btn');
  submitBtn.style.fontSize = '8px'; submitBtn.textContent = '▲ 上岸';
  const setOk = ok => {
    submitBtn.disabled = !ok;
    submitBtn.style.opacity = ok ? '1' : '0.4';
    submitBtn.style.cursor  = ok ? 'pointer' : 'not-allowed';
  };
  setOk(state.draftText.trim().length >= 20);

  textarea.oninput = () => {
    state.draftText = textarea.value;
    const len = textarea.value.trim().length;
    updateCount(cntEl, hintEl, len); setOk(len >= 20);
  };
  submitBtn.onclick = () => { if (state.draftText.trim().length >= 20) setState({ scene: 'surfacing' }); };

  footer.appendChild(cntWrap); footer.appendChild(submitBtn);
  aWrap.appendChild(textarea); aWrap.appendChild(footer);
  scene.appendChild(aWrap);
  setTimeout(() => textarea.focus(), 100);
  return scene;
}

function updateCount(cntEl, hintEl, len) {
  const ok = len >= 20;
  cntEl.className = 'word-count' + (ok ? ' ok' : '');
  cntEl.textContent = `${len} 字`;
  hintEl.textContent = ok ? '可以上岸了！' : `再写 ${20-len} 字可上岸`;
  hintEl.style.color = ok ? '#3acc3a' : '#2a3a4a';
}

// ===== 分類場景 =====
function renderClassify() {
  const scene = el('div', 'scene', { id: 'scene-classify' });

  const hdr = el('div', 'classify-header');
  hdr.textContent = '你打捞上来了一段文字\n要放进哪里呢？';
  scene.appendChild(hdr);

  const card = el('div', 'classify-card');
  const cp = el('div', 'classify-card-prompt'); cp.textContent = `命题：${state.currentPrompt}`;
  const cc = el('div', 'classify-card-content'); cc.textContent = state.draftText;
  card.appendChild(cp); card.appendChild(cc);
  scene.appendChild(card);

  const actions = el('div', 'classify-actions');

  const trashBtn = el('button', 'px-btn danger');
  const ti = el('span', 'classify-btn-icon');
  ti.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14" shape-rendering="crispEdges" width="28" height="28">
    <rect x="4" y="0" width="4" height="1" fill="#ff9090"/>
    <rect x="1" y="1" width="10" height="2" fill="#ffb0b0"/>
    <rect x="1" y="1" width="10" height="1" fill="#ffd0d0"/>
    <rect x="2" y="3" width="1" height="10" fill="#ee8888"/>
    <rect x="9" y="3" width="1" height="10" fill="#dd7070"/>
    <rect x="2" y="12" width="8" height="1" fill="#ee8888"/>
    <rect x="3" y="3" width="6" height="9" fill="#ffaaaa"/>
    <rect x="3" y="3" width="6" height="1" fill="#ffcccc" opacity=".6"/>
    <rect x="4" y="4" width="1" height="7" fill="#cc5555" opacity=".6"/>
    <rect x="7" y="4" width="1" height="7" fill="#cc5555" opacity=".6"/>
  </svg>`;
  trashBtn.appendChild(ti); trashBtn.appendChild(document.createTextNode('废纸篓'));
  trashBtn.onclick = () => classifyEntry('trash');

  const treasureBtn = el('button', 'px-btn treasure');
  const gi = el('span', 'classify-btn-icon');
  gi.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14" shape-rendering="crispEdges" width="28" height="28">
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
  treasureBtn.appendChild(gi); treasureBtn.appendChild(document.createTextNode('珍宝'));
  treasureBtn.onclick = () => classifyEntry('treasure');

  actions.appendChild(trashBtn); actions.appendChild(treasureBtn);
  scene.appendChild(actions);
  return scene;
}

function classifyEntry(status) {
  if (status === 'treasure') SFX_GOLD();
  saveEntry({
    id: Date.now(),
    prompt: state.currentPrompt,
    content: state.draftText,
    container: state.selectedContainer.id,
    containerSvg: state.selectedContainer.svg,
    status,
    date: new Date().toLocaleDateString('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit' }),
  });
  setState({ scene:'shore', containers:[], selectedContainer:null, currentPrompt:'', draftText:'' });
}

// ============================================================
// ===== 珍寶庫 =====
// ============================================================
function renderVault() {
  const scene = el('div', 'scene', { id: 'scene-vault' });

  const entries = loadEntries().filter(e => e.status === 'treasure');
  const trashCount = loadEntries().filter(e => e.status === 'trash').length;

  // Header
  const hdr = el('div', 'vault-header');
  const vt = el('div', 'vault-title');
  vt.innerHTML = `${SVG_PARCHMENT.replace('viewBox="0 0 12 14"', 'viewBox="0 0 12 14" width="18" height="18"')} 珍宝库`;
  const vc = el('div', 'vault-count'); vc.textContent = `共 ${entries.length} 件`;
  hdr.appendChild(vt); hdr.appendChild(vc);
  scene.appendChild(hdr);

  // 列表
  if (entries.length === 0) {
    const empty = el('div', 'vault-empty');
    empty.innerHTML = `<div style="font-size:36px">🌊</div><div>珍宝库空空如也<br>去湖底打捞吧</div>`;
    scene.appendChild(empty);
  } else {
    const list = el('div', 'vault-list');
    groupByDate(entries).forEach(({ date, items }) => {
      const grp = el('div', 'vault-date-group');
      const dl = el('div', 'vault-date-label'); dl.textContent = date;
      grp.appendChild(dl);
      items.forEach(entry => grp.appendChild(makeVaultCard(entry, scene)));
      list.appendChild(grp);
    });
    scene.appendChild(list);
  }

  // Footer：返回 + 廢紙簍入口
  const footer = el('div', 'vault-footer');

  const backBtn = el('button', 'px-btn secondary');
  backBtn.style.cssText = 'width:100%; font-size:8px;';
  backBtn.textContent = '← 回到湖边';
  backBtn.onclick = () => setState({ scene:'shore' });
  footer.appendChild(backBtn);

  const trashLink = el('button', 'px-btn-trash-link');
  const trashIconSpan = el('span', '');
  trashIconSpan.style.cssText = 'display:inline-flex;align-items:center;';
  trashIconSpan.innerHTML = SVG_TRASH.replace('viewBox="0 0 12 14"', 'viewBox="0 0 12 14" width="14" height="14"');
  trashLink.appendChild(trashIconSpan);
  trashLink.appendChild(document.createTextNode(` 废纸篓（${trashCount}）`));
  trashLink.onclick = () => setState({ scene:'trash' });
  footer.appendChild(trashLink);

  scene.appendChild(footer);
  return scene;
}

function makeVaultCard(entry, scene) {
  const card = el('div', 'vault-entry');

  // 頂部：命題 + 丟棄按鈕
  const top = el('div', 'vault-entry-top');
  const prompt = el('div', 'vault-entry-prompt'); prompt.textContent = entry.prompt;

  const discardBtn = el('button', 'px-btn-discard');
  discardBtn.innerHTML = SVG_TRASH.replace('viewBox="0 0 12 14"', 'viewBox="0 0 12 14" width="12" height="12"');
  discardBtn.title = '丢弃';
  discardBtn.onclick = e => { e.stopPropagation(); discardEntry(entry.id); };

  top.appendChild(prompt); top.appendChild(discardBtn);
  card.appendChild(top);

  // 內容預覽
  const preview = el('div', 'vault-entry-preview');
  if (entry.containerSvg) {
    const iw = el('span', 'vault-entry-icon');
    iw.innerHTML = entry.containerSvg;
    const svg = iw.querySelector('svg');
    if (svg) svg.style.cssText = 'width:14px;height:14px;vertical-align:middle;';
    preview.appendChild(iw);
  }
  preview.appendChild(document.createTextNode(entry.content));
  card.appendChild(preview);

  // 底部：日期
  const bottom = el('div', 'vault-entry-bottom');
  const dateEl = el('div', 'vault-entry-date'); dateEl.textContent = entry.date || '';
  bottom.appendChild(dateEl);
  card.appendChild(bottom);

  // 點擊展開詳情
  card.onclick = () => showDetail(entry, scene);
  return card;
}

function discardEntry(id) {
  SFX_PAPER();
  setEntryStatus(id, 'trash');
  setState({ scene: 'vault' });
}

// ============================================================
// ===== 廢紙簍 =====
// ============================================================
function renderTrash() {
  const scene = el('div', 'scene', { id: 'scene-trash' });

  const entries = loadEntries().filter(e => e.status === 'trash');

  // Header
  const hdr = el('div', 'trash-header');
  const tt = el('div', 'trash-title');
  tt.innerHTML = `${SVG_TRASH.replace('viewBox="0 0 12 14"', 'viewBox="0 0 12 14" width="16" height="16"')} 废纸篓`;
  const tc = el('div', 'trash-count'); tc.textContent = `共 ${entries.length} 件`;
  hdr.appendChild(tt); hdr.appendChild(tc);
  scene.appendChild(hdr);

  // 列表
  if (entries.length === 0) {
    const empty = el('div', 'trash-empty');
    empty.innerHTML = `<div style="font-size:36px">✨</div><div>废纸篓是空的</div>`;
    scene.appendChild(empty);
  } else {
    const list = el('div', 'trash-list');
    groupByDate(entries).forEach(({ date, items }) => {
      const grp = el('div', 'vault-date-group');
      const dl = el('div', 'trash-date-label'); dl.textContent = date;
      grp.appendChild(dl);
      items.forEach(entry => grp.appendChild(makeTrashCard(entry, scene)));
      list.appendChild(grp);
    });
    scene.appendChild(list);
  }

  // Footer
  const footer = el('div', 'trash-footer');
  const backBtn = el('button', 'px-btn secondary');
  backBtn.style.cssText = 'width:100%; font-size:8px;';
  backBtn.textContent = '← 返回珍宝库';
  backBtn.onclick = () => setState({ scene: 'vault' });
  footer.appendChild(backBtn);
  scene.appendChild(footer);
  return scene;
}

function makeTrashCard(entry, scene) {
  const card = el('div', 'trash-entry');

  const top = el('div', 'trash-entry-top');
  const prompt = el('div', 'trash-entry-prompt'); prompt.textContent = entry.prompt;

  const restoreBtn = el('button', 'px-btn-restore');
  restoreBtn.innerHTML = SVG_PARCHMENT.replace('viewBox="0 0 12 14"', 'viewBox="0 0 12 14" width="12" height="12"');
  restoreBtn.title = '移入珍宝';
  restoreBtn.onclick = e => { e.stopPropagation(); restoreEntry(entry.id); };

  top.appendChild(prompt); top.appendChild(restoreBtn);
  card.appendChild(top);

  const preview = el('div', 'trash-entry-preview');
  preview.textContent = entry.content;
  card.appendChild(preview);

  const bottom = el('div', 'trash-entry-bottom');
  const dateEl = el('div', 'trash-entry-date'); dateEl.textContent = entry.date || '';
  bottom.appendChild(dateEl);
  card.appendChild(bottom);

  card.onclick = () => showDetail(entry, scene);
  return card;
}

function restoreEntry(id) {
  SFX_GOLD();
  setEntryStatus(id, 'treasure');
  setState({ scene: 'trash' });
}

// ===== 條目詳情遮罩 =====
function showDetail(entry, scene) {
  const ov = el('div', 'entry-detail-overlay');

  const p = el('div', 'entry-detail-prompt'); p.textContent = `命题：${entry.prompt}`;
  ov.appendChild(p);

  const c = el('div', 'entry-detail-content'); c.textContent = entry.content;
  ov.appendChild(c);

  const m = el('div', 'entry-detail-meta'); m.textContent = entry.date || '';
  ov.appendChild(m);

  const closeBtn = el('button', 'px-btn secondary');
  closeBtn.textContent = '← 返回'; closeBtn.onclick = () => ov.remove();
  ov.appendChild(closeBtn);

  scene.appendChild(ov);
}

// ===== 主流程 =====
function startDiving() {
  SFX_BUBBLE();
  setState({ scene:'diving', containers:[] });
}

// ===== 工具 =====
function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

function groupByDate(entries) {
  const map = {};
  entries.forEach(e => (map[e.date || '未知日期'] = map[e.date || '未知日期'] || []).push(e));
  return Object.keys(map).map(date => ({ date, items: map[date] }));
}

// ===== 啟動 =====
render();
