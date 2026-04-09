# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static hotel website for "Пеликан Алаколь" (Pelikan Alakol) resort on Lake Alakol, Kazakhstan. It integrates with a separate Telegram bot backend (`pelikan-bot`) for bar orders, reviews, and notifications.

**Live site:** https://pelikan-alakol.kz  
**Bot:** @Pelican_alacol_hotel_bot (repo: https://github.com/Andreyhiitola/pelikan-bot)

## Session Workflow

**At the start of each session** — the SessionStart hook automatically injects the roadmap and open issues from memory into context. Review them before starting work.

**At the end of each session** — save a brief summary of what was done to a new memory file:
- Path: `~/.claude/projects/-home-andysag-Desktop-pelikan-alakol-site-v2/memory/session_YYYYMMDD.md`
- Type: `project`
- Content: changed files, fixed bugs, new features, remaining open issues
- Add a line to `MEMORY.md` index pointing to the new file

When a roadmap item is completed, mark it as `[x]` in `roadmap.md`.

## Local Development

```bash
# Start local dev server
python3 -m http.server 9001
# Then open http://localhost:9001
```

There is no build step, bundler, linter, or test runner — this is a plain HTML/CSS/JS project served as static files.

## Architecture

### Data flow
All page content is driven by JSON files fetched at runtime. `js/main.js` loads the JSON files and dispatches them to per-page render functions via `window.renderXxx()` callbacks. Each feature module exports its render function to `window.*`.

| JSON file | Content |
|-----------|---------|
| `barzakaz.json` | Bar menu items (id, category, name, price, description, image) |
| `infrastructure.json` | Hotel amenity cards with icons |
| `accommodation.json` | Room types |
| `menu.json` | Canteen meals |
| `reviews.json` | Fallback static reviews (live reviews come from the bot API) |
| `booking.json`, `faq.json`, `offer.json`, etc. | Section content |

### Pages
- `index.html` — main page, loads most JS modules
- `bar.html` — bar menu + cart + order form (Telegram Mini App compatible)
- `reviews.html` — guest reviews fetched from bot API
- `index_menu.html` — static canteen menu
- `miniapp.html` — dedicated Telegram Mini App entry point
- `booking.html`, `accommodation.html`, `activities.html`, etc. — info pages

### Key JS modules
- `js/bar.js` — self-contained module: loads `barzakaz.json`, renders menu, manages cart (persisted to `localStorage`), handles order submission with payment-method modal (card via Paybox or cash). Detects Telegram Mini App context via `window.Telegram.WebApp`.
- `js/reviews.js` — fetches live reviews from bot API, renders cards with per-criterion scores.
- `js/infrastructure.js` — renders amenity cards from `infrastructure.json`; `INFRASTRUCTURE_LINKS` maps card titles to internal pages.
- `js/main.js` — orchestrates JSON loading and dispatches to render functions.

### Backend integration (external — not in this repo)
- **Bar orders:** `POST https://apitelegram.parkpelikan-alakol.kz/api/order`
- **Reviews:** `GET https://apitelegram.parkpelikan-alakol.kz/api/reviews`
- For local development, swap `CONFIG.API_URL` in `js/bar.js` to `http://localhost:8080/api/order`
- Bot runs on VPS `85.192.40.138`, Docker Compose, port 8080

### Telegram Mini App
`bar.html` and `miniapp.html` include the Telegram WebApp SDK. `isInsideTelegramMiniApp()` in `bar.js` gates Mini App–specific behaviour (user data extraction from `tg.initDataUnsafe`, `tg.openLink()` for Paybox redirect). When running inside a Mini App, the order confirmation modal shows bot-notification messaging instead of a phone number.

## Deployment

```bash
# Upload to server
scp -r * user@server:/var/www/pelikan-alakol-site/
sudo systemctl reload nginx
```

Nginx proxies `/api/order` to the bot's port 8080. See `README.md` for the full Nginx config.
