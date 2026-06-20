# Light Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add light/white theme with CSS variable toggle, replacing all ~90 hardcoded color values in app.html.

**Architecture:** Single-file change to `app.html`. All theming via CSS custom properties on `:root`, overridden by `[data-theme="light"]` selector. Toggle button in `#s-home` header. localStorage persistence + prefers-color-scheme default.

**Tech Stack:** Vanilla HTML/CSS/JS, no dependencies.

---

### Task 1: Expand CSS variable definitions

**Files:**
- Modify: `app.html:10-21`

Replace the `:root` block and add `[data-theme="light"]` block immediately after it.

- [ ] **Step 1: Replace `:root` block and add light theme overrides**

Replace lines 10-21:
```css
:root {
  --bg: #0c0c0e;
  --card: #18181c;
  --card2: #222228;
  --gold: #d4a843;
  --gold2: #f0c96a;
  --text: #f0eff4;
  --muted: #8b8a94;
  --red: #e05252;
  --green: #4caf6e;
  --r: 14px;
}
```

With:
```css
:root {
  --bg: #0c0c0e;
  --card: #18181c;
  --card2: #222228;
  --gold: #d4a843;
  --gold2: #f0c96a;
  --text: #f0eff4;
  --muted: #8b8a94;
  --red: #e05252;
  --green: #4caf6e;
  --r: 14px;
  /* semantic aliases */
  --border: #333;
  --border-light: #444;
  --divider: #222;
  --divider2: #2a2a30;
  --overlay: rgba(0,0,0,0.75);
  --overlay-heavy: rgba(0,0,0,0.9);
  --overlay-light: rgba(0,0,0,0.85);
  --gold-bg: rgba(212,168,67,0.08);
  --gold-bg2: rgba(212,168,67,0.15);
  --gold-bg3: rgba(212,168,67,0.06);
  --gold-bg4: rgba(212,168,67,0.12);
  --gold-border: rgba(212,168,67,0.2);
  --gold-border2: rgba(212,168,67,0.3);
  --green-bg: rgba(76,175,110,0.15);
  --green-bg2: rgba(76,175,110,0.12);
  --red-bg: rgba(229,115,115,0.12);
  --red-bg2: rgba(224,82,82,0.15);
  --on-accent: #000;
  --on-accent-inv: #fff;
  --code-bg: #15151e;
  --code-bg2: #1a1a2e;
  --code-bg3: #111;
  --muted-extra: #555;
  --muted-text2: #aaa;
  --muted-text3: #ccc;
  --toggle-track: #333;
  --toggle-thumb: #fff;
  --warn: #e0a030;
  --error-text: #e57373;
}
[data-theme="light"] {
  --bg: #f5f5f7;
  --card: #ffffff;
  --card2: #eeeef2;
  --gold: #b8860b;
  --gold2: #d4a843;
  --text: #1a1a1e;
  --muted: #6e6d7a;
  --red: #d32f2f;
  --green: #388e3c;
  --border: #d0d0d8;
  --border-light: #c0c0c8;
  --divider: #e0e0e6;
  --divider2: #d8d8e0;
  --overlay: rgba(0,0,0,0.4);
  --overlay-heavy: rgba(0,0,0,0.6);
  --overlay-light: rgba(0,0,0,0.45);
  --gold-bg: rgba(184,134,11,0.08);
  --gold-bg2: rgba(184,134,11,0.12);
  --gold-bg3: rgba(184,134,11,0.06);
  --gold-bg4: rgba(184,134,11,0.1);
  --gold-border: rgba(184,134,11,0.25);
  --gold-border2: rgba(184,134,11,0.35);
  --green-bg: rgba(56,142,60,0.12);
  --green-bg2: rgba(56,142,60,0.1);
  --red-bg: rgba(211,47,47,0.1);
  --red-bg2: rgba(211,47,47,0.12);
  --on-accent: #fff;
  --on-accent-inv: #fff;
  --code-bg: #e8e8f0;
  --code-bg2: #e0e0ea;
  --code-bg3: #f0f0f4;
  --muted-extra: #999;
  --muted-text2: #777;
  --muted-text3: #555;
  --toggle-track: #d0d0d8;
  --toggle-thumb: #fff;
  --warn: #c4841a;
  --error-text: #c62828;
}
```

- [ ] **Step 2: Commit**

```bash
git add app.html
git commit -m "feat: add CSS variable system for light theme"
```

---

### Task 2: Replace hardcoded colors in CSS stylesheet

**Files:**
- Modify: `app.html` — all `<style>` block rules (lines 48-427)

Replace every hardcoded color in the CSS with its semantic variable. Each replacement is a separate `Edit` call.

- [ ] **Step 1: Replace `#000` → `var(--on-accent)` (text on gold)**

Affected lines: 48, 148, 156, 189, 195, 245, 297, 302, 408

Use `replace_all: true` with pattern `: var(--gold); color: #000;` → `: var(--gold); color: var(--on-accent);`

Also lines with `active` combined selector patterns:
- Line 48: `.btn-gold { background: var(--gold); color: #000; }` → `color: var(--on-accent);`
- Lines 148, 156, 189, 195, 245, 297, 302: same pattern in `.active` rules
- Line 408: `.bank-item-practice:active { background:var(--gold); border-color:var(--gold); color:#000; }` → `color:var(--on-accent);`

- [ ] **Step 2: Replace `#fff` → `var(--on-accent-inv)`**

Affected: line 50, 183

Line 50: `.btn-red { background: var(--red); color: #fff; }` → `color: var(--on-accent-inv);`
Line 183: `background:#fff;` → `background:var(--toggle-thumb);`

- [ ] **Step 3: Replace `#333` → `var(--border)`**

All `border: 1.5px solid #333` and `border: 1px solid #333` and `background:#333`:

Affected lines: 56, 186, 191, 242, 294, 299, 305

Also in HTML inline (handled in Task 3):
Lines 1127, 1141, 1254, 1266, 1279 (toggle tracks → `var(--toggle-track)`)

CSS replacements:
- Line 56: `border: 1.5px solid #333;` → `border: 1.5px solid var(--border);`
- Line 186: `border: 1.5px solid #333;` → `border: 1.5px solid var(--border);`
- Line 191: `border: 1px solid #333;` → `border: 1px solid var(--border);`
- Line 242: `border: 1px solid #333;` → `border: 1px solid var(--border);`
- Line 294: `border: 1px solid #333;` → `border: 1px solid var(--border);`
- Line 299: `border: 1px solid #333;` → `border: 1px solid var(--border);`
- Line 305: `border: 1.5px solid #333;` → `border: 1.5px solid var(--border);`

- [ ] **Step 4: Replace `#444` → `var(--border-light)`**

Affected lines: 215, 317, 407

- Line 215: `border: 1.5px solid #444;` → `border: 1.5px solid var(--border-light);`
- Line 317: `border-color: #444;` → `border-color: var(--border-light);`
- Line 407: `border:1px solid #444;` → `border:1px solid var(--border-light);`

- [ ] **Step 5: Replace `#222` → `var(--divider)`**

Affected lines: 112, 343

- Line 112: `border-top: 1px solid #222;` → `border-top: 1px solid var(--divider);`
- Line 343: `border-bottom: 1px solid #222;` → `border-bottom: 1px solid var(--divider);`

- [ ] **Step 6: Replace `#2a2a30` → `var(--divider2)`**

Affected lines: 130, 165, 382, 386, 404

- Line 130: `border-top: 1px solid #2a2a30;` → `border-top: 1px solid var(--divider2);`
- Line 165: `background: #2a2a30;` → `background: var(--divider2);`
- Line 382: `border-bottom:1px solid #2a2a30;` → `border-bottom:1px solid var(--divider2);`
- Line 386: `border-top:1px solid #2a2a30;` → `border-top:1px solid var(--divider2);`
- Line 404: `border-top:1px solid #2a2a30;` → `border-top:1px solid var(--divider2);`

- [ ] **Step 7: Replace `#ccc` → `var(--muted-text3)`**

Affected: line 89

- Line 89: `color: #ccc;` → `color: var(--muted-text3);`

- [ ] **Step 8: Replace `#555` → `var(--muted-extra)`**

Affected lines: 402, 409, 412

- Line 402: `color:#555;` → `color:var(--muted-extra);`
- Line 409: `color:#555;` → `color:var(--muted-extra);`
- Line 412: `text-decoration-color: #555;` → `text-decoration-color: var(--muted-extra);`

- [ ] **Step 9: Replace `#e0a030` → `var(--warn)`**

Affected: line 206

- Line 206: `color: #e0a030;` → `color: var(--warn);`

- [ ] **Step 10: Replace gold rgba() with gold-bg variables**

Affected lines: 233, 272, 273, 311, 327, 330, 335, 358, 390, 418

- Line 233: `background: rgba(212,168,67,.08);` → `background: var(--gold-bg);`
- Line 272: `background: rgba(212,168,67,.08);` → `background: var(--gold-bg);`
- Line 273: `border: 1px solid rgba(212,168,67,.2);` → `border: 1px solid var(--gold-border);`
- Line 311: `background: rgba(212,168,67,.08);` → `background: var(--gold-bg);`
- Line 327: `background: rgba(212,168,67,.08);` → `background: var(--gold-bg);`
- Line 330: `background: rgba(212,168,67,.12);` → `background: var(--gold-bg4);`
- Line 335: `border-top: 2px solid rgba(212,168,67,.2);` → `border-top: 2px solid var(--gold-border);`
- Line 358: `background: rgba(212,168,67,.06);` → `background: var(--gold-bg3);`
- Line 390: `background:rgba(212,168,67,.15);` → `background:var(--gold-bg2);`
- Line 418: `background:rgba(212,168,67,.08); border:1px solid rgba(212,168,67,.3);` → `background:var(--gold-bg); border:1px solid var(--gold-border2);`

- [ ] **Step 11: Replace green rgba() with green-bg variables**

Affected: line 220

- Line 220: `background: rgba(76,175,110,.15);` → `background: var(--green-bg);`

- [ ] **Step 12: Replace overlay rgba(0,0,0,...) → var(--overlay) variables**

Affected lines: 378, 423

- Line 378: `background:rgba(0,0,0,.75);` → `background:var(--overlay);`
- Line 423: `background: rgba(0,0,0,.85);` → `background: var(--overlay-light);`

- [ ] **Step 13: Commit**

```bash
git add app.html
git commit -m "refactor: replace hardcoded colors in CSS with semantic variables"
```

---

### Task 3: Replace hardcoded colors in HTML inline styles

**Files:**
- Modify: `app.html` — all inline `style=""` attributes (lines 488-1485)

Replace every hardcoded color in HTML inline style attributes.

- [ ] **Step 1: Replace gold rgba in inline styles**

Line 488:
```
style="...background:rgba(212,168,67,.15);..."
→ style="...background:var(--gold-bg2);..."
```

- [ ] **Step 2: Replace `#444` in inline border styles**

Lines 575, 576, 930, 934, 949, 967, 1001, 1004, 1005:
```
border:1px solid #444 → border:1px solid var(--border-light)
border-left:3px solid #444 → border-left:3px solid var(--border-light)
```

- [ ] **Step 3: Replace `#15151e` → `var(--code-bg)`**

Lines 702, 907, 926, 1001:
```
background:#15151e → background:var(--code-bg)
```

- [ ] **Step 4: Replace `#222` → `var(--divider)`**

Lines 904, 1014, 1015, 1020:
```
border-bottom:1px solid #222 → border-bottom:1px solid var(--divider)
border-top:1px solid #222 → border-top:1px solid var(--divider)
```

- [ ] **Step 5: Replace `#333` in inline styles → `var(--border)` or `var(--toggle-track)`**

Toggle tracks (lines 1127, 1141, 1254, 1266, 1279):
```
background:#333 → background:var(--toggle-track)
```

Input/textarea borders (lines 1145, 1320, 1330, 1376, 1385, 1386, 1399, 1428, 1447, 1485):
```
border:1.5px solid #333 → border:1.5px solid var(--border)
```

History labels (lines 5116, 5117, 5118):
```
border:1px solid #333 → border:1px solid var(--border)
```

- [ ] **Step 6: Replace `#ccc` → `var(--muted-text3)`**

Lines 1019, 1024:
```
color:#ccc → color:var(--muted-text3)
```

- [ ] **Step 7: Replace `#555` → `var(--muted-extra)`**

Lines 986 (×2):
```
color:#555 → color:var(--muted-extra)
```

- [ ] **Step 8: Replace `#111` → `var(--code-bg3)`**

Line 1013:
```
background:#111 → background:var(--code-bg3)
```

- [ ] **Step 9: Replace overlay-style rgba(0,0,0,...) → overlay variables**

Line 1481:
```
background:rgba(0,0,0,.9) → background:var(--overlay-heavy)
```

- [ ] **Step 10: Replace `#1a1a2e` → `var(--code-bg2)` and `#aaa` → `var(--muted-text2)`**

Lines 5116, 5117, 5118:
```
background:#1a1a2e → background:var(--code-bg2)
color:#aaa → color:var(--muted-text2)
```

- [ ] **Step 11: Commit**

```bash
git add app.html
git commit -m "refactor: replace hardcoded colors in HTML inline styles with CSS variables"
```

---

### Task 4: Replace hardcoded colors in JavaScript code

**Files:**
- Modify: `app.html` — JS `<script>` section

Replace hardcoded colors in JS template literals and `.style` assignments.

- [ ] **Step 1: Replace `#333` in JS .style assignments**

Lines 1801, 2079, 6408:
```js
.style.borderColor = '#333' → .style.borderColor = 'var(--border)'
```

- [ ] **Step 2: Replace `#444` in JS template strings**

Lines 1901, 2873, 4928, 5346, 5695:
```js
'#444' → 'var(--border-light)'
```

- [ ] **Step 3: Replace rgba() in JS string literals**

Lines 2798, 2815, 2873:
```js
'rgba(212,168,67,.15)' → 'var(--gold-bg2)'
'rgba(229,115,115,.12)' → 'var(--red-bg)'
'rgba(76,175,110,.12)' → 'var(--green-bg2)'
```

- [ ] **Step 4: Replace `#222` and `#2a2a30` in JS template strings**

Lines 2286, 2585, 2925:
```js
'border-bottom:1px solid #222' → 'border-bottom:1px solid var(--divider)'
'border-top:1px solid #222' → 'border-top:1px solid var(--divider)'
'border-top:1px solid #2a2a30' → 'border-top:1px solid var(--divider2)'
```

- [ ] **Step 5: Replace `.style.color` and `.style.background` in JS**

Lines 3055-3056, 3062-3063, 3087-3088:
```js
msg.style.background = 'rgba(224,82,82,.15)' → msg.style.background = 'var(--red-bg2)'
msg.style.color = '#e05252' → msg.style.color = 'var(--red)'
```

Lines 4309-4310:
```js
<span style="color:#e57373;"> → <span style="color:var(--error-text);">
box.style.color = '#e57373' → box.style.color = 'var(--error-text)'
```

- [ ] **Step 6: Replace `#333` inside JS template HTML strings**

Line 6099:
```js
'border:1.5px solid #333' → 'border:1.5px solid var(--border)'
```

- [ ] **Step 7: Commit**

```bash
git add app.html
git commit -m "refactor: replace hardcoded colors in JS with CSS variables"
```

---

### Task 5: Add theme toggle button and JS logic

**Files:**
- Modify: `app.html` — add HTML button in `#s-home`, add JS functions

- [ ] **Step 1: Add toggle button to home screen header**

In `#s-home` (line 473), add theme toggle button next to the settings icon (line 481):

Replace:
```html
<button class="settings-icon" onclick="goSettings()" title="设置">⚙</button>
```

With:
```html
<button class="settings-icon" onclick="toggleTheme()" id="theme-toggle-btn" title="切换主题">🌙</button>
<button class="settings-icon" onclick="goSettings()" title="设置">⚙</button>
```

- [ ] **Step 2: Add `initTheme()` function at the top of the `<script>` section**

Find the `<script>` tag opening and add after it:

```js
/* ── THEME ── */
function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.setAttribute('data-theme', stored);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
  updateThemeIcon();
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
}
function updateThemeIcon() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  const cur = document.documentElement.getAttribute('data-theme');
  btn.textContent = cur === 'light' ? '☀️' : '🌙';
}
```

- [ ] **Step 3: Add `prefers-color-scheme` listener and call `initTheme()`**

Find where `DOMContentLoaded` or page init occurs. If there's an existing init block, add `initTheme();` to it. Also add the media query listener:

```js
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
  if (!localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    updateThemeIcon();
  }
});
```

If no DOMContentLoaded handler exists, add one:
```js
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  // ... any other existing init calls
});
```

Check the existing script for `DOMContentLoaded` or init patterns and hook into them.

- [ ] **Step 4: Update `<html>` tag to include default `data-theme`**

Line 2:
```html
<html lang="zh-CN" data-theme="dark">
```

This ensures dark theme before JS runs (avoids flash).

- [ ] **Step 5: Commit**

```bash
git add app.html
git commit -m "feat: add theme toggle button and JS logic"
```

---

### Task 6: Verify light theme across all screens

**Files:**
- No file changes — manual verification

- [ ] **Step 1: Open app.html in browser, verify dark theme renders correctly (no regression)**

Check: home screen, topic card, buttons, labels, gold accents all look normal.

- [ ] **Step 2: Click theme toggle, verify transition to light theme**

Check: background white-ish, cards white, text dark, gold accent still visible, borders visible.

- [ ] **Step 3: Navigate through all screens in light mode**

Screens to verify:
- Home (`#s-home`)
- Ready (`#s-ready`) - topic card, outline, example
- Recording (`#s-countdown`, `#s-rec`) - timer, transcript box, word overlay
- Result (`#s-result`) - score ring, eval blocks, vocab upgrade, expansion compare
- History (`#s-history`) - list items, detail sections
- Topics (`#s-topics`) - tabs, filter chips, bank items
- Materials (`#s-materials`) - filter bar, material cards
- Phrases (`#s-phrases`) - word chips
- Settings (`#s-config`) - toggle switches, inputs
- Expansion source/ready/result (`#s-exp-source`, etc.)
- Topic picker overlay
- Manual input overlay
- Debug panel
- Deploy notice overlay

- [ ] **Step 4: Verify localStorage persistence**

Toggle theme → refresh page → theme should persist.
Clear localStorage → refresh → should follow system preference.

- [ ] **Step 5: Fix any contrast issues found during verification**

Common issues to check:
- Gold text on white background may need darker gold (already set to `#b8860b`)
- Muted text contrast on light backgrounds
- Code/pre blocks readability
- Overlay opacity for modals
- Toggle switch visibility

- [ ] **Step 6: Commit any contrast fixes**

```bash
git add app.html
git commit -m "fix: light theme contrast adjustments"
```
