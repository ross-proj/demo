# Design QA — R.O.S.S. RSA Demo

## Comparison target

- Source visual truth: `/Users/lucamarzotto/.codex/generated_images/01a0c12d-65c6-75e0-8b05-84c4f3f4fc50/exec-356473e5-c7d0-4640-93d8-7c9dfd7f6e20.png`
- Implementation capture: in-app browser capture of `http://localhost:4173/` on 2026-09-21.
- Source pixels: 1487 × 1058.
- Implementation pixels: 1440 × 1024.
- CSS viewport: 1440 × 1024 at device pixel ratio 1.
- Normalization: full-view comparison at matching desktop aspect ratio; browser chrome excluded.
- State: ROSS theme, Panoramica, deterministic demo dataset, menus closed, no toast.

## Full-view comparison evidence

The source and browser-rendered implementation were emitted together in the same comparison input. The implementation preserves the selected direction's hierarchy: persistent left navigation, editorial display heading, restrained warm palette, horizontal KPI strip, large operational timeline, resident overview and a right-hand “ROSS ha notato” panel. The implementation intentionally replaces the source's multi-row schedule matrix with the brief's 07:00–22:00 structure timeline plus resident baseline rows; this is a product-content decision, not accidental visual drift.

## Required fidelity surfaces

- Fonts and typography: the implementation uses a system sans-serif for controls and Georgia as a locally available editorial serif. Hierarchy, optical contrast, line length and wrapping match the reference direction; no clipped headings were observed.
- Spacing and layout rhythm: the desktop grid, sidebar, KPI rhythm and split operational surface match the reference. Tablet (1024 × 768) and mobile (390 × 863) have no horizontal document overflow.
- Colors and tokens: warm cream, deep green, coral, mint, sand and lilac map to semantic CSS tokens. Neutral and Care themes also update all surfaces and charts.
- Image quality and asset fidelity: the final demo uses privacy-safe initial avatars instead of generated portraits. Standard UI symbols use Lucide; the Knowledge Graph and charts are true data visualizations, not decorative image substitutes.
- Copy and content: Italian copy is concrete, non-clinical and consistently distinguishes observations, baseline comparisons and operator notes.

## Focused-region evidence

- Knowledge Graph inspected at the same desktop viewport after spacing and fit corrections; node categories, links, labels, filters and detail interaction are legible.
- Live interaction and completion modal inspected through the full task flow: start interaction, terminate, confirm memory and open the updated profile.
- The category mini-game was completed and produced a persisted interaction plus success feedback.

## Findings

- No actionable P0, P1 or P2 differences remain.
- [P3] The reference includes photographic resident portraits while the demo uses initials. This is intentional to keep the fictional dataset privacy-safe and avoid adding new generated imagery after the user stopped visual generation.
- [P3] The dashboard headline and right insight panel are slightly denser than the source at 1440 × 1024, but remain readable and preserve the same hierarchy.

## Comparison history

1. [P2] Mobile dashboard exceeded the 390 px viewport because grid children retained their desktop min-content width.
   - Fix: added explicit `min-width: 0`, `max-width: 100%` and responsive overflow containment.
   - Post-fix evidence: browser values `width: 390`, `scrollWidth: 390`; no horizontal document overflow.
2. [P2] Initial Knowledge Graph labels were clustered around the central node.
   - Fix: introduced deterministic node positions, lower visual node scale, automatic fit padding and compact force-engine warmup/cooldown.
   - Post-fix evidence: nodes are separated into a radial relationship view with readable categories and labels.
3. [P2] Initial bundle loaded charts and graph code on the first route.
   - Fix: route-level lazy loading splits Dashboard, Profile, Activities, Settings and Analytics into independent chunks.
   - Post-fix evidence: production build emits route chunks; the initial app chunk is 272.56 kB before gzip.

## Primary interactions tested

- Dashboard → Elena profile.
- Profile → Relazioni and Knowledge Graph.
- Start interaction → terminate → confirm new memory → updated Memory Library.
- Complete Categories mini-game → new history entry.
- ROSS / Care theme switch and persistence.
- Presentation Mode toggle.
- 390 px mobile, 1024 px tablet landscape, 1440 × 1024 and 1920 × 1080 viewport checks.
- Browser console: no warnings or errors after the tested flows.

## Follow-up polish

- Add dedicated fictional portrait assets only if the team later wants photographic continuity across every screen.

final result: passed
