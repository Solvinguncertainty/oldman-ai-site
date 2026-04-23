# Website Update — 2026-04-22

Branch: `website-update-2026-04-22` (branched from `master` at commit `74c3ef1`)

To revert any single change: read the section below, the list of touched files,
and the before/after snippets. To revert the entire update, discard this branch:
`git checkout master && git branch -D website-update-2026-04-22`.

## Summary

| # | Change | Status |
|---|---|---|
| 1 | Foreman OS added as lead product | ✅ Done (placeholder logo) |
| 2 | Products reordered: Foreman OS → Quote Machine → OneForty → Innermost → Pudwiser | ✅ Done |
| 3 | Products moved off home page to dedicated `/products` route; home gets compact "See Our Products →" CTA | ✅ Done |
| 4 | All "McKinsey" / "McKinsey-style" language removed | ✅ Done |
| 5 | "Individuals" removed from the ICP (Services audiences chip + intro description) | ✅ Done |
| 6 | Nav: Shop + Fantasy Draft moved under a "More ▾" dropdown (mobile flattens) | ✅ Done |
| 7 | About section rewritten in "we" voice. New paragraphs: Bridging Generations + Tyler (one mention, generic), Mission (shape your own life / reduce suffering / stop wasted ambition). Beliefs heading is now "What We Believe." | ✅ Done |
| — | **Bonus:** OneForty "Under the hood" paragraph de-jargoned. Innermost "Stack" line removed. | ✅ Done |
| — | **Bonus:** Cory's Craft About tightened — "shipped from a single workshop by the same person who designed it" → "designed, printed, finished, and shipped from a single workshop." | ✅ Done |
| — | **NOT touched (per explicit instruction):** Buy back your time language, brand name/logo, Speaking/Training/Consulting/Building structure, pricing, contact info. | ✅ Preserved |

## All files modified

**New files:**
- `public/foreman-os-logo.svg` (placeholder — swap file in place when real asset ready)
- `src/app/products/page.tsx`
- `src/app/products/_products.html`
- `CHANGELOG-website-update.md` (this file)

**Modified files:**
- `src/app/layout.tsx` (meta description — removed McKinsey)
- `src/app/_body.html` (nav, McKinsey removal in Consulting panel, audiences chip row, removed products section + added compact CTA, About rewrite)
- `src/app/globals.css` (`.products-hero`, `.products-cta`, `.nav__more` dropdown styles + mobile overrides)
- `src/app/ClientScripts.tsx` (More dropdown open/close logic with outside-click + Escape)
- `src/app/shop/the-craft/about/page.tsx` (one-line tightening to collective shop voice)

## Where is the backup?

This work lives on a separate branch: `website-update-2026-04-22` (based off `master@74c3ef1`).

- **Master is untouched** — it's still the pre-update version.
- **Vercel will generate a preview URL for this branch** — review there before merging.
- **To revert a single change:** refer to the per-change section below and manually undo using the Before/After snippets.
- **To revert the entire update:** `git checkout master && git branch -D website-update-2026-04-22` (the branch hasn't touched master, so dropping it discards everything cleanly).
- **To ship everything to production:** open a PR from this branch to master, or fast-forward merge via `git checkout master && git merge website-update-2026-04-22 && git push`.

---

---

## Pre-work

- Created branch `website-update-2026-04-22` from `master@74c3ef1`
- Created this changelog file

---

## Global voice rules applied

- First-person singular ("I", "my", "me") replaced with first-person plural
  ("we", "our", "us") site-wide, except where a sentence is specifically
  attributed to Greg by name.
- No emphasis on team size. No "just the two of us", no "Greg and Tyler" as
  a headline. Just "we", like any company.
- Existing tone preserved: grounded, no hype, no jargon.

Changes to voice are logged inside the sections below where they happened.

---

## Change 1 — Add Foreman OS as the lead product

**Files touched:**
- `public/foreman-os-logo.svg` (NEW, placeholder)
- `src/app/products/_products.html` (NEW)

**Added:**
- Category: "On-Site AI Infrastructure"
- Short card blurb: _"A proprietary AI operating system deployed on-site at your business. Your data never leaves your building. You own the deployment. Automation without the cloud."_
- Detail (4 paragraphs):
  1. Tagline: _"Your AI. Your building. Your data."_
  2. Flagship pitch (what it is, what it does, framed against cloud AI services)
  3. Why it matters (data sovereignty, vendor independence, uptime control)
  4. Ownership model (you own infrastructure, models, and data; no lock-in)
  5. Close: **"This is AI infrastructure you own, not AI you rent."**

**Placeholder image:** `/foreman-os-logo.svg` (a navy-slate SVG with server-rack silhouette + wordmark, marked as placeholder in-file). Swap file at that path when the real brand asset is ready.

---

## Change 2 — Reorder products

New order on `/products`:
1. Foreman OS
2. The Quote Machine
3. OneForty
4. Innermost
5. Pudwiser

**Files touched:**
- `src/app/products/_products.html` (tiles + detail blocks ordered as above)

---

## Change 3 — Move products to a dedicated /products page

**Files touched:**
- `src/app/_body.html` (products section removed, replaced with compact CTA)
- `src/app/products/page.tsx` (NEW)
- `src/app/products/_products.html` (NEW — full products page content)
- `src/app/globals.css` (`.products-hero`, `.products-cta` styles added)

**Home page (new compact section, replaces the big products block):**
- Label: "Products"
- Title: "Proof of capability."
- Description: _"We build AI systems that solve real problems — for businesses, schools, and anyone willing to dream bigger. Five products in two months. Because when you understand how AI works, anything is possible."_
- Primary blue button: **"See Our Products →"** → `/products`

**New `/products` page hero:**
- Label: "Products"
- Title: "Proof of capability."
- Lead: _"When you understand the principles of AI, you can build anything. These aren't our product line — they're proof of capability. Five domains, one team. This is what's possible when you stop treating AI as a feature and start treating it as a medium."_

**All internal `#products` anchor links now point to `/products`** (nav link, Services Building note, footer link). The existing `id="products"` anchor on the home page's CTA section is preserved so any hard-coded external links still land somewhere sensible on the home page.

**Bonus: De-jargoned product details as discussed.**

*OneForty detail — middle paragraph:*
- Before: Very technical: "25-table Supabase backend with full multi-tenant row-level security, deterministic readiness and longevity scoring engine, 6-pattern detection system, GPT-4o-powered Action Plan generator..."
- After: Customer-facing: _"Behind the scenes, OneForty pulls sleep, HRV, training load, nutrition, and biomarker data into one intelligence layer, detects hidden patterns, and turns it all into plain-English coaching. Workouts come with rep-by-rep AI-narrated audio in whatever coaching style fits you that day — from drill sergeant to zen. Macros get estimated from photos. Meal plans and grocery lists generate weekly. Lab results become readable health reports. Progress gets visible and celebrated. The complexity stays hidden; the clarity shows up."_

*Innermost detail — removed the trailing "Stack: Next.js 15 · TypeScript · Supabase · Claude · Tailwind" line entirely.* Product page is for customers, not developers.

*Quote Machine / Pudwiser* — unchanged (already customer-facing).

**Also fixed as part of this change:**
- Services intro description ("Built for businesses, enterprises, schools, **and individuals** who want to master AI...") — "and individuals" removed to stay consistent with Change 5.

---

## Change 4 — Remove "McKinsey" / "McKinsey-style" language

**Files touched:**
- `src/app/layout.tsx`
- `src/app/_body.html` (Consulting panel lead + Full Business Assessment card)

**Before / After:**

`layout.tsx` meta description:
- Before: `"Custom AI solutions, McKinsey-style business consulting, and training..."`
- After: `"Custom AI solutions, rigorous business consulting, and training..."`

`_body.html` Consulting panel lead:
- Before: `"Most consultants hand you a deck and a bill. I hand you a working solution. Every engagement starts with a full McKinsey-style business assessment..."`
- After: `"Most consultants hand you a deck and a bill. We hand you a working solution. Every engagement starts with a full business assessment..."`
  (Also flipped "I hand / I build" → "we hand / we build")

`_body.html` Full Business Assessment card:
- Before: `"Rigorous diagnostic in the McKinsey tradition. Operations, workflows, team dynamics, tech stack — the full picture."`
- After: `"A rigorous diagnostic of operations, workflows, team dynamics, and tech stack — the full picture of where you are and where you could be."`

No borrowed-authority references remain.

---

## Change 5 — ICP: remove "Individuals"

**Files touched:**
- `src/app/_body.html` (`.services__audiences` chip row)

**Before:**
```
Who this is for: Businesses & Entrepreneurs · Enterprise & Institutions · Schools & Youth · Individuals
```

**After:**
```
Who this is for: Businesses & Entrepreneurs · Enterprise & Institutions · Schools & Youth
```

Note: the ICP is implemented as a row of chips inside the Services section (not a
4-card grid as I had remembered). No CSS grid adjustment was needed — chips just
reflow. The inconsistency I'd flagged in my pre-work about a 4-column grid was
wrong / outdated in my memory; no CSS change required here.

---

## Change 6 — Restructure nav (Shop + Fantasy Draft → More dropdown)

**Files touched:**
- `src/app/_body.html` (home nav)
- `src/app/products/_products.html` (products page nav)
- `src/app/globals.css` (`.nav__more`, `.nav__more-toggle`, `.nav__more-menu` + mobile overrides)
- `src/app/ClientScripts.tsx` (open/close logic, outside-click close, Escape close)

**Before:**
```
Services · Products · Shop · About · Fantasy Draft · [Contact]
```

**After:**
```
Services · Products · About · More ▾ · [Contact]
                                 └── Shop
                                 └── Fantasy Draft →
```

**Behavior:**
- Clicking "More" toggles a small dropdown with Shop + Fantasy Draft.
- Clicks outside, Escape key, or selecting a menu item closes it.
- Chevron rotates 180° when open.
- On mobile, the dropdown flattens into the stacked mobile menu (no extra tap needed).
- Shop and Fantasy Draft remain fully reachable via the footer "Explore" column.

---

## Change 7 — Rewrite About in "we" voice + add Tyler, Bridging Generations, mission

**Files touched:**
- `src/app/_body.html` (`.about__content` block)

**All first-person singular → plural, unless attributed to Greg by name.**

**Before / After snippets:**

*Lead:*
- Before: "I've spent my career in high-stakes environments where clarity matters and the wrong call has real consequences. That background taught me one thing above all else..."
- After: "We've spent our careers in high-stakes environments where clarity matters and the wrong call has real consequences. That background taught us one thing above all else..."

*Foundation paragraph:*
- Before: "...I help people and organizations understand what's real, figure out what matters..."
- After: "...We help people and organizations understand what's real, figure out what matters..."

*NEW Bridging Generations + Tyler paragraph (inserted as about__text):*
> An old man and AI. Tradition and the future. We sit at that intersection — bringing powerful new tools to the people, businesses, and generations who built the world we're standing on. Greg and Tyler run Oldman AI Solutions together, with the same conviction: good work leaves people better off than you found them.

(Tyler is introduced here, once, by first name only, no additional detail per direction. He doesn't reappear on any other page.)

*NEW Mission paragraph (inside the "Read more" details):*
> We believe people should shape lives after their own goals, not fall into whatever mold happens to be available. The default question shouldn't be "what job pays my bills" — it should be "what do I want to build with my life, and how do we make that real." We're here to reduce suffering, keep ambition from going to waste, and leave the people we work with better off than we found them.

*"Read more" closing paragraphs (still in details):*
- Before: "Whether I'm on stage, in a boardroom, or building a custom system..."
- After: "Whether we're on stage, in a boardroom, or building a custom system..."

*Beliefs heading:*
- Before: "What I Believe"
- After: "What We Believe"

**Structure preserved:** photo frame + badges left column; About section label, title, lead, body paragraphs, details disclosure, beliefs list right column. No layout changes. The section heading "Grounded in reality." stays unchanged.

**Team-size tone:** Tyler is present as "Greg and Tyler run Oldman AI Solutions together" — once, in one sentence. Rest of the prose is pure "we." No "just the two of us" energy.

---

## Change 8 — NOT TOUCHED (per explicit instruction)

- "Buy back your time" language
- Oldman AI Solutions brand name / logo
- Speaking / Training / Consulting / Building service structure
- Pricing (absent — stays absent)
- Contact info, phone, email
