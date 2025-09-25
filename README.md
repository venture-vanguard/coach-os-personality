# Coach OS Personality — Static Profile Viewer

Single‑page static site that renders a personalized “report” from JSON files. The page styles are in `assets/main.css`, behavior in `assets/main.js`, and copy comes from JSON under `data/`.

## How It Works

- Routing by slug
  - On load, the script inspects `window.location.pathname` and takes the final segment as a slug.
  - If the slug matches `<firstname>-<lastname>-<6digithash>` (case‑insensitive letters for names; letters/digits for the 6‑char hash), the page fetches `data/<slug>.json`.
  - If invalid, missing, or the fetch fails (e.g., 404), the page falls back to `data/content.json` and displays a friendly notice.

- Content binding
  - The JSON populates these sections in `index.html`:
    - `.welcome h1`
    - first `.summary p` (general summary)
    - `.animal-name h3`, `.animal-description p`, and `.animal-image` (background image)
    - `.superpower-title` (allows `<br>`), `.superpower-description`
    - each `.slider-box` → `.slider-box-title`, `.slider-box-content`
    - each `.trait-box` → `.trait-title`, `.trait-level`, `.trait-description p`
  - A status element (`.content-status` with `role="status"`) shows fallback/error messages.

- UI behavior
  - Lucide icons are loaded from CDN and initialized via `lucide.createIcons()`.
  - A scroll progress bar reflects page scroll.
  - Trait boxes expand/collapse with smooth height animations.

## JSON Format

Each profile JSON under `data/` should follow this shape:

```
{
  "welcome": "string",
  "summary": "string",
  "animal": {
    "name": "string",
    "description": "string",
    "image": "string (URL)"   // used as CSS background-image on .animal-image
  },
  "superpower": {
    "title": "string (may include <br>)",
    "description": "string"
  },
  "sliders": [
    { "title": "string", "content": "string" }
  ],
  "traits": [
    { "title": "string", "level": "string", "description": "string" }
  ]
}
```

Naming convention for profile files: `<firstname>-<lastname>-<6digithash>.json` (e.g., `sam-collins-rts293.json`). Place files directly in `data/`.

`data/content.json` acts as the default sample content used when no valid slug is present or a profile file is missing.

## Project Layout

- `index.html` — HTML skeleton and placeholders for content; links external CSS/JS.
- `assets/main.css` — All page styles.
- `assets/main.js` — Content loader, UI behavior (icons, progress bar, trait expansion).
- `data/` — JSON content files (one per profile) and `content.json` fallback.

## Local Development

Fetch requires a server; opening `index.html` via `file://` will not load JSON.

- Python
  - `python3 -m http.server 8080`
  - Visit `http://localhost:8080/` or `http://localhost:8080/<slug>`

- Node
  - `npx serve` (or any static server)

## Deploying on Vercel

Use a rewrite so every path serves `index.html` (client‑side slug handling):

`vercel.json`
```
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

Place per‑user JSON files in `data/` as part of your deployment workflow. The app fetches with `cache: 'no-cache'` to reduce stale content; adjust if you want stronger CDN caching.

## Notes & Limitations

- Security: JSON files are static and publicly readable; this approach relies on “security‑through‑obscurity”. For private reports, front with an authenticated API.
- Accessibility: Fallback and error states announce via `.content-status` (ARIA `role="status"`).
- Extensibility: You can add fields (e.g., images, links) to the JSON and map them in `assets/main.js` as needed.
