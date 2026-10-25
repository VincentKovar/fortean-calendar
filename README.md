# The Fortean Calendar

PWA: one cited Fortean event per day (366 incl. Feb 29). Vanilla HTML/CSS/JS, no build step.

- Run: `cd app && python3 -m http.server 8765`, open http://localhost:8765 (service workers need localhost or HTTPS).
- Deploy: upload the `app/` folder to any static host (Netlify, GitHub Pages, Cloudflare Pages). Install from the browser menu.
- Data: `research/months/*.py` hold the entries; `research/build.py` verifies every anchor/date against the cached source texts and writes `entries.json`. Regenerate `app/data.js` from it (see session notes) and bump `CACHE` in `app/sw.js`.
- Sources: Fort's The Book of the Damned and New Lands (Gutenberg), Chambers's Book of Days (Internet Archive), Wikipedia (CC BY-SA).
