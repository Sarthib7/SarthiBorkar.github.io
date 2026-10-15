# SarthiBorkar.github.io

VERIFIED: The website uses React and Vite. See `package.json` for scripts and pinned versions.
The design source is OpenDesign project `b8088852-4528-4747-aa6e-bf86a60731b5`.

## Run locally

Use Node.js 22.12 or newer, as required by `package.json`.

```sh
npm ci --ignore-scripts
npm run dev
```

Open `http://127.0.0.1:5173`.

## Build and preview

```sh
npm run build
npm run preview
```

Open `http://127.0.0.1:4173`.
VERIFIED: `scripts/prerender.mjs` writes the page content into `dist/index.html`.
This retains the content and native navigation without JavaScript.
Vite copies `public/CNAME` and the supplied assets into `dist/`.
VERIFIED: `.github/workflows/deploy.yml` builds and tests `main` before publishing `dist/` to GitHub Pages.
Changes to Markdown files alone do not trigger deployment.
The workflow uses Chromium on Linux. Local checks use Brave when installed.

## Verify

On this Mac, browser checks use the installed Brave browser:

```sh
npm run verify
```

For Brave in another location, set `BRAVE_EXECUTABLE_PATH` to its executable path.
On a machine without Brave, install Playwright's Chromium once:

```sh
npx playwright install chromium
npm run verify
```

VERIFIED: `playwright.config.js` starts a separate production preview on port 43187.
`tests/site.spec.js` checks mobile navigation, automatic workflow motion, cursor response, reduced motion, keyboard access, and content without JavaScript.
The viewport check covers widths of 320, 390, 768, 1024, and 1440 pixels.
Browser checks do not verify external booking pages or linked GitHub projects.

## Edit

- `src/App.jsx`: page text and markup.
- `src/styles.css`: responsive portfolio layout and visual styles.
- `src/interactions.js`: mobile menu and section navigation, with React lifecycle cleanup.
- `public/`: supplied images, favicon, and the domain file.

VERIFIED: The earlier `main-index.html`, `index-retro90s.html`, root `CNAME`, and `assets/` remain in the repository.

## Workflow illustration

VERIFIED: `src/WorkflowFigure.jsx` uses the generated `src/workflow-art.svg`.
Its carriage moves through collection, processing, and delivery automatically. The active tray lifts, and the diagram tilts with the cursor.
Reduced motion keeps the diagram static. Without JavaScript, the illustration remains visible.
This is a conceptual workflow illustration, not a performance measurement.

VERIFIED: `scripts/generate-workflow.mjs` imports the installed Anatomy kit.
With Anatomy installed, regenerate the SVG and styles with:

```sh
node scripts/generate-workflow.mjs
```

Set `ANATOMY_ROOT` when the skill is outside `~/.agents/skills/anatomy`.
The site build uses the committed SVG and does not need the skill installed.
Anatomy kit styles retain their MIT license in `src/anatomy-LICENSE.txt`.

## Project gallery

VERIFIED: `src/ProjectCarousel.jsx` controls the project gallery.
On large screens, page scroll moves the cards horizontally when the gallery fits below the header.
Short screens and phones use native horizontal scrolling with arrow buttons and keyboard controls.
Reduced motion and no JavaScript retain a static project grid.

VERIFIED: `src/ProjectVisual.jsx` loads the local artwork selected in `src/projects.js`.
Selected work includes FalconOS, Fundwise, Citadel, Noesora, Exbridge, LastLight, Agentsmith, Kairen DealRail, and IntentVault.
The covers mix product artwork with conceptual SVG objects. Fundwise’s mock is labeled `Product concept`.
All nine projects share one gallery.
Regenerate them with the installed Anatomy kit:

```sh
node scripts/generate-project-art.mjs
```

The SVGs contain the kit style license. A normal site build does not require Anatomy.

## Portfolio presentation

VERIFIED: `src/portfolio.css` is the final visual layer imported after `src/styles.css`.
It styles the dark hero, project covers, experience, and contact sections.
`src/projects.js` holds all nine projects in gallery order.
LastLight currently links to contact because this session did not establish a public project URL.
Pull requests run verification. Merging into `main` triggers the Pages deployment workflow.
