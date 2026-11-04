# Handoff: rithwiku.github.io revamp (dark Modernist)

## Target
- Repo: `RithwikU/rithwiku.github.io` (Jekyll, al-folio theme), base branch `master`
- **Create a new branch** (e.g. `revamp-modernist`), implement there, push, and open a PR. Don't commit to `master` directly.

## Overview
A full visual redesign of the personal site: dark ground, a single red accent, set entirely in Archivo, zero border radius, strong ruled dividers and a visible grid. Instead of one long scroll, the site is split into separate pages:
**Profile** (home) · **Builds** · **Workshop** · **Timeline** · **Travels** · **Say hi**.

## About the design files
The files in this bundle are **design references built in HTML**. They're prototypes that show the intended look and behavior, not production code to copy directly. Rebuild them in the repo's Jekyll setup (layouts, includes, `_pages`, `_data`, Sass) using its existing patterns. `Website Revamp v2.dc.html` runs on a small prototype runtime (`support.js`). Open it in a browser to see it, but **do not ship `support.js`** or the `<x-dc>`/`<sc-if>`/`<sc-for>` markup.

## Fidelity
**High fidelity.** Match colors, type, spacing and rules exactly. Every value is inline in `Website Revamp v2.dc.html`, and tokens are in `modernist-styles.css`.

## Recommended Jekyll structure
- Replace or retire al-folio's theme Sass with a single `assets/css/modernist.scss` that carries the tokens (below), plus the component classes from `modernist-styles.css` (`.btn`, `.seg`, `.nav`, `.grayscale`, `.input`, etc.).
- `_layouts/default.html`: dark wrapper, sticky header (coordinate strip + nav) and footer.
- Pages in `_pages/` with permalinks: `/` (Profile), `/builds/`, `/workshop/`, `/timeline/`, `/travels/`, `/contact/`. Use real URLs, not the prototype's `#/` hash routing.
- Data:
  - `_projects/*.md`: keep the existing collection. Add front matter `category: work|fun`, `award:`, `date_range:` and `img:`.
  - `_data/cv.yml` (or a new `_data/timeline.yml`): experience + education.
  - `_data/profile.yml`: the About stats list.
  - `_data/travels.yml`: map pins (see Travels).
- Nav: current page link gets `aria-current="page"`, styled in the accent red.

## Global chrome
Page wrapper: `max-width:1200px; margin:0 auto; padding:0 24px`. Page background `#201e1d`, text `#f3f2f2`, `font-variant-numeric: tabular-nums`.

**Sticky header** (`position:sticky; top:0; z-index:5; background:#201e1d`):
1. Coordinate strip: flex row, `padding:8px 0`, `border-bottom:1px solid divider`, 11px uppercase, letter-spacing 0.1em, color neutral-400 `#bab6b6`. Left: `42.3601° N · 71.0589° W`. Right (margin-left:auto): `BOS HH:MM:SS`, a live 24h clock in America/New_York, updated every second (small inline JS).
2. Nav (`.nav`, `padding:16px 0`, wraps): brand "Rithwik" in text color + " Udayagiri" in `#ec3013`, 18px, weight 800. Then the links Profile, Builds, Workshop, Timeline, Travels, Say hi. Active link = accent red.

**Footer**: 11px uppercase, letter-spacing 0.1em, neutral-400, `padding:24px`, text `© 2026 RITHWIK UDAYAGIRI`.

## Screens

### 1. Profile (home, `/`)
**Hero** (`padding-top:96px`, `border-bottom:2px solid divider`)
- H1: "I build robots that find their own way" + red "." + a blinking red block cursor (0.08em × 0.8em, `@keyframes blink{50%{opacity:0}}`, 1s steps(1) infinite). Size `clamp(52px,9vw,128px)`, line-height 0.9, letter-spacing −0.04em, max-width 1100px, margin-bottom 72px.
- Three-cell ruled strip below it: equal columns, 2px gaps drawn as 1px box-shadow rules at `color-mix(#f3f2f2 30%, #201e1d)`. Stacks to one column below ~720px container width.
  1. Name "Rithwik Udayagiri" (800, 18px) over "Boston, MA" (13px, neutral-400).
  2. Paragraph, 16px, neutral-300 `#d7d3d3`: "I'm Rithwik, a robotics engineer at Luminous Robotics. I work on motion planning and decision making for autonomous robots."
  3. Two stacked buttons, labels flush left with the arrow pushed right (`justify-content:space-between`): `.btn-primary` "See my builds →" goes to /builds/. `.btn-secondary` "Say hi →" (text color `#f3f2f2`) goes to /contact/.

**About** (flex wrap, gap 32px, `padding:32px 0`, bottom 2px rule)
- Left column (flex 1 1 240px): eyebrow h6 "Operator profile" (accent-400 `#ff9783`), H2 "About" 56px, letter-spacing −0.03em. Portrait `assets/img/UdayagiriRithwik.jpeg` in `.grayscale`, max-width 240px, aspect 4/5, `object-position:center 20%`, 2px divider border.
- Right column (flex 2 1 420px): bio paragraph, 18px/1.6, neutral-300, max-width 720px: "I can't sit still. Projects, courses, competitions — I'm always juggling something and hunting for the next thing to learn. That took me from timing closure on NVIDIA silicon to racing go-karts with no driver, and now to teaching an outdoor robot where it is and where to go next."
- Stats grid below the bio (auto-fit, min 180px, 2px top rule, each cell has a 1px bottom rule, padding 16px 16px 16px 0). Each cell: key 11px uppercase neutral-400, value 800 16px.
  Base: Boston, MA · Class: Robotics engineer · Specialty: Planning · Control · Behavior Trees · Fuel: Chocolate · Off-duty: Cycling · Photography · Side quests: Home Assistant · Exploring the wild

### 2. Builds (`/builds/`)
- Header row: eyebrow "Build archive · {N} entries", H2 "Builds" 56px. On the right, a `.seg` segmented filter: All / Work / Fun. Filter client-side with a small JS script on `data-category`.
- Grid: `repeat(auto-fill,minmax(260px,1fr))`, 2px gap rules (as in the hero strip). Each card is a link to the project page, background `#201e1d`, hover background `#2d2b2b`.
  - Image: 4/3 aspect, `.grayscale`, 2px bottom rule. With no image, show a `#2d2b2b` block with the two-digit index in 800 88px, color neutral-800 `#444141`, bottom-left.
  - Meta row (11px uppercase, letter-spacing 0.08em): date range in accent-400 on the left, `B-01` style index in neutral-400 on the right.
  - Title: 800 22px/1.1. Description: 14px neutral-300.
  - Optional award chip: 1px accent border, accent-400 text, 11px, "★ {award}".
- Project data (title | desc | dates | img | category | award):
  1. SauberBOT | An autonomous garbage collection robot | Oct 2022 – May 2023 | sauberbot_group_pic.jpg | work | 1st, SICK TiM10k LiDAR Challenge
  2. F1Tenth | Autonomous racing for 1/10 model cars | Jan – May 2023 | f1tenth_car.JPG | work | 1st reactive race · 3rd map-based
  3. Autonomous EV Go Kart | Building, developing and coding an autonomous electric go-kart to race | Jan – Oct 2022 | gokart_purdue.jpeg | work | 1st, Purdue Autonomous Karting 2023
  4. Indoor-Outdoor Localization | Localizing and navigating indoor and outdoor terrains using a Velodyne 3D LiDAR and GPS | Apr – May 2023 | indoor_outdorr_map.png | work
  5. Chance Constrained MPC | Multi-agent path planning | Nov – Dec 2022 | chance_constrained_mpc.png | work
  6. Smart Infant Toy | A novel smart sensing medical toy for collecting and classifying infant interactions | Nov 2021 – Present | lossy_sensor_lattice.png | work | Abstract accepted, Frontiers
  7. NLMS on FPGA | Real-time implementation of a scalable 24-bit Non-Local Means Shift algorithm on FPGA | May – Jul 2019 | (none) | work
  8. 3D Scene Flow | AR Iron Man mask | Sep – Dec 2021 | Rithwik_output_image.png | work
  9. RL for Drones | Reinforcement learning to control drone flight | Apr – May 2022 | RL_drone_hover.png | work
  10. Automatic Waste Segregation | Undergraduate thesis | Aug 2019 – Apr 2020 | (none) | work
  11. Oxygen Concentrator | DIY garage project during COVID | 2020 – 2021 | oxygen_conc2.jpg | fun
  All images live in `assets/img/` in the repo already.

### 3. Workshop (`/workshop/`)
Placeholder for future interactive "build_" experiments. Eyebrow "Under construction", H2 "The Workshop". Right-hand copy (16px neutral-300, max-width 560px): "Interactive experiments I'm building right into this site. Bays open as they come online." Below it, 3 bays in an auto-fit grid (min 240px, gap 16px), each with a `1px dashed divider` border, min-height 180px, padding 24px: "Bay 01" (11px uppercase neutral-400) at the top, and "Awaiting build_" (800 18px neutral-500) at the bottom.

### 4. Timeline (`/timeline/`)
Two columns as in About: eyebrow "Career telemetry" + H2 "Timeline" on the left. On the right, rows with `grid-template-columns: 150px 1fr`, each with a 1px top rule and padding 16px 0. Date is 13px accent-400. Title is 800 18px, org 14px neutral-400.
- Nov 2023 – Now · Robotics Engineer · Milwaukee Tool
- Jul 2023 – Now · Research Engineering Intern · Recupero Robotics
- Nov 2021 – Now · Research Assistant · Rehabilitation Robotics Lab, UPenn
- Jan – Oct 2022 · Researcher · xLab, University of Pennsylvania
- Jul 2020 – Aug 2021 · ASIC Engineer · NVIDIA, Bangalore
Then a final row with a 2px top rule, labelled "Training": **MS Robotics** — University of Pennsylvania, 2021–2023; **B.Tech** — NIT Karnataka, Surathkal, 2016–2020.
(Note: the hero says Luminous Robotics while the timeline says Milwaukee Tool. Confirm the current employer with the site owner before shipping.)

### 5. Travels (`/travels/`)
Eyebrow "Places I've been", H2 "Travels", copy: "Drag to pan, scroll to zoom, hover a pin for details. Add a place by typing its coordinates or picking it straight off the map." Below that, the map at 640px tall. See `Travels Map.html` for the full working implementation (D3 v7 + topojson-client + world-atlas 110m, Natural Earth projection).
- Layout: map stage (flex 3) | side panel (flex 1, min 260px). 2px rules top, bottom and between the two.
- Countries fill `#2d2b2b`. A visited country (one that contains any pin) fills `#605d5d`, and hover lightens it one step. Graticule at 7% text alpha.
- Pins: square red markers (9px, scaled by 1/zoom) with a dark stroke. Labels show when zoom ≥ 3 or the pin is selected. Hover shows a tooltip (light box, dark text, name bold + note).
- Zoom controls top-right (+ / − / reset), 36px square buttons on the surface color.
- Panel: Places / Countries counters (800 40px red), a scrollable list (click to fly to a pin, × to remove) and an "Add a location" form (name, lat, lng, note, "Pick on map", "Add pin +").
- **Production data:** load pins from `_data/travels.yml` (render with Liquid into a JSON `<script>` or `jsonify`). The owner will replace the starter pins with real trips. Suggested schema:
  ```yaml
  - name: Boston, MA
    lat: 42.3601
    lng: -71.0589
    note: Home base
  ```
  Starter entries: Boston MA (Home base), Milwaukee WI (Milwaukee Tool), Philadelphia PA (UPenn, 2021–2023), West Lafayette IN (Purdue karting race), Bangalore India (NVIDIA), Surathkal India (NIT Karnataka).
- On a static site, the add/remove UI can only persist to `localStorage`. Either keep it as a personal "draft" tool, hidden behind a query flag like `?edit`, or remove it and treat the YAML as the only source. Ask the owner which. Default: read-only map from YAML.

### 6. Say hi (`/contact/`)
Full-bleed red section (`background:#ec3013`, text `#201e1d`, `min-height: calc(100vh - 150px)`, content aligned to the bottom, padding 96px 24px). Two-column auto-fit grid (min 340px):
- Left: "// Open a channel" (12px uppercase, letter-spacing 0.1em), then H2 "Let's build something weird." at `clamp(48px,7vw,100px)`, line-height 0.92, letter-spacing −0.035em.
- Right: stacked link rows separated by 2px dark rules (the rules show through a gap on a `#201e1d` 40% background). Each row is a flex with space-between and 16px vertical padding. Hover changes the text to `#f3f2f2`.
  - rithwik.ugiri@gmail.com → (800 20px, mailto)
  - GitHub ↗ https://github.com/RithwikU
  - LinkedIn ↗ https://www.linkedin.com/in/udayagiririthwik
  - Twitter ↗ https://twitter.com/RithwikUgiri

## Interactions
- Real page navigation replaces the prototype's hash routing, so the back button works natively.
- Builds filter: no reload, and it toggles card visibility.
- Header clock ticks every second.
- Hero cursor blinks. Respect `prefers-reduced-motion` (no blinking).
- Focus: `:focus-visible { outline:2px solid #ec3013; outline-offset:2px }`. No default blue ring.
- Responsive: all multi-column blocks wrap via flex-basis / auto-fit and stack to a single column on narrow screens. The nav wraps.

## Design tokens (dark override of Modernist)
- `--color-bg: #201e1d` · `--color-surface: #2d2b2b` · `--color-text: #f3f2f2`
- `--color-divider: color-mix(in srgb, #f3f2f2 30%, transparent)`
- `--color-accent: #ec3013`. Ramp: 400 `#ff9783` (eyebrows/dates on dark), 600 `#dd2b0f` (pressed), 700 `#ae1800`.
- Neutrals: 300 `#d7d3d3` (body copy), 400 `#bab6b6` (meta), 500 `#9b9797`, 700 `#605d5d`, 800 `#444141`, 900 `#2d2b2b`
- Font: Archivo 400/600/800 (Google Fonts). Headings are 800, letter-spacing −0.015em to −0.04em at display sizes. h6 is 13px uppercase, letter-spacing 0.08em.
- Spacing: 4, 8, 12, 16, 24, 32 px (+ 72/96 for hero spacing)
- Radius: **0 everywhere**
- Rules: 2px between major sections, 1px within lists
- Photos: always `filter: grayscale(1) contrast(1.08)`
- Links on dark: `#ff9783`, hover `#ec3013`

## Assets
- Portrait: `assets/img/UdayagiriRithwik.jpeg` (already in repo)
- Project images: `assets/img/*` (already in repo)
- Icons: arrows are text glyphs (→ ↗ ★). If you need more icons, use Lucide.
- Map: world-atlas countries-110m TopoJSON (jsDelivr CDN), D3 7.9, topojson-client 3.1

## Screenshots
`screenshots/`: 01-profile, 02-builds, 03-workshop, 04-timeline, 05-travels (page frame), 05b-travels-map (the map itself), 06-contact.

## Files in this bundle
- `Website Revamp v2.dc.html`: all six pages (prototype, needs `support.js` beside it to open)
- `Travels Map.html`: standalone map. In the prototype it's embedded via iframe, but in production inline it into the travels page.
- `modernist-styles.css`: design-system tokens + component classes. Override the ground to dark as listed above.
- `support.js`: prototype runtime only. Do not ship.
