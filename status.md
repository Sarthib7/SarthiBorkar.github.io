# Website update

Date: 2026-09-27. Owner: coordinator. Status: In Progress.

## Completed

VERIFIED: React source is integrated in `/Users/sarthiborkar/Build/website`.
Correction: the earlier staging note left the destination open. The conversion now updates the existing website repository.
The OpenDesign directory remains the design reference.

VERIFIED: The HTML comparison returned `MARKUP_PARITY: 1037 matching parsed events`.
The comparison normalized whitespace, image preload markup, and equivalent HTML attribute serialization.
It checks content and structure, not pixel equality.

VERIFIED: All three supplied images match their source bytes in `public/` and `dist/`.
The CSS matches the source except for `.scene { width: 100%; }` at `src/styles.css:127`.
This stops the original scene from extending past its console on narrow screens.
`src/interactions.js` adds effect cleanup and corrects stale navigation selection.

## Verification

VERIFIED: `npm run verify` completed with `11 passed (27.6s)` in Brave.
The build printed `Prerendered dist/index.html with the complete page.`
`git diff --check` exited 0.

Correction: the preceding run had one 30-second mobile test timeout. Trace output showed `newPage 8084 ms` and slow actions.
The run used four browsers on a busy machine. The final run uses one worker and keeps the original test time limit.

VERIFIED: The scene regression reported `1 failed` when the original CSS was restored for the check.
The fixed CSS was then restored. The navigation regression also reported `1 failed` before its correction.

REPORTED: A separate Brave audit passed 50 link clicks across desktop and mobile, all three buttons, and keyboard controls.
Evidence: `/private/tmp/website-buttons-audit.mjs`; the reviewer ran it against the local development server.
External clicks were intercepted. This audit does not establish external page availability.

VERIFIED: Separate unauthenticated GET requests returned these results on 2026-09-27:

| Destination | HTTP status |
| --- | --- |
| `https://cal.com/sarthi` | 200, redirected to `/sarthi/call?user=sarthi` |
| `https://fundwise.fun` | 200 |
| `https://routerlabs.ai` | 200 |
| `https://github.com/Kairen-Protocol/kairen-dealrail` | 200 |
| `https://github.com/masumi-network/Citadel` | 200 |
| `https://github.com/Sarthib7/IntentVault` | 200 |
| `https://github.com/Sarthib7/agentsmith` | 200 |
| `https://github.com/Sarthib7` | 200 |
| `https://x.com/sarthib7` | 200 |

These responses establish availability at the time of the check. They do not prove that a booking can be completed.

## Release

Owner: release. Status: In Progress.
VERIFIED: GitHub Pages reported `"build_type":"legacy"` and `"source":{"branch":"main","path":"/"}`.
VERIFIED: Commit `418dc0f` contains the React conversion and Brave checks.
The prepared workflow builds and tests the React app before uploading `dist/`.
Next action: switch Pages to workflow builds, push both commits, and inspect the deployment result.

## Ownership

The coordinator owns all repository edits and integration.
The reviewers completed source, button, link, and workflow audits.
VERIFIED: Root `CNAME`, prior HTML variants, and existing assets have no staged changes.
The two pre-existing `.DS_Store` changes remain outside the commits.
