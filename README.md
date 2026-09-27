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
Publish `dist/` when deploying to static hosting. Deployment is a separate action.

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
`tests/site.spec.js` checks mobile navigation, gallery controls, reduced motion, sprite frames, and content without JavaScript.
The viewport check covers widths of 320, 390, 768, 1024, and 1440 pixels.
Browser checks do not verify external booking pages or linked GitHub projects.

## Edit

- `src/App.jsx`: page text and markup.
- `src/styles.css`: original design styles and the scene width correction.
- `src/interactions.js`: original animation and gallery logic, with React lifecycle cleanup.
- `public/`: supplied images, favicon, and the domain file.

VERIFIED: The earlier `main-index.html`, `index-retro90s.html`, root `CNAME`, and `assets/` remain in the repository.
