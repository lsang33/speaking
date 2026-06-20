# Light Theme Design

**Date**: 2026-06-20
**Status**: approved

## Goal

Add a light/white theme to the app, toggleable with the current dark theme via a button in the home screen top-right corner.

## Approach

CSS custom properties on `<html>` with `data-theme` attribute. A single set of variables defined in `:root`, overridden in `[data-theme="light"]`. No CSS file duplication, no JS class toggling on individual elements.

## CSS Variable System

Replace all hardcoded color values with semantic variables. 10 existing variables expanded to ~20.

### Variable Map

| Variable | Dark value | Light value | Usage |
|----------|-----------|-------------|-------|
| `--bg` | `#0c0c0e` | `#f5f5f7` | Page background |
| `--card` | `#18181c` | `#ffffff` | Card background |
| `--card2` | `#222228` | `#eeeef2` | Secondary card / input background |
| `--text` | `#f0eff4` | `#1a1a1e` | Primary text |
| `--muted` | `#8b8a94` | `#6e6d7a` | Secondary / muted text |
| `--gold` | `#d4a843` | `#b8860b` | Accent (darkened for light bg contrast) |
| `--gold2` | `#f0c96a` | `#d4a843` | Lighter gold variant |
| `--border` | `#333` | `#d0d0d8` | Default border |
| `--border-light` | `#444` | `#c0c0c8` | Lighter border |
| `--divider` | `#222` | `#e0e0e6` | Section dividers |
| `--divider2` | `#2a2a30` | `#d8d8e0` | Secondary dividers |
| `--overlay` | `rgba(0,0,0,0.75)` | `rgba(0,0,0,0.4)` | Modal overlays |
| `--gold-bg` | `rgba(212,168,67,0.08)` | `rgba(184,134,11,0.08)` | Gold-tinted background |
| `--gold-bg2` | `rgba(212,168,67,0.15)` | `rgba(184,134,11,0.12)` | Gold badge background |
| `--gold-border` | `rgba(212,168,67,0.2)` | `rgba(184,134,11,0.25)` | Gold border |
| `--gold-border2` | `rgba(212,168,67,0.3)` | `rgba(184,134,11,0.35)` | Gold section border |
| `--green-bg` | `rgba(76,175,110,0.15)` | `rgba(76,175,110,0.12)` | Green-tinted background |
| `--red-bg` | `rgba(229,115,115,0.12)` | `rgba(229,115,115,0.1)` | Red-tinted background |
| `--on-accent` | `#000` | `#fff` | Text on gold button backgrounds |
| `--code-bg` | `#15151e` | `#e8e8f0` | Code block / special background |
| `--red` | `#e05252` | `#d32f2f` | Error/danger |
| `--green` | `#4caf6e` | `#388e3c` | Success |
| `--muted-extra` | `#555` | `#999` | Very muted text (fav stars, notes) |
| `--muted-text2` | `#aaa` | `#777` | Another muted variant |
| `--muted-text3` | `#ccc` | `#555` | Slightly-less-muted text |
| `--toggle-track` | `#333` | `#d0d0d8` | Toggle switch track background |
| `--warn` | `#e0a030` | `#c4841a` | Warning amber |

## Theme Toggle

- **Position**: Home screen (`#s-home`) top-right corner, before the content
- **Element**: `<button>` with sun ☀️ / moon 🌙 emoji
- **Behavior**: Toggles `<html>` `data-theme` between `"dark"` and `"light"`
- **Persistence**: `localStorage` key `"theme"` — values `"dark"`, `"light"`, or absent (auto)
- **Default**: When no stored preference, follow `prefers-color-scheme` media query
- **Style**: Transparent background, gold border, matches existing button aesthetic

## Implementation Steps

1. **Expand CSS variables** — Add new variables to `:root`, add `[data-theme="light"]` block with light values
2. **Replace hardcoded colors** — All `#333`, `#444`, `#222`, `#2a2a30`, `#555`, `#ccc`, `#aaa`, `rgba(0,0,0,...)`, `rgba(212,168,67,...)`, `rgba(76,175,110,...)`, `rgba(229,115,115,...)`, `#15151e`, `#1a1a2e` references become variable lookups
3. **Add toggle button** — HTML in `#s-home` + JS function `toggleTheme()`
4. **Init logic** — `initTheme()` reads localStorage → applies `data-theme` → sets up `prefers-color-scheme` listener
5. **Verify** — All screens, overlays, modals, pickers checked in light mode

## Scope

- `app.html` only — the single file containing all CSS and JS
- No changes to `topics.js`, `arguments.js`, `materials.js`, `words.js`, `phrases.js`
- Inline `style=""` attributes within JS template strings also need variable substitution
