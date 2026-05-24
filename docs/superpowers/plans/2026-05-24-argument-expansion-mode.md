# 论点展开专项训练 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有口才训练 App 中新增「论点展开」专项训练模式——用户获得一句观点，专注于"把观点展开成完整论述"的训练。

**Architecture:** 单文件 `app.html` 修改。新增 2 个 screen (`s-exp-source`, `s-exp-ready`)，修改现有 screen (`s-rec`, `s-result`, `s-home`)，新增约 300 行 JS 逻辑。2 次 AI 调用（论点提取 → 展开方向生成），评分时 1 次 AI 调用（含展开示范）。

**Tech Stack:** 纯 HTML/CSS/JS，无框架。LLM 调用复用现有 `callLLM()`。

---

### Task 1: 新增 CSS 样式

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html:252`（在 `/* ── CALENDAR ── */` 之前插入）

- [ ] **Step 1: 在 CSS 中插入展开模式样式**

在 line 251（`.hint` 规则之后）插入：

```css
/* ── EXPANSION MODE ── */
.exp-source-card {
  background: var(--card); border-radius: var(--r); padding: 18px;
  cursor: pointer; transition: opacity .15s;
  border: 1.5px solid transparent;
}
.exp-source-card:active { opacity: .7; }
.exp-source-card.selected { border-color: var(--gold); }
.exp-source-icon { font-size: 28px; margin-bottom: 6px; }
#exp-arg-text {
  font-size: 20px; font-weight: 700; line-height: 1.4; color: var(--gold);
  text-align: center; padding: 16px 12px;
  background: rgba(212,168,67,.08); border-radius: 12px;
  border: 1px solid rgba(212,168,67,.2);
}
#exp-dirs { display: flex; flex-direction: column; gap: 8px; }
.exp-dir-item {
  font-size: 13px; color: var(--muted); line-height: 1.5;
  padding: 10px 14px; background: var(--card2); border-radius: 10px;
  border-left: 2px solid var(--gold);
}
#exp-rec-bar {
  display: none; background: var(--card); border-radius: 12px; padding: 10px 12px;
  margin-bottom: 4px;
}
#exp-rec-bar .exp-rec-arg {
  font-size: 14px; font-weight: 600; color: var(--gold); line-height: 1.3;
  margin-bottom: 6px;
}
#exp-rec-bar .exp-rec-dir {
  font-size: 10px; color: var(--muted); line-height: 1.4;
}
#exp-dur-options { display: flex; gap: 8px; justify-content: center; }
.exp-dur-btn {
  padding: 8px 18px; border-radius: 8px; border: 1px solid #333;
  background: var(--card2); color: var(--muted); font-size: 14px; cursor: pointer;
}
.exp-dur-btn.active { background: var(--gold); color: #000; border-color: var(--gold); font-weight: 600; }
.exp-domain-chip {
  padding: 5px 12px; border-radius: 8px; border: 1px solid #333;
  background: var(--card2); color: var(--muted); font-size: 12px; cursor: pointer;
}
.exp-domain-chip.active { background: var(--gold); color: #000; border-color: var(--gold); }
.exp-diff-chip {
  padding: 5px 12px; border-radius: 8px; border: 1px solid #333;
  background: var(--card2); color: var(--muted); font-size: 12px; cursor: pointer;
}
.exp-diff-chip.active { background: var(--gold); color: #000; border-color: var(--gold); }
#exp-claim-list { display: flex; flex-direction: column; gap: 8px; }
.exp-claim-item {
  padding: 14px; background: var(--card2); border-radius: 10px; cursor: pointer;
  font-size: 15px; font-weight: 500; line-height: 1.4;
  border: 1.5px solid transparent; transition: all .15s;
}
.exp-claim-item:active { opacity: .7; }
.exp-claim-item.selected { border-color: var(--gold); background: rgba(212,168,67,.08); }
.exp-loading {
  display: flex; align-items: center; gap: 10px; padding: 20px 0;
  color: var(--muted); font-size: 14px;
}
#exp-vocab-upgrade { font-size: 13px; line-height: 1.6; }
#exp-vocab-upgrade .vu-row {
  display: flex; align-items: baseline; gap: 8px; padding: 6px 0;
  border-bottom: 1px solid #222;
}
#exp-vocab-upgrade .vu-from { color: var(--red); text-decoration: line-through; font-size: 13px; }
#exp-vocab-upgrade .vu-arrow { color: var(--muted); font-size: 11px; }
#exp-vocab-upgrade .vu-to { color: var(--green); font-weight: 600; font-size: 13px; }
#exp-vocab-upgrade .vu-reason { color: var(--muted); font-size: 11px; margin-left: auto; }
#exp-compare {
  background: var(--card); border-radius: 12px; padding: 14px 16px;
}
#exp-compare .exp-original {
  font-size: 13px; color: var(--muted); line-height: 1.65;
  padding: 10px; background: var(--card2); border-radius: 8px; margin-bottom: 10px;
}
#exp-compare .exp-model {
  font-size: 14px; color: var(--text); line-height: 1.75;
  padding: 10px; background: rgba(212,168,67,.06); border-radius: 8px;
  border-left: 3px solid var(--gold);
}
```

- [ ] **Step 2: 确认 CSS 无语法错误**

运行 `npx stylelint` 或直接浏览器检查（无构建步骤，手动验证）。

---

### Task 2: 新增 HTML — 论点来源选择页 `s-exp-source`

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html:406`（在 `</div>` 关闭 `s-home` 之后、`s-ready` 之前插入）

- [ ] **Step 1: 插入 s-exp-source screen HTML**

在 `<!-- ═══ READY ═══ -->` (line 408) 之前插入：

```html
<!-- ═══ EXPANSION SOURCE ═══ -->
<div id="s-exp-source" class="screen flex col gap-18">
  <button onclick="goHome()" class="btn btn-ghost btn-sm">← 返回</button>

  <div>
    <div class="label">论点展开</div>
    <p class="muted" style="margin-top:6px; font-size:13px;">获得一个观点句，练习将其展开成完整论述</p>
  </div>

  <!-- 路径选择 -->
  <div class="flex col gap-10" id="exp-source-choices">
    <div class="exp-source-card" onclick="expFromTopics()">
      <div class="exp-source-icon">📋</div>
      <div style="font-weight:600; font-size:16px;">从题库选题提取</div>
      <div class="muted" style="font-size:12px; margin-top:4px;">选一道真题，AI提取其中的核心论点</div>
    </div>
    <div class="exp-source-card" onclick="expManual()">
      <div class="exp-source-icon">✏️</div>
      <div style="font-weight:600; font-size:16px;">手动输入论点</div>
      <div class="muted" style="font-size:12px; margin-top:4px;">自己写一句观点，AI帮你分析展开方向</div>
    </div>
    <div class="exp-source-card" onclick="expRandom()">
      <div class="exp-source-icon">🎲</div>
      <div style="font-weight:600; font-size:16px;">随机生成论点</div>
      <div class="muted" style="font-size:12px; margin-top:4px;">AI随机出题，可选限定领域和难度</div>
    </div>
  </div>

  <!-- 路径1展开：题库选择 -->
  <div id="exp-topics-panel" style="display:none;" class="flex col gap-12">
    <div class="label">选题</div>
    <div class="filter-bar" style="flex-wrap:wrap; gap:6px;">
      <button class="filter-btn active" onclick="expFilterTopics('all',this)">全部</button>
      <button class="filter-btn" onclick="expFilterTopics('综合分析',this)">综合分析</button>
      <button class="filter-btn" onclick="expFilterTopics('人际关系',this)">人际关系</button>
      <button class="filter-btn" onclick="expFilterTopics('计划组织',this)">计划组织</button>
      <button class="filter-btn" onclick="expFilterTopics('应急处突',this)">应急处突</button>
      <button class="filter-btn" onclick="expFilterTopics('自我认知',this)">自我认知</button>
    </div>
    <div id="exp-topics-list" style="max-height:40vh; overflow-y:auto;"></div>
    <div id="exp-claims-panel" style="display:none;" class="flex col gap-8">
      <div class="label">AI 提取的论点</div>
      <div class="exp-loading" id="exp-claims-loading" style="display:none;">
        <div class="spin" style="width:18px;height:18px;"></div> AI正在提取论点…
      </div>
      <div id="exp-claim-list"></div>
    </div>
  </div>

  <!-- 路径2展开：手动输入 -->
  <div id="exp-manual-panel" style="display:none;" class="flex col gap-10">
    <div class="label">输入你的论点句</div>
    <input type="text" id="exp-manual-input" placeholder="例如：基层治理需要数字化赋能" maxlength="60" autocomplete="off"/>
    <button class="btn btn-gold" onclick="expManualSubmit()" style="font-size:15px;">确认，生成展开方向</button>
  </div>

  <!-- 路径3展开：随机生成 -->
  <div id="exp-random-panel" style="display:none;" class="flex col gap-12">
    <div>
      <div class="label" style="margin-bottom:8px;">领域（可选）</div>
      <div class="flex gap-6" style="flex-wrap:wrap;" id="exp-domain-chips">
        <!-- JS 动态填充 -->
      </div>
    </div>
    <div>
      <div class="label" style="margin-bottom:8px;">难度（可选）</div>
      <div class="flex gap-6" id="exp-diff-chips">
        <button class="exp-diff-chip active" onclick="expSetDiff('medium',this)">中等</button>
        <button class="exp-diff-chip" onclick="expSetDiff('easy',this)">简单</button>
        <button class="exp-diff-chip" onclick="expSetDiff('hard',this)">困难</button>
      </div>
    </div>
    <button class="btn btn-gold" onclick="expRandomGenerate()" style="font-size:15px;">🎲 生成论点</button>
    <div class="exp-loading" id="exp-random-loading" style="display:none;">
      <div class="spin" style="width:18px;height:18px;"></div> AI正在生成论点…
    </div>
  </div>

  <!-- 加载状态 -->
  <div class="exp-loading" id="exp-source-loading" style="display:none; justify-content:center;">
    <div class="spin" style="width:22px;height:22px;"></div> 加载中…
  </div>
</div>
```

---

### Task 3: 新增 HTML — 论点展开准备页 `s-exp-ready`

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html:408`（在 `s-exp-source` 之后、`s-ready` 之前插入）

- [ ] **Step 1: 插入 s-exp-ready screen HTML**

```html
<!-- ═══ EXPANSION READY ═══ -->
<div id="s-exp-ready" class="screen flex col gap-18">
  <button onclick="expBackToSource()" class="btn btn-ghost btn-sm">← 返回</button>

  <div>
    <div class="label">论点展开</div>
    <div class="muted" id="exp-ready-source" style="font-size:11px; margin-top:4px;"></div>
  </div>

  <div id="exp-arg-text"></div>

  <div>
    <div class="label" style="margin-bottom:10px;">展开方向</div>
    <div id="exp-dirs"></div>
  </div>

  <div>
    <div class="label" style="margin-bottom:10px;">目标时长</div>
    <div id="exp-dur-options">
      <button class="exp-dur-btn" onclick="expSetDur(60,this)">60s</button>
      <button class="exp-dur-btn active" onclick="expSetDur(90,this)">90s</button>
      <button class="exp-dur-btn" onclick="expSetDur(120,this)">120s</button>
    </div>
  </div>

  <div class="mt-auto flex col gap-10">
    <button class="btn btn-gold" onclick="expStartCountdown()">开始练习</button>
    <button class="btn btn-ghost" id="exp-reroll-btn" onclick="expReroll()" style="font-size:14px;">换个论点</button>
  </div>
</div>
```

---

### Task 4: 修改 `s-rec` — 新增论点展开录音覆盖层

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html:562-563`（在 `rec-words-bar` 之后、实时转写之前）

- [ ] **Step 1: 在录音页插入论点展开覆盖条**

在 `<div id="rec-words-bar">` 闭合之后（line 566 之后）、实时转写 div 之前插入：

```html
  <!-- 论点展开模式：论点+方向提示 -->
  <div id="exp-rec-bar">
    <div class="exp-rec-arg" id="exp-rec-arg"></div>
    <div class="exp-rec-dir" id="exp-rec-dir"></div>
  </div>
```

---

### Task 5: 新增结果页 — 论点展开专项模块

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html:609`（在 `res-score-reason` div 之后）

- [ ] **Step 1: 在结果页插入展开专项模块**

在 `<div id="res-score-reason" style="display:none;"></div>` (line 609) 之后插入：

```html
  <!-- 论点展开：词汇升级 + 展开对比 -->
  <div id="exp-result-section" style="display:none;">
    <div id="exp-vocab-upgrade" class="card" style="margin-bottom:10px;"></div>
    <div id="exp-compare" class="card"></div>
  </div>
```

---

### Task 6: 首页新增「论点展开」按钮

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html:401-404`

- [ ] **Step 1: 在按钮行中添加论点展开按钮**

将现有底部按钮区（lines 401-404）的第二行改为三按钮：

```html
    <div class="flex gap-8">
      <button class="btn btn-ghost" onclick="goWordReady()" style="flex:1; border:1.5px solid var(--gold); color:var(--gold);">词语串联</button>
      <button class="btn btn-ghost" onclick="goStorySetup()" style="flex:1; border:1.5px solid var(--gold); color:var(--gold);">讲述模式</button>
      <button class="btn btn-ghost" onclick="goExpSource()" style="flex:1; border:1.5px solid var(--gold); color:var(--gold);">论点展开</button>
    </div>
```

- [ ] **Step 2: Commit**

```bash
git add app.html
git commit -m "feat: add expansion mode UI shells (screens, CSS, home button)"
```

---

### Task 7: JS — 状态变量和工具函数

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html` — 在 `goExpSource` 函数定义之前插入（新代码段放在 JS 区域的合适位置，建议在 `goStorySetup` 函数之后，约 line 3106）

- [ ] **Step 1: 定义展开模式状态变量和入口函数**

```javascript
// ── 论点展开模式 ──
let _expState = {
  source: '',           // 'topic' | 'manual' | 'random'
  sourceTopic: null,    // 来源题目 { text, subtype } (仅 topic 路径)
  argument: '',         // 论点句
  directions: [],       // AI 展开方向
  duration: 90,         // 目标时长(秒)
  domain: '',           // 领域 (仅 random)
  difficulty: 'medium', // 难度 (仅 random)
};
let _expTopicFilter = 'all';

function goExpSource() {
  S.mode = 'expansion';
  _expState = { source: '', sourceTopic: null, argument: '', directions: [], duration: 90, domain: '', difficulty: 'medium' };
  // 重置面板
  document.getElementById('exp-source-choices').style.display = '';
  document.getElementById('exp-topics-panel').style.display = 'none';
  document.getElementById('exp-claims-panel').style.display = 'none';
  document.getElementById('exp-manual-panel').style.display = 'none';
  document.getElementById('exp-random-panel').style.display = 'none';
  document.getElementById('exp-claim-list').innerHTML = '';
  document.getElementById('exp-manual-input').value = '';
  // 渲染随机路径的领域 chips
  const domains = ['不限','社会治理','乡村振兴','经济发展','民生保障','生态文明','法治建设','青年成长','科技创新','文化建设'];
  document.getElementById('exp-domain-chips').innerHTML = domains.map((d,i) =>
    `<button class="exp-domain-chip${i===0?' active':''}" onclick="expSetDomain('${d=== '不限' ? '' : d}',this)">${d}</button>`
  ).join('');
  // 重置难度
  document.querySelectorAll('#exp-diff-chips .exp-diff-chip').forEach(b => b.classList.remove('active'));
  document.querySelector('#exp-diff-chips .exp-diff-chip').classList.add('active');
  _expState.difficulty = 'medium';
  _expTopicFilter = 'all';
  show('s-exp-source');
}

function expSetDomain(domain, btn) {
  _expState.domain = domain;
  document.querySelectorAll('#exp-domain-chips .exp-domain-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function expSetDiff(diff, btn) {
  _expState.difficulty = diff;
  document.querySelectorAll('#exp-diff-chips .exp-diff-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
```

- [ ] **Step 2: Commit**

---

### Task 8: JS — 三条论点来源路径

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html` — 在 Task 7 代码之后继续追加

- [ ] **Step 1: 路径 1「从题库选题」**

```javascript
function expFromTopics() {
  document.getElementById('exp-source-choices').style.display = 'none';
  document.getElementById('exp-topics-panel').style.display = '';
  document.getElementById('exp-manual-panel').style.display = 'none';
  document.getElementById('exp-random-panel').style.display = 'none';
  _expState.source = 'topic';
  expRenderTopicList();
}

function expFilterTopics(filter, btn) {
  _expTopicFilter = filter;
  document.querySelectorAll('#exp-topics-panel .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  expRenderTopicList();
}

function expRenderTopicList() {
  const interviews = INTERVIEW_TOPICS;
  const subtypes = _expTopicFilter === 'all'
    ? ['综合分析','人际关系','计划组织','应急处突','自我认知']
    : [_expTopicFilter];

  let html = '';
  subtypes.forEach(sub => {
    const items = interviews.filter(t => t.subtype === sub);
    if (!items.length) return;
    html += `<div class="interview-subtype">${sub}</div>`;
    items.forEach((t, j) => {
      const idx = interviews.indexOf(t);
      html += `<div class="bank-item" onclick="expSelectTopic(${idx})" style="cursor:pointer;">
        <div class="bank-item-text">${t.text}</div>
      </div>`;
    });
  });
  document.getElementById('exp-topics-list').innerHTML = html || '<div class="muted" style="text-align:center;padding:20px;">暂无题目</div>';
}

async function expSelectTopic(idx) {
  const t = INTERVIEW_TOPICS[idx];
  _expState.sourceTopic = { text: t.text, subtype: t.subtype };
  // 显示加载
  document.getElementById('exp-claims-panel').style.display = '';
  document.getElementById('exp-claims-loading').style.display = 'flex';
  document.getElementById('exp-claim-list').innerHTML = '';

  const prompt = `从以下公务员结构化面试题中提取 2-3 个核心论点，每个论点一句话（15-30字），有观点态度，不是事实陈述。不要编号，每行一个论点。

题目（${t.subtype}）：${t.text}`;

  try {
    const result = await callLLM(prompt, 800);
    const claims = result.split('\n').map(s => s.replace(/^[\d\.\-\s•*]+/, '').trim()).filter(s => s.length >= 8 && s.length <= 60);
    if (!claims.length) throw new Error('论点提取结果为空');
    document.getElementById('exp-claim-list').innerHTML = claims.map((c, i) =>
      `<div class="exp-claim-item" onclick="expPickClaim('${c.replace(/'/g, "\\'")}', this)">${c}</div>`
    ).join('');
  } catch(e) {
    document.getElementById('exp-claim-list').innerHTML = `<div class="muted" style="color:var(--red);font-size:13px;">提取失败：${e.message}</div>`;
  } finally {
    document.getElementById('exp-claims-loading').style.display = 'none';
  }
}

async function expPickClaim(claim, btn) {
  _expState.argument = claim;
  document.querySelectorAll('#exp-claim-list .exp-claim-item').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  await expGenerateDirections();
}
```

- [ ] **Step 2: 路径 2「手动输入」**

```javascript
function expManual() {
  document.getElementById('exp-source-choices').style.display = 'none';
  document.getElementById('exp-topics-panel').style.display = 'none';
  document.getElementById('exp-manual-panel').style.display = '';
  document.getElementById('exp-random-panel').style.display = 'none';
  _expState.source = 'manual';
  _expState.sourceTopic = null;
  document.getElementById('exp-manual-input').focus();
}

async function expManualSubmit() {
  const input = document.getElementById('exp-manual-input').value.trim();
  if (!input || input.length < 6) {
    alert('请输入至少6个字的论点句');
    return;
  }
  _expState.argument = input;
  await expGenerateDirections();
}
```

- [ ] **Step 3: 路径 3「随机生成」**

```javascript
function expRandom() {
  document.getElementById('exp-source-choices').style.display = 'none';
  document.getElementById('exp-topics-panel').style.display = 'none';
  document.getElementById('exp-manual-panel').style.display = 'none';
  document.getElementById('exp-random-panel').style.display = '';
  _expState.source = 'random';
  _expState.sourceTopic = null;
}

async function expRandomGenerate() {
  document.getElementById('exp-random-loading').style.display = 'flex';
  const domainPart = _expState.domain ? `关于【${_expState.domain}】领域` : '关于公务员结构化面试常见话题';
  const diffMap = { easy: '简单（观点直白，容易举例）', medium: '中等（有一定抽象度，需稍加思考）', hard: '困难（需多维度深入展开）' };
  const diffPart = diffMap[_expState.difficulty] || diffMap.medium;

  const prompt = `生成一个${domainPart}的论点句，难度${diffPart}，作为口才展开训练素材。

要求：
- 论点一句话（15-30字），有观点态度，适合展开论述
- 同时提供 3 条展开方向提示，每条 10-15 字，覆盖不同角度

输出格式（严格按此，不要任何多余文字）：
论点：xxx
→ xxx
→ xxx
→ xxx`;

  try {
    const result = await callLLM(prompt, 800);
    const argM = result.match(/论点[：:]\s*(.+)/);
    const dirs = [...result.matchAll(/→\s*(.+)/g)].map(m => m[1].trim());
    _expState.argument = argM?.[1]?.trim() || '';
    _expState.directions = dirs.slice(0, 3);
    if (!_expState.argument) throw new Error('论点生成失败');
    if (!_expState.directions.length) _expState.directions = ['分析原因和背景', '举一个具体案例', '提出对策和建议'];
    expShowReady();
  } catch(e) {
    alert('生成失败：' + e.message);
  } finally {
    document.getElementById('exp-random-loading').style.display = 'none';
  }
}
```

- [ ] **Step 4: Commit**

---

### Task 9: JS — 展开方向生成 + 准备页

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html` — 在 Task 8 代码之后继续追加

- [ ] **Step 1: 展开方向生成和准备页显示**

```javascript
async function expGenerateDirections() {
  document.getElementById('exp-source-loading').style.display = 'flex';
  const topicCtx = _expState.sourceTopic
    ? `原题（${_expState.sourceTopic.subtype}）：${_expState.sourceTopic.text}\n`
    : '';

  const prompt = `以下是面试题和选定的论点，请生成 3 条展开方向提示，每条 10-15 字，覆盖不同角度（如原因分析、案例举例、对策建议、意义升华等）。不要编号，每行以"→"开头。

${topicCtx}论点：${_expState.argument}`;

  try {
    const result = await callLLM(prompt, 600);
    const dirs = [...result.matchAll(/→\s*(.+)/g)].map(m => m[1].trim());
    _expState.directions = dirs.slice(0, 3);
    if (!_expState.directions.length) {
      _expState.directions = ['阐述这句话的核心含义', '结合实际举例说明', '从这个角度提出对策'];
    }
    expShowReady();
  } catch(e) {
    // 降级：使用默认方向
    _expState.directions = ['阐述这句话的核心含义', '结合实际举例说明', '从这个角度提出对策'];
    expShowReady();
  } finally {
    document.getElementById('exp-source-loading').style.display = 'none';
  }
}

function expShowReady() {
  document.getElementById('exp-arg-text').textContent = _expState.argument;
  document.getElementById('exp-dirs').innerHTML = _expState.directions.map(d =>
    `<div class="exp-dir-item">${d}</div>`
  ).join('');
  const srcLabel = _expState.source === 'topic' ? `来源：${_expState.sourceTopic?.subtype || ''} · ${(_expState.sourceTopic?.text || '').slice(0, 30)}…`
    : _expState.source === 'manual' ? '来源：手动输入'
    : '来源：随机生成';
  document.getElementById('exp-ready-source').textContent = srcLabel;
  // 重置时长按钮
  document.querySelectorAll('#exp-dur-options .exp-dur-btn').forEach(b => b.classList.remove('active'));
  const durBtn = document.querySelector(`#exp-dur-options .exp-dur-btn[onclick*="${_expState.duration}"]`);
  if (durBtn) durBtn.classList.add('active');
  show('s-exp-ready');
}

function expSetDur(sec, btn) {
  _expState.duration = sec;
  document.querySelectorAll('#exp-dur-options .exp-dur-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function expBackToSource() {
  goExpSource();
}

async function expReroll() {
  if (_expState.source === 'topic' && _expState.sourceTopic) {
    // 回到选题列表，不重新提取论点
    document.getElementById('exp-source-choices').style.display = 'none';
    document.getElementById('exp-topics-panel').style.display = '';
    document.getElementById('exp-claims-panel').style.display = '';
    document.getElementById('exp-claim-list').innerHTML = '';
    expSelectTopic(INTERVIEW_TOPICS.indexOf(_expState.sourceTopic));
  } else if (_expState.source === 'random') {
    await expRandomGenerate();
  } else {
    goExpSource();
  }
}
```

- [ ] **Step 2: Commit**

---

### Task 10: JS — 录音页论点覆盖层 + 倒计时

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html` — 修改 `beginRecording()` 和新增 `expStartCountdown()`

- [ ] **Step 1: 新增论点展开倒计时入口**

在 Task 9 代码之后追加：

```javascript
function expStartCountdown() {
  cancelPrepTimer();
  // 请求麦克风权限
  if (navigator.mediaDevices && !S._permStream) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      S._permStream = stream;
      S._permError = null;
    }).catch(err => {
      S._permStream = null;
      S._permError = err;
    });
  }
  show('s-countdown');
  let n = 3;
  const tips = ['记住论点，想好第一句', '按展开方向组织思路', '开口！'];
  document.getElementById('cdnum').textContent = n;
  document.getElementById('cd-tip').textContent = tips[0];
  const iv = setInterval(() => {
    n--;
    if (n <= 0) { clearInterval(iv); expBeginRecording(); return; }
    document.getElementById('cdnum').textContent = n;
    document.getElementById('cdnum').style.animation = 'none';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.getElementById('cdnum').style.animation = 'pop .7s ease-out';
    }));
    document.getElementById('cd-tip').textContent = tips[3 - n] || '';
  }, 900);
}
```

- [ ] **Step 2: 修改 `beginRecording()` 以支持论点展开模式**

在 `beginRecording()` 函数中（line 3481, `renderRecWordChips()` 之后），追加展开模式逻辑。找到：

```javascript
  renderRecWordChips();
  const durLabel = S.mode === 'story' ? ...
```

在 `renderRecWordChips();` 之后、`const durLabel` 之前插入：

```javascript
  // 论点展开模式：显示论点+方向覆盖层
  const expBar = document.getElementById('exp-rec-bar');
  if (S.mode === 'expansion') {
    expBar.style.display = 'block';
    document.getElementById('exp-rec-arg').textContent = _expState.argument;
    document.getElementById('exp-rec-dir').textContent = _expState.directions.join(' · ');
  } else {
    expBar.style.display = 'none';
  }
```

并修改 durLabel 计算，在 `S.mode === 'story'` 分支前插入 expansion 分支：

```javascript
  const durLabel = S.mode === 'expansion' ? `${_expState.duration}秒`
    : S.mode === 'story' ? '3-5 分钟'
    : (S.targetDur === '1-2' ? '1-2 分钟' : ...现有逻辑...);
```

- [ ] **Step 3: 新增 `expBeginRecording()`（复用现有录制流程）**

```javascript
function expBeginRecording() {
  S.transcript = '';
  S.isRecording = true;
  S.startTime = Date.now();
  S.sessionId = Date.now().toString();
  document.getElementById('tx-text').textContent = '开始说话后，文字会自动出现……';
  document.getElementById('tx-text').style.color = 'var(--muted)';
  document.getElementById('no-sr-hint').style.display = 'none';
  document.getElementById('exp-rec-bar').style.display = 'block';
  document.getElementById('exp-rec-arg').textContent = _expState.argument;
  document.getElementById('exp-rec-dir').textContent = _expState.directions.join(' · ');
  const durSec = _expState.duration;
  document.getElementById('rec-target-hint').textContent = `目标 ${durSec} 秒`;
  show('s-rec');

  S.timerRef = setInterval(() => {
    const sec = Math.floor((Date.now() - S.startTime) / 1000);
    document.getElementById('timer').textContent = `${Math.floor(sec/60)}:${pad(sec%60)}`;
    // 到达目标时长时计时器变红提醒
    if (sec >= durSec) {
      document.getElementById('timer').style.color = 'var(--red)';
    }
  }, 500);

  if (S.asrType !== 'api') {
    startSR();
  } else {
    document.getElementById('tx-text').textContent = '🎙 录音中（API 模式将在结束后转写）';
    document.getElementById('tx-text').style.color = 'var(--muted)';
  }
  startMediaRecorder();
}
```

- [ ] **Step 4: Commit**

---

### Task 11: JS — 论点展开评分 Prompt

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html` — 修改 `evaluate()` 函数，在现有三个 if 分支前插入 expansion 分支（约 line 3772）

- [ ] **Step 1: 在 `evaluate()` 中添加论点展开评分分支**

在 `let prompt;` 之后、`if (mode === 'word')` 之前（line 3772 附近）插入：

```javascript
  if (mode === 'expansion') {
    const durTarget = _expState.duration;
    const durNote = duration < durTarget * 0.6 ? '⚠️严重偏短' : duration < durTarget * 0.85 ? '略短' : duration > durTarget * 1.5 ? '明显超时' : duration > durTarget * 1.2 ? '略长' : '✓达标';

    prompt = `你是口才训练教练，正在评估学员的「论点展开」专项训练。${asrAccurateNote}

【论点】「${_expState.argument}」

【参考展开方向】
${_expState.directions.map((d,i) => `${i+1}. ${d}`).join('\n')}

【客观数据——评分必须与之一致】
- 发言时长：${dur}（${durNote}，目标 ${durTarget} 秒）
- 有效字数：${tm.chars} 字
- 语速：${tm.pace} 字/分钟（${paceNote}，正常范围 200-270）
- 口头禅次数：${tm.totalFillers} 次（${fillerDetail}）
- 重复词次数：${tm.totalRepeats} 次（${repeatDetail}）
${audioSection}

${transcriptLabel}
「${transcript || '（未能获取转写内容）'}」

【评分标准——聚焦展开能力，严格参照，不得虚高】
9-10分：多角度展开，每个角度深入有料，举例具体，语言流畅有感染力，词汇专业丰富，时长达标
7-8分：覆盖2个以上角度，论证较充分，有具体举例，词汇较丰富，口头禅≤2次
5-6分：仅1-2个角度，论证偏浅，举例空洞或不具体，词汇单调，或时长明显偏短
3-4分：基本只是重复论点本身，没有展开，或逻辑混乱，口头禅≥6次
1-2分：内容极少或完全偏离论点

【输出格式——严格按此】

**展开诊断**：[综合评估4个维度：展开完整度/词汇丰富度/论证说服力/衔接自然度，每项一两句，标注强弱项]

**词汇升级**：[列出3-5个可升级词汇，每行格式：原文词 → 建议词 | 理由]

**展开示范**：[为同一论点写一段高质量的展开示范，200-300字，有逻辑层次，有具体举例，有专业词汇，让学员可以对比学习]

**评分**：[X/10，整数，必须与客观数据一致]
**评分理由**：[一句话点明得这个分的最主要原因]
**鼓励**：[一句话，不超过15字]
**明日聚焦**：[最应改进的一点，给出具体做法]${slipSection}`;
  } else if (mode === 'word') {
```

- [ ] **Step 2: 修改 session 构建以保存 expansion 特有字段**

在 `evaluate()` 中 session 对象构建处（line 3928），修改：

```javascript
    const session = {
      id: S.sessionId,
      date: today(),
      mode: mode || 'topic',
      topic: mode === 'expansion' ? _expState.argument
           : mode === 'word' ? `词语串联：${words.join('、')}`
           : mode === 'story' ? (S.storyTitle || `${({movie:'电影',book:'书籍',experience:'亲身经历',news:'新闻事件'}[S.storyCategory]||'故事')}`)
           : topic.text,
      theme: mode === 'expansion' ? '论点展开'
           : mode === 'word' ? '词语串联'
           : mode === 'story' ? '讲述模式'
           : topic.theme,
      words: mode === 'word' ? words : undefined,
      storyTitle: mode === 'story' ? S.storyTitle : undefined,
      storyCategory: mode === 'story' ? S.storyCategory : undefined,
      asrType: S.asrType || 'browser',
      duration,
      transcript: S.transcript,
      evaluation: evalText,
      score,
      labels: labelParts.length === 3 ? { problem: labelParts[0], value: labelParts[1], logic: labelParts[2] } : null,
      optimized: '',
      highScore: '',
      metrics: analyzeTranscript(S.transcript, duration),
      audioMetrics: S.audioMetrics,
      // expansion 特有
      expArgument: mode === 'expansion' ? _expState.argument : undefined,
      expDirections: mode === 'expansion' ? _expState.directions : undefined,
      expSource: mode === 'expansion' ? _expState.source : undefined,
      expSourceTopic: mode === 'expansion' ? (_expState.sourceTopic?.text || '') : undefined,
    };
```

- [ ] **Step 3: Commit**

---

### Task 12: JS — 论点展开结果页渲染

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html` — 修改 `showResult()` 函数

- [ ] **Step 1: 在 `showResult()` 中添加论点展开专项渲染**

在 `showResult()` 函数中 `const cm = evalText.match(/\*\*鼓励\*\*/...)` 之前（约 line 4302 前），插入：

```javascript
  // 论点展开：词汇升级 + 展开对比
  const expSection = document.getElementById('exp-result-section');
  const vocabDiv = document.getElementById('exp-vocab-upgrade');
  const compareDiv = document.getElementById('exp-compare');
  if (session.mode === 'expansion' && evalText) {
    expSection.style.display = '';

    // 词汇升级
    const vocabM = evalText.match(/\*\*词汇升级\*\*[：:]([\s\S]*?)(?=\*\*展开示范\*\*|\*\*评分\*\*|$)/);
    if (vocabM) {
      const lines = vocabM[1].trim().split('\n').filter(l => l.includes('→'));
      vocabDiv.innerHTML = `
        <div class="label" style="margin-bottom:8px;">📝 词汇升级</div>
        ${lines.map(l => {
          const parts = l.split('|').map(s => s.trim());
          const mainParts = (parts[0] || l).split('→').map(s => s.trim());
          return `<div class="vu-row">
            <span class="vu-from">${mainParts[0] || ''}</span>
            <span class="vu-arrow">→</span>
            <span class="vu-to">${mainParts[1] || ''}</span>
            ${parts[1] ? `<span class="vu-reason">${parts[1]}</span>` : ''}
          </div>`;
        }).join('')}
      `;
    } else {
      vocabDiv.innerHTML = '';
    }

    // 展开对比（原始 vs AI 示范）
    const demoM = evalText.match(/\*\*展开示范\*\*[：:]([\s\S]*?)(?=\*\*评分\*\*|$)/);
    compareDiv.innerHTML = `
      <div class="label" style="margin-bottom:8px;">📖 展开对比</div>
      <div class="muted" style="font-size:11px;margin-bottom:6px;">你的回答</div>
      <div class="exp-original">${session.transcript || '（无转写内容）'}</div>
      <div class="muted" style="font-size:11px;margin:10px 0 6px;">AI 展开示范</div>
      <div class="exp-model">${demoM ? demoM[1].trim().replace(/\n/g, '<br>') : '（示范未生成）'}</div>
    `;
  } else {
    expSection.style.display = 'none';
  }
```

- [ ] **Step 2: 修改 `showResult()` 中的 sects 定义以支持 expansion 模式**

在 `showResult()` 中 `sects` 定义处（line 4208），在 `session.mode === 'story'` 之前加入：

```javascript
  const sects = session.mode === 'expansion'
    ? [
      { k: '展开诊断', icon: '📊' },
      { k: '明日聚焦', icon: '🎯' },
      ...slipSect,
    ]
    : session.mode === 'story'
    ? [ ...现有... ]
```

- [ ] **Step 3: Commit**

---

### Task 13: JS — 历史列表 + 重试支持

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html` — 修改 `retryHistSession()` 和 `renderHistList()`

- [ ] **Step 1: 修改 `retryHistSession()` 以支持 expansion 模式**

在 `retryHistSession()` 函数中（line 2123），在 `if (h.mode === 'word')` 分支前加入：

```javascript
  if (h.mode === 'expansion') {
    _expState = {
      source: h.expSource || 'manual',
      sourceTopic: h.expSourceTopic ? { text: h.expSourceTopic, subtype: h.theme || '' } : null,
      argument: h.expArgument || h.topic,
      directions: h.expDirections || ['阐述核心含义', '结合实际举例', '提出对策建议'],
      duration: 90,
      domain: '',
      difficulty: 'medium',
    };
    expShowReady();
    return;
  }
```

- [ ] **Step 2: 修改 `renderHistList()` 以展示论点展开记录**

在 `renderHistList()` 函数中（line 2549），`h.words` 展示之后、`h.topic` 展示之前，修改逻辑以支持 expansion 模式。找到主题展示行，修改：

```javascript
          ${h.words && h.words.length ? `...words html...`
            : h.mode === 'expansion' ? `<div style="font-size:14px;font-weight:500;line-height:1.4;color:var(--gold);">${h.topic || ''}</div>`
            : `<div style="font-size:14px;font-weight:500;line-height:1.4;">${h.topic || ''}</div>`}
```

另外在 theme-badge 前加入模式标签：

找到 `<span class="theme-badge">${h.theme || '—'}</span>` (line 2546)，改为：

```javascript
            ${h.mode === 'expansion' ? '<span class="theme-badge" style="background:rgba(212,168,67,.15);color:var(--gold);">论点展开</span>' : ''}
            <span class="theme-badge">${h.theme || '—'}</span>
```

- [ ] **Step 3: 修改 `goHome()` 重置 expansion 状态**

在 `goHome()` 函数中（line 2140），`S.mode = 'topic';` 之前加入：

```javascript
  _expState = { source: '', sourceTopic: null, argument: '', directions: [], duration: 90, domain: '', difficulty: 'medium' };
```

- [ ] **Step 4: Commit**

---

### Task 14: JS — 手动输入 + 评测后优化版本跳过 + 清理

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html`

- [ ] **Step 1: 在 `evaluate()` 成功后跳过 expansion 模式的 optimize/highscore 生成**

在现有 `if (S.enableOptimize) generateOptimized(session);` (line 3956) 处：

```javascript
    if (S.enableOptimize && mode !== 'expansion') generateOptimized(session);
    if (S.enableHighScore && mode !== 'expansion') generateHighScore(session);
```

（因为 expansion 模式的结果已经自带展开示范，不需要单独优化）

- [ ] **Step 2: 在录音停止时保留 expansion 状态**

`stopRec()` 函数中（line 3564），确认 `S.mode` 保持为 `'expansion'`，不用额外修改。

- [ ] **Step 3: 修改 `evaluate()` 中 fallback session 构建**

在 evaluate catch 块 fallback session 构建（line 3960），与正式 session 类似添加 expansion 字段：

```javascript
    const fallbackSession = {
      id: S.sessionId, date: today(), mode: mode || 'topic',
      topic: mode === 'expansion' ? _expState.argument
           : mode === 'word' ? `词语串联：${words.join('、')}`
           : mode === 'story' ? (S.storyTitle || '讲述模式')
           : topic.text,
      theme: mode === 'expansion' ? '论点展开'
           : mode === 'word' ? '词语串联'
           : mode === 'story' ? '讲述模式'
           : topic.theme,
      asrType: S.asrType || 'browser', duration, transcript: S.transcript,
      evaluation: '', score: '—', metrics: analyzeTranscript(S.transcript, duration), audioMetrics: S.audioMetrics,
      expArgument: mode === 'expansion' ? _expState.argument : undefined,
      expDirections: mode === 'expansion' ? _expState.directions : undefined,
      expSource: mode === 'expansion' ? _expState.source : undefined,
      expSourceTopic: mode === 'expansion' ? (_expState.sourceTopic?.text || '') : undefined,
    };
```

- [ ] **Step 4: Commit**

---

### Task 15: 最终验证 + 边缘情况处理

**Files:**
- Modify: `E:\Projects\claude\speaking\speaking\app.html`

- [ ] **Step 1: 验证清单**

1. 首页 → 点击「论点展开」→ 进入 s-exp-source → 三个卡片可见
2. 点击「从题库选题」→ 题目列表显示 → 选题 → loading → 论点出现 → 选论点 → loading → 准备页出现
3. 准备页：论点句显示、展开方向显示、时长按钮可切换、点开始进入倒计时
4. 倒计时 3-2-1 → 进入录音页 → 论点+方向在顶部显示 → 计时器运行 → 到达目标时长时变红
5. 停止录音 → 进入评估 → 结果显示展开诊断、词汇升级、展开对比
6. 点击「手动输入」→ 输入论点 → 确认 → loading → 准备页出现
7. 点击「随机生成」→ 选择领域/难度 → 生成 → loading → 准备页出现
8. 历史列表：论点展开记录显示正确，theme-badge 显示「论点展开」
9. 历史重试：展开模式记录可重试，回到准备页

- [ ] **Step 2: 边缘情况修复**

在验证过程中发现并修复：
- 网络错误时各 AI 调用路径的降级处理（已在代码中加入 try/catch + 默认方向降级）
- 空论点/空方向时的 UI 保护
- 从其他模式切换到展开模式时状态不污染

- [ ] **Step 3: 最终 Commit**

```bash
git add app.html
git commit -m "feat: 论点展开专项训练模式完整实现"
```
