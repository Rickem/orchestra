# ADR-0003: Orchestra owns UI design in one skill

Date: 2026-11-26
Status: accepted
Approved by: project owner

## Context

ADR-0002 routes work to upstreams wherever one covers it. UI design was routed to gstack `/plan-design-review` and `/design-review`. Three things made that route unfit:

- Both are web-only. Flutter projects had no design cover.
- Run as-is they break orchestra's rules. `/design-review` fixes and commits, and stops on an uncommitted working tree, while orchestra reviews before any commit is approved. `/plan-design-review` can send plan text to an outside image service.
- The best design guidance is spread across six third-party skills that contradict each other on fonts, layout, motion and scoring, and each brings its own toolchain.

No single upstream covers direction before code, discipline during the build and an evidence-based review after it.

## Decision

- Add one skill, `/orchestra:ui-design`, with three modes: `direct`, `build` and `review`. It is the single owner of UI design direction, build guidance and review.
- Write the design knowledge into `skills/ui-design/references/`, paraphrased from the sources and credited in `CREDITS.md`. The skill has no scripts and no runtime dependency on any source.
- Enforce by rule, as security review is: on the standard and full tiers a UI task needs an approved design file before it is planned and a passing design review after code review. No new gate key in `project.json`.
- Keep the two gstack design skills as instruments that run only when the user asks, under stated limits. Their findings are input; their scores and verdicts are not used.
- No new agent. The count stays at three.

This is an exception to ADR-0002, limited to UI design.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep routing to gstack | Web-only; conflicts with the no-commit and no-outbound-content rules; no build-time guidance |
| A thin wrapper that calls the installed design skills | Inherits their contradictions, toolchains and outbound calls; breaks when one is missing |
| Three skills sharing one reference folder | Three files to keep in step; the direction and the rubric that checks it could drift |
| A dedicated designer agent | ADR-0002 keeps custom agents to three; a fresh-context reviewer dispatched by the skill does the independent part |

## Consequences

Orchestra now carries design content that must be maintained by hand; upstream improvements do not arrive on their own. A skill with a `references/` folder is a new pattern here. Existing projects on the standard or full tier must run `/orchestra:ui-design direct` once before planning further UI tasks. Revisit if an upstream ships a design skill that covers Flutter and can run report-only.
