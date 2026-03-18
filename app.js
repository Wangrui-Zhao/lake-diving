import {
  CONTAINER_TYPES,
  loadEntries,
  saveEntry,
  pickRandomPrompt,
  pickRandomContainers,
} from './data.js';

// ===== 状态 =====
let state = {
  scene: 'shore',           // shore | diving | underwater | writing | surfacing | classify | vault
  containers: [],           // 当前水下容器
  selectedContainer: null,  // 已选容器
  currentPrompt: '',        // 当前命题
  draftText: '',            // 草稿
  detailEntry: null,        // 珍宝库展开的条目
};

// ===== 渲染调度 =====
function setState(patch) {
  Object.assign(state, patch);
  render();
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  switch (state.scene) {
    case 'shore':      app.appendChild(renderShore());      break;
    case 'diving':     app.appendChild(renderTransition('diving'));  break;
    case 'underwater': app.appendChild(renderUnderwater()); break;
    case 'writing':    app.appendChild(renderWriting());    break;
    case 'surfacing':  app.appendChild(renderTransition('surfacing')); break;
    case 'classify':   app.appendChild(renderClassify());  break;
    case 'vault':      app.appendChild(renderVault());     break;
  }
}

// ===== 湖边场景 =====
function renderShore() {
  const scene = el('div', 'scene', {id: 'scene-shore'});

  // 天空装饰
  const sky = el('div', 'shore-sky');

  const sun = el('div', 'shore-sun');
  sky.appendChild(sun);

  // 两朵云
  sky.appendChild(makeCloud(40, 50));
  sky.appendChild(makeCloud(230, 30));
  scene.appendChild(sky);

  // 草地
  const grass = el('div', 'shore-grass');
  scene.appendChild(grass);

  // 树
  const tree1 = makeTree();
  tree1.style.left = '20px';
  tree1.style.top = '38%';
  const tree2 = makeTree();
  tree2.style.right = '20px';
  tree2.style.top = '40%';
  scene.appendChild(tree1);
  scene.appendChild(tree2);

  // 水面
  const water = el('div', 'shore-water');
  const wSurf = el('div', 'water-surface');
  const wave1 = el('div', 'water-wave');
  const wave2 = el('div', 'water-wave water-wave2');
  wSurf.appendChild(wave1);
  wSurf.appendChild(wave2);
  water.appendChild(wSurf);
  scene.appendChild(water);

  // 小人
  const person = makePerson();
  person.className = 'pixel-person';
  person.style.bottom = '47%';
  person.style.left = '50%';
  person.style.transform = 'translateX(-50%)';
  scene.appendChild(person);

  // UI 面板
  const entries = loadEntries();
  const treasureCount = entries.filter(e => e.status === 'treasure').length;

  const ui = el('div', 'shore-ui');

  const titleBox = el('div', 'shore-title-box');
  const titleText = el('div', 'px-title');
  titleText.textContent = '湖底打捞';
  const subtitle = el('div', 'subtitle');
  subtitle.textContent = '潜入湖底，打捞你的故事';
  titleBox.appendChild(titleText);
  titleBox.appendChild(subtitle);
  ui.appendChild(titleBox);

  const diveBtn = el('button', 'px-btn');
  diveBtn.textContent = '▼ 开始打捞';
  diveBtn.onclick = startDiving;
  ui.appendChild(diveBtn);

  const vaultBtn = el('button', 'px-btn secondary');
  vaultBtn.textContent = `✦ 珍宝库 (${treasureCount})`;
  vaultBtn.onclick = () => setState({ scene: 'vault' });
  ui.appendChild(vaultBtn);

  scene.appendChild(ui);
  return scene;
}

function makeCloud(left, top) {
  const c = el('div', 'cloud');
  c.style.cssText = `
    position:absolute; left:${left}px; top:${top}px;
    width:48px; height:16px; border-radius:2px;
  `;
  c.style.setProperty('--dummy', '');
  // 用 box-shadow 模拟像素云
  c.style.boxShadow = '12px -12px 0 #fff, 24px -12px 0 #fff, 36px -12px 0 #fff, 12px 0 0 #fff, 48px 0 0 #fff';
  return c;
}

function makeTree() {
  const t = el('div', 'pixel-tree');
  t.style.position = 'absolute';
  t.innerHTML = `
    <div class="leaves2"></div>
    <div class="leaves"></div>
    <div class="trunk"></div>
  `;
  return t;
}

function makePerson() {
  const p = el('div', 'pixel-person');
  p.innerHTML = `
    <div class="person-head"></div>
    <div class="person-body"></div>
    <div class="person-legs">
      <div class="person-leg"></div>
      <div class="person-leg"></div>
    </div>
  `;
  return p;
}

// ===== 下潜/上岸过渡 =====
function renderTransition(type) {
  const scene = el('div', 'scene', {id: 'scene-transition'});

  // 气泡
  const bubbles = el('div', 'transition-bubbles');
  for (let i = 0; i < 12; i++) {
    const b = el('div', 'bubble');
    const size = 4 + Math.random() * 12;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 90}%;
      bottom:${Math.random() * 60}%;
      animation-delay:${Math.random() * 2}s;
      animation-duration:${1.5 + Math.random() * 2}s;
    `;
    bubbles.appendChild(b);
  }
  scene.appendChild(bubbles);

  // 小人
  const person = makePerson();
  person.className = 'pixel-person transition-person' + (type === 'surfacing' ? ' surfacing' : '');
  person.style.position = 'relative';
  scene.appendChild(person);

  // 文字
  const txt = el('div', 'transition-text');
  txt.textContent = type === 'diving' ? '正在下潜...\n探索湖底的秘密' : '正在上岸...\n带着你的收获';
  scene.appendChild(txt);

  // 自动跳转
  const nextScene = type === 'diving' ? 'underwater' : 'classify';
  const delay = type === 'diving' ? 1600 : 1200;
  setTimeout(() => setState({ scene: nextScene }), delay);

  return scene;
}

// ===== 水下场景 =====
function renderUnderwater() {
  const scene = el('div', 'scene', {id: 'scene-underwater'});

  // 背景装饰
  const bg = el('div', 'underwater-bg');

  // 光束
  [60, 180, 340].forEach((left, i) => {
    const ray = el('div', 'light-ray');
    ray.style.cssText = `left:${left}px; height:${250 + i*40}px; transform:rotate(${(i-1)*8}deg);`;
    bg.appendChild(ray);
  });

  // 水草
  [30, 60, 90, 360, 400, 440].forEach(left => {
    const w = el('div', 'seaweed');
    w.style.cssText = `left:${left}px; height:${40 + Math.random() * 60}px;`;
    bg.appendChild(w);
  });

  // 小鱼
  ['🐠', '🐟', '🐡'].forEach((fish, i) => {
    const f = el('div', 'fish');
    f.textContent = fish;
    f.style.cssText = `
      top:${120 + i * 80}px;
      left:${20 + i * 130}px;
      animation-delay:${i * 0.8}s;
      animation-duration:${2 + i * 0.5}s;
      font-size:${14 + i * 4}px;
    `;
    bg.appendChild(f);
  });

  scene.appendChild(bg);

  // 提示
  const hint = el('div', 'underwater-hint');
  hint.textContent = '点击一个容器，打捞你的故事';
  scene.appendChild(hint);

  // 水下小人
  const diver = makePerson();
  diver.className = 'pixel-person underwater-diver';
  diver.style.cssText = 'position:absolute; top:60px; left:50%; transform:translateX(-50%);';
  scene.appendChild(diver);

  // 容器
  if (state.containers.length === 0) {
    state.containers = pickRandomContainers(3);
  }

  const row = el('div', 'container-row');
  const bobDurations = [2.4, 3.1, 2.7];
  const bobDelays = [0, 0.6, 1.2];

  state.containers.forEach((c, i) => {
    const wrap = el('div', 'treasure-container');
    wrap.style.setProperty('--bob-dur', bobDurations[i] + 's');
    wrap.style.setProperty('--bob-delay', bobDelays[i] + 's');

    const body = el('div', 'container-body');
    body.style.background = hexToRgba(c.color, 0.2);
    body.textContent = c.emoji;

    const label = el('div', 'container-label');
    label.textContent = c.label;

    wrap.appendChild(body);
    wrap.appendChild(label);

    wrap.onclick = () => selectContainer(c, wrap, body);
    row.appendChild(wrap);
  });

  scene.appendChild(row);

  // 气泡
  for (let i = 0; i < 8; i++) {
    const b = el('div', 'bubble');
    const size = 3 + Math.random() * 8;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${10 + Math.random() * 80}%;
      bottom:${10 + Math.random() * 40}%;
      animation-delay:${Math.random() * 3}s;
      animation-duration:${2 + Math.random() * 3}s;
    `;
    scene.appendChild(b);
  }

  return scene;
}

function selectContainer(container, wrap, body) {
  // 防重复点击
  if (state.selectedContainer) return;

  const prompt = pickRandomPrompt();
  wrap.classList.add('opening');
  body.classList.add('glow');

  setTimeout(() => {
    setState({
      selectedContainer: container,
      currentPrompt: prompt,
      draftText: '',
      scene: 'writing',
    });
  }, 600);
}

// ===== 写作场景 =====
function renderWriting() {
  const c = state.selectedContainer;
  const scene = el('div', 'scene', {id: 'scene-writing'});

  // 顶部
  const header = el('div', 'writing-header');
  const icon = el('div', 'writing-container-icon');
  icon.textContent = c.emoji;
  const title = el('div', 'px-title');
  title.style.cssText = 'font-size:8px; color:#aaa; flex:1;';
  title.textContent = `打捞到一个${c.label}`;
  header.appendChild(icon);
  header.appendChild(title);
  scene.appendChild(header);

  // 命题框
  const promptBox = el('div', 'writing-prompt-box');
  const promptLabel = el('div', 'writing-prompt-label');
  promptLabel.textContent = '— 命题 —';
  const promptText = el('div', 'writing-prompt-text');
  promptText.textContent = state.currentPrompt;
  promptBox.appendChild(promptLabel);
  promptBox.appendChild(promptText);
  scene.appendChild(promptBox);

  // 写作区
  const areaWrap = el('div', 'writing-area-wrap');
  const textarea = el('textarea', 'writing-textarea');
  textarea.placeholder = '在这里写下你的文字…';
  textarea.value = state.draftText;

  const footer = el('div', 'writing-footer');
  const countWrap = el('div', '');
  const countEl = el('div', 'word-count');
  const hintEl = el('div', 'word-count-hint');
  updateCount(countEl, hintEl, state.draftText.trim().length);
  countWrap.appendChild(countEl);
  countWrap.appendChild(hintEl);

  const submitBtn = el('button', 'px-btn');
  submitBtn.style.fontSize = '8px';
  submitBtn.textContent = '▲ 上岸';
  submitBtn.disabled = state.draftText.trim().length < 20;
  if (state.draftText.trim().length < 20) {
    submitBtn.style.opacity = '0.4';
    submitBtn.style.cursor = 'not-allowed';
  }

  textarea.oninput = () => {
    state.draftText = textarea.value;
    const len = textarea.value.trim().length;
    updateCount(countEl, hintEl, len);
    const ok = len >= 20;
    submitBtn.disabled = !ok;
    submitBtn.style.opacity = ok ? '1' : '0.4';
    submitBtn.style.cursor = ok ? 'pointer' : 'not-allowed';
  };

  submitBtn.onclick = () => {
    if (state.draftText.trim().length >= 20) {
      setState({ scene: 'surfacing' });
    }
  };

  footer.appendChild(countWrap);
  footer.appendChild(submitBtn);
  areaWrap.appendChild(textarea);
  areaWrap.appendChild(footer);
  scene.appendChild(areaWrap);

  // 自动聚焦
  setTimeout(() => textarea.focus(), 100);

  return scene;
}

function updateCount(countEl, hintEl, len) {
  const ok = len >= 20;
  countEl.className = 'word-count' + (ok ? ' ok' : '');
  countEl.textContent = `${len} 字`;
  hintEl.textContent = ok ? '可以上岸了！' : `再写 ${20 - len} 字可上岸`;
  hintEl.style.color = ok ? '#5dd45d' : '#555';
}

// ===== 分类场景 =====
function renderClassify() {
  const scene = el('div', 'scene', {id: 'scene-classify'});

  const header = el('div', 'classify-header');
  header.textContent = '你打捞上来了一段文字\n要放进哪里呢？';
  scene.appendChild(header);

  const card = el('div', 'classify-card');
  const cardPrompt = el('div', 'classify-card-prompt');
  cardPrompt.textContent = `命题：${state.currentPrompt}`;
  const cardContent = el('div', 'classify-card-content');
  cardContent.textContent = state.draftText;
  card.appendChild(cardPrompt);
  card.appendChild(cardContent);
  scene.appendChild(card);

  const actions = el('div', 'classify-actions');

  const trashBtn = el('button', 'px-btn danger');
  const trashIcon = el('span', 'classify-btn-icon');
  trashIcon.textContent = '🗑';
  trashBtn.appendChild(trashIcon);
  trashBtn.appendChild(document.createTextNode('废纸篓'));
  trashBtn.onclick = () => classify('trash');

  const treasureBtn = el('button', 'px-btn treasure');
  const treasureIcon = el('span', 'classify-btn-icon');
  treasureIcon.textContent = '💎';
  treasureBtn.appendChild(treasureIcon);
  treasureBtn.appendChild(document.createTextNode('珍宝'));
  treasureBtn.onclick = () => classify('treasure');

  actions.appendChild(trashBtn);
  actions.appendChild(treasureBtn);
  scene.appendChild(actions);

  return scene;
}

function classify(status) {
  const entry = {
    id: Date.now(),
    prompt: state.currentPrompt,
    content: state.draftText,
    container: state.selectedContainer.id,
    containerEmoji: state.selectedContainer.emoji,
    status,
    date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }),
  };
  saveEntry(entry);

  // 重置打捞状态
  setState({
    scene: 'shore',
    containers: [],
    selectedContainer: null,
    currentPrompt: '',
    draftText: '',
  });
}

// ===== 珍宝库 =====
function renderVault() {
  const scene = el('div', 'scene', {id: 'scene-vault'});

  const entries = loadEntries().filter(e => e.status === 'treasure');

  // 顶部
  const header = el('div', 'vault-header');
  const title = el('div', 'vault-title');
  title.textContent = '✦ 珍宝库';
  const count = el('div', 'vault-count');
  count.textContent = `共 ${entries.length} 件`;
  header.appendChild(title);
  header.appendChild(count);
  scene.appendChild(header);

  if (entries.length === 0) {
    const empty = el('div', 'vault-empty');
    const icon = el('div', 'vault-empty-icon');
    icon.textContent = '🌊';
    const txt = el('div', '');
    txt.textContent = '珍宝库空空如也\n去湖底打捞吧';
    empty.appendChild(icon);
    empty.appendChild(txt);
    scene.appendChild(empty);
  } else {
    const list = el('div', 'vault-list');

    // 按日期分组
    const groups = {};
    entries.forEach(e => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });

    Object.keys(groups).forEach(date => {
      const group = el('div', 'vault-date-group');
      const dateLabel = el('div', 'vault-date-label');
      dateLabel.textContent = date;
      group.appendChild(dateLabel);

      groups[date].forEach(entry => {
        const card = el('div', 'vault-entry');
        const promptEl = el('div', 'vault-entry-prompt');
        promptEl.textContent = entry.prompt;
        const preview = el('div', 'vault-entry-preview');
        const icon = el('span', 'vault-entry-icon');
        icon.textContent = entry.containerEmoji || '💎';
        preview.appendChild(icon);
        preview.appendChild(document.createTextNode(entry.content));
        card.appendChild(promptEl);
        card.appendChild(preview);
        card.onclick = () => showEntryDetail(entry, scene);
        group.appendChild(card);
      });

      list.appendChild(group);
    });

    scene.appendChild(list);
  }

  // 底部按钮
  const footer = el('div', 'vault-footer');
  const backBtn = el('button', 'px-btn secondary');
  backBtn.style.width = '100%';
  backBtn.textContent = '← 回到湖边';
  backBtn.onclick = () => setState({ scene: 'shore' });
  footer.appendChild(backBtn);
  scene.appendChild(footer);

  return scene;
}

function showEntryDetail(entry, scene) {
  const overlay = el('div', 'entry-detail-overlay');

  const promptEl = el('div', 'entry-detail-prompt');
  promptEl.textContent = `命题：${entry.prompt}`;
  overlay.appendChild(promptEl);

  const contentEl = el('div', 'entry-detail-content');
  contentEl.textContent = entry.content;
  overlay.appendChild(contentEl);

  const meta = el('div', 'entry-detail-meta');
  meta.textContent = `${entry.containerEmoji || '💎'}  ${entry.date}`;
  overlay.appendChild(meta);

  const closeBtn = el('button', 'px-btn secondary');
  closeBtn.textContent = '← 返回';
  closeBtn.onclick = () => overlay.remove();
  overlay.appendChild(closeBtn);

  scene.appendChild(overlay);
}

// ===== 主流程 =====
function startDiving() {
  setState({ scene: 'diving', containers: [] });
}

// ===== 工具函数 =====
function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ===== 启动 =====
render();
