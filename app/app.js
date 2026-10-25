(() => {
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const ML = [31,29,31,30,31,30,31,31,30,31,30,31];
const MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const M3 = MN.map(m => m.slice(0,3).toUpperCase());
const START = ML.reduce((a,l,i) => (a.push(i ? a[i-1] + ML[i-1] : 0), a), []);
const N = 366;
const CAT = {
  Sky:{c:'#1f9c91',g:'M3 15h18M7 15a5 5 0 0 1 10 0M8.5 18l-2 3M15.5 18l2 3M12 6V3'},
  Falls:{c:'#3763c4',g:'M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z'},
  Cosmos:{c:'#6a4cc0',g:'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM3 15c-1-3 4-6 9-6s10 3 9 6'},
  Cryptids:{c:'#4f8a2f',g:'M9 20c-3 0-4-3-3-5s3-3 4-5c1 2 3 3 4 5s-1 5-5 5zM6 8.5a1.3 1.3 0 1 0 0 .1zM10 5.5a1.3 1.3 0 1 0 0 .1zM14.5 6a1.3 1.3 0 1 0 0 .1zM18 9a1.3 1.3 0 1 0 0 .1z'},
  Haunts:{c:'#a0506c',g:'M6 20V10a6 6 0 0 1 12 0v10l-3-2-3 2-3-2zM9.5 10v1.5M14.5 10v1.5'},
  Mysteries:{c:'#b5731a',g:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'},
  Sea:{c:'#1d7aa3',g:'M2 9c3-3 5 3 8 0s5 3 8 0M2 15c3-3 5 3 8 0s5 3 8 0'},
  Occult:{c:'#a8392b',g:'M16 4a8 8 0 1 0 4 12 6.5 6.5 0 0 1-4-12zM17.5 6.5v3M16 8h3'}
};
const DATA = window.FORTEAN || [];
const BY = {}; DATA.forEach(e => BY[e.k] = e);
const $ = id => document.getElementById(id);
const el = (n, a = {}, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
const pt = (r, deg) => { const t = (deg - 90) * Math.PI / 180; return [r * Math.cos(t), r * Math.sin(t)]; };
const idxOf = (m, d) => START[m-1] + d - 1;
const fromIdx = i => { let m = 11; while (START[m] > i) m--; return {m: m + 1, d: i - START[m] + 1}; };
const angOf = i => (i + .5) / N * 360;
const mod = (a, n) => ((a % n) + n) % n;

let seen = new Set();
try { seen = new Set(JSON.parse(localStorage.getItem('fortean-seen') || '[]')); } catch (_) {}
const saveSeen = () => { try { localStorage.setItem('fortean-seen', JSON.stringify([...seen])); } catch (_) {} };

/* ---------- build dial ---------- */
const svg = $('dialSvg');
const defs = el('defs', {}, svg);
const lg = el('linearGradient', {id:'glowfill', x1:0, y1:0, x2:0, y2:1}, defs);
el('stop', {offset:'0', 'stop-color':'#eafff9'}, lg); el('stop', {offset:'.55', 'stop-color':'#7ff0df'}, lg); el('stop', {offset:'1', 'stop-color':'#2fae9f'}, lg);
const bg = el('linearGradient', {id:'brassn', x1:0, y1:0, x2:1, y2:1}, defs);
el('stop', {offset:'0', 'stop-color':'#fff1bd'}, bg); el('stop', {offset:'.5', 'stop-color':'#d8b058'}, bg); el('stop', {offset:'1', 'stop-color':'#7d5a1e'}, bg);
const face = el('radialGradient', {id:'face', cx:'50%', cy:'40%', r:'70%'}, defs);
el('stop', {offset:'0', 'stop-color':'#1d4a4a'}, face); el('stop', {offset:'.7', 'stop-color':'#0b1a1c'}, face); el('stop', {offset:'1', 'stop-color':'#050c0d'}, face);
const gl = el('radialGradient', {id:'lens', cx:'35%', cy:'22%', r:'60%'}, defs);
el('stop', {offset:'0', 'stop-color':'#fff', 'stop-opacity':.28}, gl); el('stop', {offset:'1', 'stop-color':'#fff', 'stop-opacity':0}, gl);
const flt = el('filter', {id:'bloom', x:'-50%', y:'-50%', width:'200%', height:'200%'}, defs);
el('feGaussianBlur', {stdDeviation:'6', result:'b'}, flt);
const mg = el('feMerge', {}, flt); el('feMergeNode', {in:'b'}, mg); el('feMergeNode', {in:'SourceGraphic'}, mg);

// rim and month ring
el('circle', {r:492, fill:'none', stroke:'#3b2608', 'stroke-width':3, opacity:.8}, svg);
el('circle', {r:468, fill:'none', stroke:'#2a1a08', 'stroke-width':2.5, 'stroke-dasharray':'2 7', opacity:.55}, svg);
el('circle', {r:446, fill:'none', stroke:'#2a1a08', 'stroke-width':2.5, opacity:.7}, svg);
el('circle', {r:384, fill:'none', stroke:'#2a1a08', 'stroke-width':2.5, opacity:.7}, svg);
const mring = el('g', {}, svg);
for (let m = 0; m < 12; m++) {
  const a0 = START[m] / N * 360, a1 = (START[m] + ML[m]) / N * 360, mid = (a0 + a1) / 2;
  const bottom = mid > 90 && mid < 270;
  const r = bottom ? 421 : 405;
  const [x0, y0] = pt(r, bottom ? a1 : a0), [x1, y1] = pt(r, bottom ? a0 : a1);
  const id = 'mp' + m;
  el('path', {id, d:`M${x0},${y0} A${r},${r} 0 0 ${bottom ? 0 : 1} ${x1},${y1}`, fill:'none'}, defs);
  const t = el('text', {'font-size':30, 'font-weight':600, 'letter-spacing':'6', 'text-anchor':'middle'}, mring);
  const tp = el('textPath', {href:'#' + id, startOffset:'50%'}, t); tp.textContent = M3[m];
  const [sx, sy] = pt(446, a0), [ex, ey] = pt(384, a0);
  el('line', {x1:sx, y1:sy, x2:ex, y2:ey, stroke:'#2a1a08', 'stroke-width':3}, svg);
}
// ticks and category dots
const ticks = el('g', {}, svg), dots = el('g', {}, svg);
const seenG = el('g', {}, svg);
for (let i = 0; i < N; i++) {
  const {m, d} = fromIdx(i), a = angOf(i);
  const big = d === 1 ? 30 : (d % 5 === 0 ? 17 : 9);
  const [x0, y0] = pt(378, a), [x1, y1] = pt(378 - big, a);
  el('line', {x1:x0, y1:y0, x2:x1, y2:y1, stroke:'#2a1a08', 'stroke-width':d === 1 ? 3 : 1.6, 'stroke-linecap':'round'}, ticks);
  const e = BY[m + '-' + d];
  const [cx, cy] = pt(330, a);
  el('circle', {cx, cy, r:3.6, fill:e ? CAT[e.cat].c : '#555', stroke:'#10100c', 'stroke-width':1}, dots);
}
el('circle', {r:312, fill:'none', stroke:'#2a1a08', 'stroke-width':4, opacity:.75}, svg);
el('circle', {r:306, fill:'none', stroke:'#fff1bd', 'stroke-width':2, opacity:.6}, svg);
// enamel face
el('circle', {r:300, fill:'url(#face)'}, svg);
for (let k = 0; k < 36; k++) { const [x, y] = pt(298, k * 10), [x2, y2] = pt(236, k * 10); el('line', {x1:x, y1:y, x2, y2, stroke:'#7ff0df', 'stroke-width':1.2, opacity:.13}, svg); }
el('circle', {r:236, fill:'none', stroke:'#7ff0df', 'stroke-width':1.5, opacity:.28}, svg);
el('circle', {r:228, fill:'none', stroke:'#d8b058', 'stroke-width':1, opacity:.35, 'stroke-dasharray':'1 6'}, svg);
const tMon = el('text', {class:'face-mon', x:0, y:-150, 'text-anchor':'middle'}, svg);
const tDay = el('text', {class:'face-day', x:0, y:62, 'text-anchor':'middle'}, svg);
const tYr = el('text', {class:'face-yr', x:0, y:120, 'text-anchor':'middle'}, svg);
const tCat = el('text', {class:'face-cat', x:0, y:178, 'text-anchor':'middle'}, svg);
el('ellipse', {cx:-60, cy:-170, rx:190, ry:100, fill:'url(#lens)', transform:'rotate(-14)'}, svg);
// ray and marker
const needle = el('g', {id:'needle'}, svg);
el('line', {x1:0, y1:-300, x2:0, y2:-440, stroke:'#7ff0df', 'stroke-width':7, 'stroke-linecap':'round', filter:'url(#bloom)', opacity:.9}, needle);
el('line', {x1:0, y1:-300, x2:0, y2:-440, stroke:'#eafff9', 'stroke-width':2.2, 'stroke-linecap':'round'}, needle);
el('path', {d:'M0,-448 L15,-372 L0,-388 L-15,-372 Z', fill:'url(#brassn)', stroke:'#2a1a08', 'stroke-width':2.5, 'stroke-linejoin':'round'}, needle);
el('circle', {cx:0, cy:-398, r:3.5, fill:'#7ff0df'}, needle);
// today notch
const todayMark = el('path', {d:'M0,-372 l-9,-16 h18 z', fill:'#ffb347', stroke:'#2a1a08', 'stroke-width':1.5}, svg);

/* ---------- state and render ---------- */
const now = new Date();
const todayIdx = idxOf(now.getMonth() + 1, now.getDate());
{ const a = angOf(todayIdx); todayMark.setAttribute('transform', `rotate(${a})`); }
let idx = todayIdx, cum = angOf(todayIdx), first = true;
const dial = $('dial'), plateIn = $('plateIn'), rays = document.querySelector('.rays');

function glyph(cat) {
  const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24');
  const p = el('path', {d:CAT[cat].g, fill:'none', stroke:'currentColor', 'stroke-width':1.7, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, s);
  return s;
}
function node(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
function srcNote(e) {
  const w = e.src.work, wrap = node('div', 'src');
  const p1 = node('p'); const b = node('b', '', 'Source '); p1.append(b, w + '.');
  wrap.appendChild(p1);
  if (e.src.cite) wrap.appendChild(node('p', '', 'Cited as: ' + e.src.cite + '.'));
  const a = node('a', '', 'Open the source'); a.href = e.src.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
  const p2 = node('p'); p2.appendChild(a); wrap.appendChild(p2);
  const conf = e.src.kind === 'fort' && /Chambers/.test(w)
    ? 'An antiquarian record from Chambers. The passage is checked against the book; the older sources behind it are not.'
    : e.src.kind === 'fort'
    ? 'Fort compiled this from the periodical cited above. The passage is checked against his book. The original periodical has not been consulted.'
    : 'Date and main facts are checked against the Wikipedia article. Extraordinary claims are the claimants’, not ours.';
  wrap.appendChild(node('p', 'conf', conf));
  return wrap;
}
function render(i, animate) {
  idx = mod(i, N);
  const {m, d} = fromIdx(idx), e = BY[m + '-' + d];
  // needle: shortest path
  const target = angOf(idx);
  let diff = mod(target - mod(cum, 360) + 180, 360) - 180;
  cum += diff; needle.setAttribute('transform', `rotate(${cum})`);
  tMon.textContent = M3[m-1]; tDay.textContent = d;
  tYr.textContent = e ? e.y : ''; tCat.textContent = e ? e.cat.toLowerCase() : '';
  dial.setAttribute('aria-valuenow', idx);
  dial.setAttribute('aria-valuetext', `${MN[m-1]} ${d}${e ? ': ' + e.title : ''}`);
  // plate
  plateIn.replaceChildren();
  if (e) {
    const when = node('div', 'when'); const chip = node('span', 'chip'); chip.style.setProperty('--c', CAT[e.cat].c);
    chip.append(glyph(e.cat), e.cat);
    const date = node('span', 'date', `${MN[m-1]} ${d}, ${e.y}`);
    when.append(chip, date);
    plateIn.append(when, node('h2', 'entry-title', e.title), node('p', 'entry-text', e.text), srcNote(e));
    const tools = node('div', 'plate-tools'); const sh = node('button', '', navigator.share ? 'Share' : 'Copy');
    sh.type = 'button';
    sh.onclick = async () => {
      const txt = `${MN[m-1]} ${d}, ${e.y}: ${e.title}. ${e.text} (${e.src.work})`;
      try { if (navigator.share) await navigator.share({title:'The Fortean Calendar', text:txt}); else { await navigator.clipboard.writeText(txt); sh.textContent = 'Copied'; setTimeout(() => sh.textContent = 'Copy', 1500); } } catch (_) {}
    };
    tools.appendChild(sh); plateIn.appendChild(tools);
  }
  plateIn.classList.remove('open');
  if (animate) { void plateIn.offsetWidth; plateIn.classList.add('open'); rays.classList.remove('flare'); void rays.offsetWidth; rays.classList.add('flare'); }
  if (!seen.has(m + '-' + d)) { seen.add(m + '-' + d); saveSeen(); markSeen(idx); updateTally(); }
}
function markSeen(i) {
  const [x, y] = pt(358, angOf(i)); el('circle', {cx:x, cy:y, r:1.6, class:'seen-dot'}, seenG);
}
function updateTally() { $('tally').textContent = `${seen.size} of ${N} days opened on this device`; }
[...seen].forEach(k => { const [m, d] = k.split('-').map(Number); if (m && d) markSeen(idxOf(m, d)); });
updateTally();

/* ---------- input ---------- */
const angleFrom = ev => {
  const r = dial.getBoundingClientRect();
  const dx = ev.clientX - (r.left + r.width / 2), dy = ev.clientY - (r.top + r.height / 2);
  return mod(Math.atan2(dy, dx) * 180 / Math.PI + 90, 360);
};
let dragging = false;
dial.addEventListener('pointerdown', ev => {
  dragging = true; dial.classList.add('drag'); dial.setPointerCapture(ev.pointerId); dial.focus({preventScroll:true});
  const i = Math.min(N - 1, Math.floor(angleFrom(ev) / 360 * N)); render(i, true);
});
dial.addEventListener('pointermove', ev => {
  if (!dragging) return;
  const i = Math.min(N - 1, Math.floor(angleFrom(ev) / 360 * N));
  if (i !== idx) render(i, false);
});
const end = ev => { if (!dragging) return; dragging = false; dial.classList.remove('drag'); render(idx, true); };
dial.addEventListener('pointerup', end); dial.addEventListener('pointercancel', end);
dial.addEventListener('wheel', ev => { ev.preventDefault(); render(idx + (ev.deltaY > 0 ? 1 : -1), false); }, {passive:false});
const step = (n, anim = true) => render(n, anim);
const monthStep = dir => { const {m, d} = fromIdx(idx); const nm = mod(m - 1 + dir, 12) + 1; render(idxOf(nm, Math.min(d, ML[nm-1])), true); };
dial.addEventListener('keydown', ev => {
  const map = {ArrowRight:1, ArrowUp:1, ArrowLeft:-1, ArrowDown:-1, PageUp:10, PageDown:-10};
  if (ev.key in map) { ev.preventDefault(); step(idx + map[ev.key]); }
  if (ev.key === 'Home') { ev.preventDefault(); render(todayIdx, true); }
});
$('prevDay').onclick = () => step(idx - 1); $('nextDay').onclick = () => step(idx + 1);
$('prevMonth').onclick = () => monthStep(-1); $('nextMonth').onclick = () => monthStep(1);
$('today').onclick = () => render(todayIdx, true);
document.addEventListener('keydown', ev => {
  if (ev.target.closest && ev.target.closest('dialog')) return;
  if (ev.target === dial) return;
  if (ev.key === 'ArrowRight') step(idx + 1); if (ev.key === 'ArrowLeft') step(idx - 1);
});
// swipe on plate
let sx = null;
plateIn.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
plateIn.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 70) step(idx + (dx < 0 ? 1 : -1)); }, {passive:true});

/* ---------- about ---------- */
const cnt = {}; DATA.forEach(e => { const k = /Chambers/.test(e.src.work) ? 'chambers' : e.src.kind; cnt[k] = (cnt[k] || 0) + 1; });
$('aboutBtn').onclick = () => {
  const b = $('aboutBody'); b.replaceChildren();
  const add = (t, c, txt) => { const n = node(t, c, txt); b.appendChild(n); return n; };
  add('p', '', `Every entry carries a citation you can open. ${cnt.fort || 0} come from Charles Fort’s public-domain books, ${cnt.chambers || 0} from Chambers’s Book of Days (1864), and ${cnt.ref || 0} from Wikipedia articles.`);
  add('h3', '', 'Fort’s entries');
  const ul = add('ul'); ['Taken from The Book of the Damned (1919) and New Lands (1923), both on Project Gutenberg. Lo! (1931) and Wild Talents (1932) are not yet in the public domain in the US, so they are not used.',
    'Each passage was checked against the book’s text. We have not read the original newspapers and journals Fort cites, so treat them as “as Fort reported”.',
    'Fort wrote to provoke. Many reports have ordinary explanations, and he knew it.'].forEach(t => ul.appendChild(node('li', '', t)));
  add('h3', '', 'Wikipedia entries');
  add('p', '', 'The date and key facts were checked against the named article. Where an event is a claim, such as a UFO sighting or a medium’s seance, the text says whose claim it is.');
  add('h3', '', 'Days with no clean event');
  add('p', '', 'A few days use a report date, such as when a newspaper printed an account. The entry says so.');
  add('h3', '', 'The coloured dots on the dial');
  const l = add('p'); Object.keys(CAT).forEach((k, n) => { const s = node('b', '', k); s.style.color = CAT[k].c; l.append(s, n < 7 ? ', ' : '.'); });
  $('about').showModal();
};
$('about').addEventListener('click', e => { if (e.target === $('about')) $('about').close(); });

/* ---------- pwa ---------- */
let deferred;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('installBtn').hidden = false; });
$('installBtn').onclick = async () => {
  if (!deferred) { alert('To install: open the browser menu and choose \u201CInstall app\u201D (or \u201CAdd to Home screen\u201D on iPhone, from the Share menu).'); return; }
  deferred.prompt(); await deferred.userChoice; deferred = null; $('installBtn').hidden = true;
};
window.addEventListener('appinstalled', () => { $('installBtn').hidden = true; });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});

render(todayIdx, false);
})();
