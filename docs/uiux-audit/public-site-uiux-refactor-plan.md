# Public Website — UI/UX Report & Refactor Plan

> Full professionalism audit of the public marketing site (رانین فرایند), with real screenshots, prioritized findings, a design direction, and a ready-to-execute plan.
> Created 2026-07-01. **This is a plan only — nothing here has been executed.** Screenshots live in `./screenshots/`.
> Method: live capture of every page at desktop (1440px) + mobile (390px) against the running app with real DB data, a 5-dimension code audit (design-system, layout, components, a11y, content), and first-hand code review.

---

## 1. Executive summary

**Verdict: good bones, template assembly.** There is a genuinely thoughtful foundation here — a real design-token layer, real layout primitives, responsive behavior, skeleton loaders, next/image with good CLS control, and a well-built Button/Sheet. But the customer-facing marketing surface — the part a B2B relay buyer actually judges — is assembled like an unfinished starter template: it bypasses its own design system, ships leftover SaaS placeholder content, shows fake contact data, and presents the product catalog (the money pages) at its least finished. It currently reads as a competent freelance build, **not** a credible senior industrial B2B vendor.

**Professionalism scores (audit, 1–10):**

| Dimension | Score | One-line |
|---|---|---|
| Content, Copy & Information Architecture | **3** | Template SaaS nav, fake contact info, ~half of nav links 404, unverified Schneider claim |
| Design System & Consistency | **5** | Solid tokens, but the public site hardcodes gray/white and has no enforced type scale |
| Layout & Visual Hierarchy | **5** | Generic slider hero, inverted headings, 4 competing width systems, uneven rhythm |
| Component Architecture & Reuse | **5** | Two card systems, two carousel libs (one dead), broken mobile-menu exit animation |
| Accessibility, Responsive & RTL | **5** | Broken search focus, dead newsletter/filters, reduced-motion half-honored, RTL icon sides |

**The single most damaging issue** is not visual — it's **credibility**: the main navigation advertises project management, data analytics, cloud infrastructure and cybersecurity (a leftover SaaS template), the phone numbers are `۰۲۱-۱۲۳۴۵۶۷۸`, and the site claims to be an "official Schneider Electric representative." Fixing these is cheap and moves the needle more than any redesign.

**The single biggest visual weakness** is the **products experience**: category cards all repeat the same photo, product cards show "بدون تصویر" (no image) placeholders, the desktop grid leaves half the page empty, and the filter/sort controls are decorative and do nothing.

**Recommendation:** this does **not** need a rewrite. It needs a **consolidation refactor + content truth pass** — keep the foundation, remove the template scaffolding, enforce the system, and fix the product pages. Two shapes are offered in §5 (a fast Enhancement pass vs. a fuller Refactor with a new design direction). Either way, **Phase 1 (credibility) should ship first** — it's a few hours of work for the biggest trust gain.

---

## 2. Screenshots (visual evidence)

Captured live against the running app. Desktop = 1440px, Mobile = 390px. Full-page.

| Page | Desktop | Mobile |
|---|---|---|
| Home | [home-desktop.png](./screenshots/home-desktop.png) | [home-mobile.png](./screenshots/home-mobile.png) |
| About | [about-desktop.png](./screenshots/about-desktop.png) | [about-mobile.png](./screenshots/about-mobile.png) |
| Contact | [contact-desktop.png](./screenshots/contact-desktop.png) | [contact-mobile.png](./screenshots/contact-mobile.png) |
| Products | [products-desktop.png](./screenshots/products-desktop.png) | [products-mobile.png](./screenshots/products-mobile.png) |
| Product detail | [product-detail-desktop.png](./screenshots/product-detail-desktop.png) | [product-detail-mobile.png](./screenshots/product-detail-mobile.png) |
| Login | [login-desktop.png](./screenshots/login-desktop.png) | [login-mobile.png](./screenshots/login-mobile.png) |
| Signup | [signup-desktop.png](./screenshots/signup-desktop.png) | [signup-mobile.png](./screenshots/signup-mobile.png) |

### Per-page visual notes

- **Home** — Hero (dark image + turquoise CTA) reads fine, but every section below the fold is hidden until scrolled into view via fade-in, so on first paint the page is mostly empty; one feature section (ارسال سریع) frequently fails to appear at all. Product **categories all show the same relay photo**. Rhythm lurches from full-viewport editorial blocks to compact bands.
- **About** — The most competent page: stats, mission/vision cards, values, turquoise contact band. But imagery is **generic stock** (shipping ports, businesspeople in suits — not electrical), the phone is a **fake placeholder**, and there are **two `<h1>`s**.
- **Contact** — Clean form + info card. Same fake phones (`۰۲۱-۱۲۳۴۵۶۷۸`, `۰۹۱۲-۳۴۵۶۷۸۹`) and `پلاک ۱۲۳۴` address. Hero photo is a stock call-center image.
- **Products** — **Weakest page.** Desktop: category carousel of identical images, then a category title, then a grid with **only 2 items floating on the right and the entire left half empty** (reads as broken), with **"بدون تصویر" placeholders**. Filter/Sort buttons do nothing.
- **Product detail** — Best-composed page: image gallery, spec chips, feature checklist. But spec values are **bare numbers with no units** (`ورودی ولتاژ: 4`), text is truncated (`230VAC/DC...110`), the CTA is buried mid-page, and there's no breadcrumb, datasheet, or related products.
- **Login / Signup** — Functional but bland: a small card floating in a large empty white field, no branding or split-screen treatment. (The circled "N" in shots is the Next.js dev indicator, not part of the UI.)
- **Mobile** — Responsiveness is genuinely OK: hamburger menu, single-column stacks, no horizontal scroll. The products grid actually looks *better* on mobile (single column) than desktop, confirming the empty-half issue is a desktop-grid problem.

---

## 3. Findings by theme (prioritized)

Severity: 🔴 high · 🟠 medium · 🟡 low. `file:line` references are to `apps/web/`.

### 3.1 Credibility & content truth — *fix first, cheapest, highest impact*
- 🔴 **Nav is leftover SaaS template.** The Products mega-menu sells project management, data analytics, cloud infrastructure, cybersecurity, software development. `constants/index.ts:62`
- 🔴 **~Half the nav dead-ends in 404s.** Services mega-menu, "بینش‌ها", footer "services", and hero slide-3 CTA all point to routes that don't exist (only `/`, `/products`, `/about`, `/contact` are built). `constants/index.ts:80`
- 🔴 **Fake contact data everywhere** — `۰۲۱-۱۲۳۴۵۶۷۸`, `۰۹۱۲-۳۴۵۶۷۸۹`, `پلاک ۱۲۳۴`. Shown on Contact, About, topbar CTA. `constants/index.ts:309`
- 🔴 **Unverified "official Schneider Electric representative" claim** site-wide + Schneider logo in the hero. Legal/trust risk if not an appointed distributor. `constants/index.ts:24`, `home/Hero.tsx:176`
- 🟠 **English placeholder product data** on an all-Persian site ("Schneider Electric product", raw order codes as names). `constants/index.ts:435`
- 🟠 **Positioning is ambiguous** — metadata says "protection-relay specialist"; hero/catalog say "broad electrical supplier". `app/layout.tsx:17`
- 🟠 **Fabricated round-number stats** (۲۰+/۵۰۰+/۱۰۰۰+/۲۴/۷); "۲۴/۷" contradicts the stated work hours. `constants/index.ts:373`
- 🟡 **Inconsistent CTA wording** (بیشتر بدانید / درخواست پیش‌فاکتور / مشاهده محصولات / تماس بگیرید) — no canonical conversion verb. `home/Hero.tsx:87`
- 🟡 **Stale hard-coded "© ۲۰۲۵"** + missing OG/Twitter share image + brand-name drift (رانین فرایند vs "رانین فرایند صنعت گستر" in the logo). `layout/Footer.tsx:73`, `app/layout.tsx`

### 3.2 Product experience — *the money pages*
- 🔴 **Products list shows ≤20 published items via the wrong (public) endpoint**, and product **images are missing** so cards render "بدون تصویر". (Endpoint issue detailed in the perf plan Phase 4.) `actions/dashboard/products.ts` + data
- 🔴 **Filter & Sort are decorative** — no handlers; clicking "قیمت (کم به زیاد)", "موجود در انبار" does nothing (with fake Toman bands). `pages/products/ProductsFilters.tsx:43`
- 🟠 **Desktop grid leaves half the page empty** — a wide grid with 2 items right-aligned and no filter rail to balance it. `app/(public)/products/page.tsx`
- 🟠 **Category cards all reuse the same relay photo** → monotonous, looks like seed data. `ui/CategoryCard.tsx`
- 🟠 **Product-detail gaps** — CTA buried mid-page, no breadcrumb/category back-link, no price/availability, specs as flat gray chips (bare numbers, no units), no datasheet download, empty-section headings still render. `app/(public)/products/[slug]/page.tsx:94`
- 🟠 **ProductCard "تماس بگیرید" is a fake `<div>` button** nested inside the card's `<Link>` — looks like a call CTA but just navigates. `ui/ProductCard.tsx:62`

### 3.3 Design-system consistency
- 🔴 **Flagship ProductCard uses zero tokens** (`bg-white`, `border-gray-100`, `text-gray-900`, `hover:shadow-xl`) while the dashboard uses `bg-card`/`border`/`shadow-theme-*`. `ui/ProductCard.tsx:9`
- 🔴 **No enforced type scale** — `Heading`/`Text` are overridden on nearly every use; H1s range across `text-4xl/5xl/6xl` and weights across semibold/bold/extrabold/black; some headings skip the primitive entirely. `ui/Heading.tsx:10`
- 🟠 **`Text` default is `text-gray-700`** (a raw gray, not a token), so it's overridden everywhere. `ui/Text.tsx:12`
- 🟠 **~42 hardcoded gray/white utilities across 19 public components** bypass the brand tokens (topbar/footer paint `bg-gray-900`). `layout/Topbar.tsx:9`
- 🟠 **Radius tokens are dead** (defined in `:root`, not in `@theme`), so card radius is ad hoc (`rounded-xl` vs `rounded-2xl` vs `rounded-lg`). `globals.css:43`
- 🟠 **Two shadow systems** — dead `:root --shadow-*` + live `--shadow-theme-*`; marketing cards use Tailwind's default `shadow-lg/xl`. `globals.css:48`
- 🟠 **Section surfaces hardcode `bg-gray-200`** instead of `bg-muted`; no dark-surface token. `pages/about/AboutStats.tsx:18`
- 🟡 **Dark-mode scaffolding only themes the sidebar** — half-built, ships dead weight, blue primary contradicts the turquoise brand. `globals.css:219`

### 3.4 Layout & hierarchy
- 🔴 **Hero is a generic 3-slide autoplay slider** with a vague "بیشتر بدانید" CTA and a one-logo "trust bar". `home/Hero.tsx:87`
- 🔴 **Four competing width systems** — product pages use raw Tailwind `container`; home/about/contact use the `Container` primitive; sections hardcode their own `max-w`. `app/(public)/products/page.tsx:29`
- 🔴 **Inverted heading hierarchy** — the biggest text is an `h2` while the `h1` is a tiny eyebrow label. `pages/products/ProductsHeader.tsx:53`
- 🟠 **Uneven home rhythm** — two full-viewport editorial blocks (walls of ~90-word text) next to compact bands. `home/AnimatedFeatures.tsx`
- 🟠 **Consumer-grade chrome on the catalog** — pulsing dots, "اسکرول کنید", drag hints compete with the product title. `ui/CategoryCarousel.tsx`
- 🟡 **Single-logo trust bar** + **double-nested container** on the product gallery. `home/Hero.tsx:173`, `pages/product-detail/ProductImages.tsx:30`

### 3.5 Broken / non-functional
- 🔴 **Site search loses focus every keystroke** — `SearchContent` is defined inside render, remounting the input on each change. `ui/SearchModal.tsx:89`
- 🔴 **Newsletter form is dead** — no `onSubmit`/action/label; submitting reloads the page. `home/NewsletterSection.tsx:44`
- 🔴 **Product filters/sort do nothing** (see 3.2). `pages/products/ProductsFilters.tsx:43`
- 🟠 **Mobile-menu exit animation is broken** — Navbar never forwards the `open` prop to `Sheet`, so it blinks out after a 300ms blank delay instead of sliding. `layout/Navbar.tsx:106`
- 🟡 **`layout/Header` is a redundant passthrough**; **two carousel libraries** ship (embla `ui/carousel.tsx` is 100% dead code, Swiper is used). `layout/Header.tsx:7`, `ui/carousel.tsx`

### 3.6 Accessibility, motion & RTL
- 🟠 **Reduced motion only half-honored** — no global `@media (prefers-reduced-motion)`; hero autoplay, `scroll-hint`, `animate-pulse`, `bg-fixed` parallax all ignore it. `globals.css:177`
- 🟠 **Hero autoplays with no pause control** (WCAG 2.2.2). `home/Hero.tsx:115`
- 🟠 **Icon-only search buttons have no accessible name**; **hamburger lacks `aria-expanded`/`aria-controls`**. `ui/SearchModal.tsx:204`, `layout/Navbar.tsx:99`
- 🟠 **Duplicate/mis-ordered headings** (two h1 on About, per-slide h1 on home, h6→h2 eyebrow pattern). `pages/about/AboutHero.tsx:32`
- 🟠 **RTL physical sides** — product-gallery arrows and search icon/spinner use `left/right` instead of logical `start/end`, so directional controls sit/point the wrong way in RTL. `pages/product-detail/ProductImages.tsx:63`, `ui/SearchModal.tsx:92`
- 🟠 **Low-contrast placeholders/helper text** (`placeholder:text-muted-foreground/50`, `text-gray-400` ≈ 2.5:1, below AA). `pages/contact/ContactForm.tsx:137`
- 🟡 **Custom buttons/card links miss focus-visible rings**; **32px tap targets** (< 44px) on carousel/gallery/hamburger; **`bg-fixed` parallax breaks on iOS Safari**; **generic `alt="Slide 1"`** / empty product alt. `ui/CategoryCarousel.tsx:142`, `home/ParallaxSection.tsx:56`, `home/Hero.tsx:133`

---

## 4. Design direction (to make it read modern & professional)

The brand identity already exists (muted turquoise, IranSans, soft elevation). The goal is not a new look — it's to make the site feel **intentional, technical, and trustworthy**, like an engineering supplier rather than a template. Five moves:

1. **Pick one positioning and commit.** Lead as a **protection & power-equipment specialist** ("رله‌های حفاظتی و تجهیزات حفاظت الکتریکی") and present breakers/transformers/cables as complementary. Align hero, About, metadata, and nav to it. Ambiguity reads as amateur; focus reads as expert.

2. **A technical, restrained visual language.** Keep turquoise as the single accent. Add proper tokens for a **deep engineering ink/slate surface** (replacing ad-hoc `gray-900` in topbar/footer/hero overlays) and use the existing `--muted` for neutral bands (not `gray-200`). Numbers/specs in **tabular figures**. Elevation via the one `shadow-theme-*` scale. One card radius.

3. **Signature element — the single-line diagram.** The one memorable, on-brand device: a thin **schematic/single-line-diagram hairline motif** (turquoise, low-opacity) drawn from electrical drawings — used sparingly as the hero backdrop accent, section dividers, and a corner detail on product cards. It grounds the design in the subject's own world (relay/protection schematics) and is distinctive without being loud. Spend the boldness here; keep everything else quiet.

4. **Spec-forward product presentation.** For a relay buyer, the product *is* its spec sheet. Make product cards and the detail page **data-first**: real product image (or an intentional branded technical placeholder, never "no image"), a clean **key/value spec table** with units, a prominent **"استعلام قیمت / دانلود دیتاشیت"** action beside the title, breadcrumb, and related products. This is where credibility is won.

5. **Confident single hero + real trust.** Replace the rotating slider with **one** static, characteristic statement of what the company does, a **concrete primary CTA** (`مشاهده محصولات` / `استعلام قیمت`), a real product/technical hero image, and a genuine **certifications/brands row** (IEC/ISO + Schneider *if authorized*). Motion: subtle, fast, purposeful, and fully reduced-motion-safe — drop the "everything fades in on scroll" pattern that leaves the page empty on first paint.

**Type ramp to enforce** (IranSans, one weight family): Display 48–64 / H1 36–44 / H2 28–32 / H3 20–24 / Body 16 / Caption 13–14; single heading weight (bold), eyebrows as `<span>` not headings.

---

## 5. Ready-to-execute plan

Two shapes — pick one (or run A now, B later). **Both start with Phase 1.** Effort: S ≈ <½ day, M ≈ ½–2 days, L ≈ 2–5 days (one dev).

- **Shape A — Enhancement pass** (Phases 1, 2, 3, 6): fix content truth, product pages, consolidate the system, fix bugs/a11y. Keeps the current visual language. Fastest path to "professional".
- **Shape B — Full refactor** (A + Phase 4 + Phase 5): also replaces the hero, adds the schematic signature, reworks home rhythm and imagery. Highest ceiling.

### Phase 1 — Credibility & content truth  ·  *do first*  ·  mostly S
- [ ] Regenerate the nav mega-menus from `productCategories` (real electrical taxonomy → `/products?category=<slug>`). `constants/index.ts:54`
- [ ] Remove or build every 404 target: drop the SaaS "خدمات" sub-links, repoint "بینش‌ها" to the real blog (backend exists) or remove, fix footer "services" links, fix hero slide-3 `primaryHref`. `constants/index.ts:80`
- [ ] Replace all placeholder contact data with real landline/mobile/address/postal + (optional) کد اقتصادی. `constants/index.ts:309`
- [ ] Resolve the Schneider "نمایندگی رسمی" claim — keep only if authorized (link the certificate), else soften to "تأمین‌کننده/فروشنده". `constants/index.ts:24`
- [ ] Persian display name + short Persian description for every product; keep order codes as SKU. `constants/index.ts:435` (+ seed/DB)
- [ ] Pick positioning; align hero/About/metadata. Real/defensible stats; fix 24/7-vs-hours. Dynamic copyright year; fix brand-name drift; add OG image. `app/layout.tsx`, `layout/Footer.tsx:73`
- **Acceptance:** no dead nav links; no placeholder digits; nav reflects the real catalog; one consistent brand name; legal claim verified or softened.

### Phase 2 — Product experience  ·  M–L
- [ ] Product **images**: source real photos, or design one intentional branded technical placeholder (never "بدون تصویر"). `ui/ProductCard.tsx`
- [ ] Fix the **products list endpoint + pagination** (see `dashboard-performance-plan.md` Phase 4) so all products show; add server-side filter/sort.
- [ ] Implement **real Filter/Sort** (update `searchParams` + refetch) **or remove** the controls. `pages/products/ProductsFilters.tsx:43`
- [ ] Fix the **desktop grid** empty-half (add a filter rail or align/justify the grid; sensible min column count). `app/(public)/products/page.tsx`
- [ ] **Product detail**: CTA in a summary block beside the title; breadcrumb + category link; **spec key/value table with units**; datasheet/catalog download (`catalogUrl`); related products; guard empty spec/feature sections. `app/(public)/products/[slug]/page.tsx`
- [ ] Make ProductCard's CTA a **real Button** (or an honest label), token-styled. `ui/ProductCard.tsx:62`
- **Acceptance:** every product card shows an intentional image; grid fills its width; filters work or are gone; detail page has breadcrumb + spec table + working primary action.

### Phase 3 — Design-system consolidation  ·  M
- [ ] Enforce the **type scale**: `Heading`/`Text` own responsive size+weight per level; remove per-call size/weight overrides; eyebrows → `<span>`; one heading weight. `ui/Heading.tsx`, `ui/Text.tsx`
- [ ] Fix **heading semantics**: exactly one `<h1>`/page, sequential levels, size decoupled from level. (a11y + SEO)
- [ ] Move **radius tokens into `@theme`**; standardize one card radius across Card/ProductCard/CategoryCard/forms. `globals.css:43`
- [ ] Delete dead `:root --shadow-*`; replace marketing `shadow-lg/xl` with `shadow-theme-*`. `globals.css:48`
- [ ] Replace **~42 hardcoded grays/whites** with tokens; add a `--surface-inverse` (ink/slate) token for topbar/footer/overlays; `bg-gray-200` → `bg-muted`. `layout/Topbar.tsx`, `layout/Footer.tsx`, `pages/about/*`
- [ ] Route **every page/section through the single `Container` + a `Section` rhythm**; remove raw `container mx-auto` and per-section `max-w`. `app/(public)/products/*`
- [ ] Rebuild **ProductCard/CategoryCard on the shared `Card` primitive** + tokens. `ui/ProductCard.tsx`, `ui/CategoryCard.tsx`
- **Acceptance:** one type scale, one card radius, one shadow scale, one width system, zero raw `gray-*`/`bg-white` in public components (add a lint/grep gate).

### Phase 4 — Hero, home composition & design direction  *(Shape B)*  ·  L
- [ ] Replace the slider with a **single confident hero** + concrete CTA + real product/technical image + genuine certifications/brands row. `home/Hero.tsx`
- [ ] Introduce the **single-line-diagram signature motif** (hero accent, dividers, card corner). New asset + light CSS.
- [ ] Tighten `AnimatedFeatures` — drop forced full-viewport height, cut copy to 1–2 sentences + scannable bullets, consistent `Section` cadence. `home/AnimatedFeatures.tsx`
- [ ] Richer neutral **section palette** (brand tint + hairlines) beyond white/gray; distinct imagery per section (retire generic stock ports/office photos). `pages/*`, `constants`
- [ ] Reframe/replace the newsletter as a B2B **"دانلود کاتالوگ / استعلام قیمت"** block. `home/NewsletterSection.tsx`, `constants:267`
- **Acceptance:** one-statement hero with a real CTA and real trust marks; home rhythm even; imagery on-topic; signature motif present but restrained.

### Phase 5 — Functionality bugs & accessibility  *(fold into A for a solid baseline)*  ·  S–M
- [ ] Fix **SearchModal** focus loss (hoist `SearchContent` to module scope). `ui/SearchModal.tsx:89`
- [ ] Wire the **newsletter** form to a server action (or remove). `home/NewsletterSection.tsx`
- [ ] Fix the **Sheet exit animation** (forward `open` to overlay/content, ideally via context). `layout/Navbar.tsx:106`
- [ ] Add a global **`@media (prefers-reduced-motion: reduce)`** kill-switch; disable hero autoplay under it; add a hero **pause/play** control. `globals.css`, `home/Hero.tsx`
- [ ] a11y: `aria-label` on icon buttons; `aria-expanded`/`aria-controls` on hamburger + group toggles; descriptive `alt`; focus-visible rings on all custom buttons/links; ≥44px tap targets; raise low-contrast placeholders/icons. `ui/SearchModal.tsx`, `layout/Navbar.tsx`, `pages/*`
- [ ] RTL: logical `start/end` + mirrored chevrons for gallery/search/carousel. `pages/product-detail/ProductImages.tsx`, `ui/SearchModal.tsx`
- **Acceptance:** search typable; newsletter works or gone; menu animates closed; reduced-motion fully honored; keyboard-navigable with visible focus; RTL controls correct; automated a11y (axe) clean on all pages.

### Phase 6 — Cleanup & enhancements  ·  S–M
- [ ] Delete dead code: pick one carousel lib (drop embla `ui/carousel.tsx` + dep, or migrate off Swiper); collapse or repurpose `layout/Header`. `ui/carousel.tsx`, `layout/Header.tsx`
- [ ] Finish or remove the half-built **dark-mode** scaffolding. `globals.css:219`
- [ ] Optional enhancements: certifications/standards page, real blog/insights (repoint "بینش‌ها"), downloadable catalog PDF, product compare.
- **Acceptance:** no unused UI libs/components; theming coherent; no "coming soon" dead ends in nav.

### Recommended sequencing
1. **Phase 1** (½–1 day) — ship immediately; biggest trust gain per hour.
2. **Phase 5** bug subset (search, newsletter, Sheet) — quick, removes "broken" feel.
3. **Phase 2** — the product pages (highest visual ROI).
4. **Phase 3** — consolidate the system so everything after is consistent.
5. **Phase 4** (Shape B) — hero + design direction, once the system is clean.
6. **Phase 6** — cleanup.

---

## 6. Notes & cross-references
- Performance findings (why pages load slowly; the wrong product endpoint; caching) are in `docs/dashboard-performance-plan.md`. Phase 2's endpoint/pagination fix overlaps that plan's Phase 4 — do them together.
- The dashboard/admin UI was already refactored to the brand and is **not** in scope here (it scored well in the audit and is the reference for correct token usage).
- Screenshots reflect the app in **dev mode** with current seed data; the "N" badge and the intermittent blank feature-section are dev/animation artifacts noted in §2/§3.5, not separate design defects.
- **Nothing in this plan has been executed** — awaiting your review before any changes.
