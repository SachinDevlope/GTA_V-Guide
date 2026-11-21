// Finds a picture for every item on the GTA Wiki (gta.fandom.com) and writes
// src/data/images.json: { "<category>/<id>": { src, page }, ... }.
// Re-run after adding data:   npm run data:images
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const API = 'https://gta.fandom.com/api.php';
const WIKI = 'https://gta.fandom.com/wiki/';
const THUMB = 640;

// Fandom video pages also have "thumbnails" (YouTube stills with captions); only real image files count.
const isImageFile = (src) => /\.(png|jpe?g|webp|gif)\/revision/i.test(src);

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));
const pageUrl = (title) => WIKI + encodeURIComponent(title.replace(/ /g, '_'));

async function api(params) {
  const url = API + '?' + new URLSearchParams({ action: 'query', format: 'json', redirects: '1', ...params });
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'ls-index-fan-reference/1.0 (local tool)' } });
    if (res.ok) return res.json();
    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }
  throw new Error('API failed: ' + url);
}

/** Batch-resolves exact page titles to their lead image. */
async function byTitles(titles) {
  const out = new Map();
  for (let i = 0; i < titles.length; i += 50) {
    const j = await api({ prop: 'pageimages', piprop: 'thumbnail', pithumbsize: String(THUMB), titles: titles.slice(i, i + 50).join('|') });
    const q = j.query ?? {};
    const alias = new Map();
    for (const n of q.normalized ?? []) alias.set(n.to, n.from);
    for (const r of q.redirects ?? []) alias.set(r.to, alias.get(r.from) ?? r.from);
    for (const p of Object.values(q.pages ?? {})) {
      if (!p.thumbnail || !isImageFile(p.thumbnail.source)) continue;
      const hit = { src: p.thumbnail.source, page: pageUrl(p.title) };
      out.set(p.title, hit);
      if (alias.has(p.title)) out.set(alias.get(p.title), hit);
    }
  }
  return out;
}

/** Full-text search fallback; takes the first result whose title contains `mustContain`. */
async function bySearch(query, mustContain) {
  const j = await api({ generator: 'search', gsrsearch: query, gsrlimit: '6', prop: 'pageimages', piprop: 'thumbnail', pithumbsize: String(THUMB) });
  const pages = Object.values(j.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  const want = mustContain.toLowerCase();
  const p = pages.find((x) => x.thumbnail && isImageFile(x.thumbnail.source) && x.title.toLowerCase().includes(want));
  return p ? { src: p.thumbnail.source, page: pageUrl(p.title) } : null;
}

// Wiki pages covering several games may lead with a picture from another game.
const WRONG_GAME = /GTAVI|GTA6|VCR\.|GTAIV|GTASA|GTAVCS|GTAVC|GTAIII|GTA3|GTALCS|GTACW|TLAD|TBoGT|GTA2|GTAA|GTA1/i;
const RIGHT_GAME = /GTAV(e|ee)?[-_. ]|GTAO/i;

// Site-wide icons and logos that appear on many pages and never show the item itself.
const GENERIC_FILE = /Bleeter|Blips|-Icon|Logo|Artwork-|Newswire|Floorplan|Map_Key|Snapmatic|PhoneButton|HUDIcons/i;

/** Lowercase letters/digits only, so "Mk II", "Mk_II" and "MkII" compare equal. */
const squash = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '')
    .replace(/mkii/g, 'mk2');
const fileOf = (src) => decodeURIComponent(src.split('/revision')[0].split('/').pop());

/** Words from an item's name that a matching image file name should contain. */
function nameWords(name) {
  return name
    .replace(/\(.*?\)/g, '')
    .replace(/^The /, '')
    .replace(/\bMk II\b/gi, 'MkII')
    .split(/[\s\-.]+/)
    .map(squash)
    .filter((w) => w.length >= 2);
}
/** The first word must appear, and most of the others (file names often drop words like "Bike"). */
const fileMatchesName = (file, words) => {
  if (!words.length) return false;
  const f = squash(file);
  const hits = words.filter((w) => f.includes(w)).length;
  return f.includes(words[0]) && hits / words.length >= 0.6;
};

/** Looks for files named like "Stromberg-GTAO-front.png" when no page has a usable picture. */
async function byFilePrefix(name) {
  const base = name.replace(/\(.*?\)/g, '').replace(/\bMk II\b/gi, 'MkII').replace(/[^A-Za-z0-9&]/g, '');
  for (const suffix of ['-GTAO', '-GTAV', 'GTAO', 'GTAV']) {
    const j = await api({ list: 'allimages', aiprefix: base + suffix, ailimit: '50', aiprop: 'url' }).catch(() => null);
    const files = j?.query?.allimages ?? [];
    const pick =
      files.find((f) => /front|quarter/i.test(f.name) && !GENERIC_FILE.test(f.name)) ??
      files.find((f) => !GENERIC_FILE.test(f.name) && /\.(png|jpe?g|webp)$/i.test(f.name));
    if (!pick) continue;
    const k = await api({ titles: 'File:' + pick.name, prop: 'imageinfo', iiprop: 'url', iiurlwidth: String(THUMB) });
    const info = Object.values(k.query?.pages ?? {})[0]?.imageinfo?.[0];
    if (info) return { src: info.thumburl ?? info.url, page: pageUrl('File:' + pick.name) };
  }
  return null;
}

/** Picks a GTA V / Online picture from a wiki page; with `words`, the file name must contain them. */
async function gta5ImageFromPage(page, words = []) {
  const title = decodeURIComponent(page.slice(WIKI.length)).replace(/_/g, ' ');
  const j = await api({ titles: title, prop: 'images', imlimit: '300' });
  const files = Object.values(j.query?.pages ?? {}).flatMap((p) => (p.images ?? []).map((i) => i.title));
  const ok = (f) =>
    RIGHT_GAME.test(f) && !WRONG_GAME.test(f) && !GENERIC_FILE.test(f) && /\.(png|jpe?g|webp)$/i.test(f) && (!words.length || fileMatchesName(f, words));
  const pick = files.find((f) => ok(f) && /front|quarter|portrait|ingame|render|hud/i.test(f)) ?? files.find(ok);
  if (!pick) return null;
  const k = await api({ titles: pick, prop: 'imageinfo', iiprop: 'url', iiurlwidth: String(THUMB) });
  const info = Object.values(k.query?.pages ?? {})[0]?.imageinfo?.[0];
  return info ? { src: info.thumburl ?? info.url, page } : null;
}

async function resolve(label, items, baseCandidates, searchFor, { mustMatchName = false } = {}) {
  // An item can name the wiki pages to use with a "wikiPages" field; those are tried first.
  const candidatesFor = (it) => [...(it.wikiPages ?? []), ...baseCandidates(it)];
  const found = new Map();
  // An exact wiki file name ("wikiFile") wins over everything else.
  for (const it of items.filter((x) => x.wikiFile)) {
    const k = await api({ titles: 'File:' + it.wikiFile, prop: 'imageinfo', iiprop: 'url', iiurlwidth: String(THUMB) });
    const info = Object.values(k.query?.pages ?? {})[0]?.imageinfo?.[0];
    if (info) found.set(it.id, { src: info.thumburl ?? info.url, page: pageUrl('File:' + it.wikiFile) });
  }
  const rounds = Math.max(0, ...items.map((it) => candidatesFor(it).length));
  for (let r = 0; r < rounds; r++) {
    const pending = items.filter((it) => !found.has(it.id) && candidatesFor(it)[r]);
    if (!pending.length) continue;
    const hits = await byTitles([...new Set(pending.map((it) => candidatesFor(it)[r]))]);
    for (const it of pending) {
      const h = hits.get(candidatesFor(it)[r]);
      if (h) found.set(it.id, h);
    }
  }
  if (searchFor) {
    for (const it of items.filter((x) => !found.has(x.id))) {
      const [q, must] = searchFor(it);
      const h = await bySearch(q, must).catch(() => null);
      if (h) found.set(it.id, h);
    }
  }
  const byId = new Map(items.map((it) => [it.id, it]));
  for (const [id, h] of found) {
    if (byId.get(id).wikiFile) continue; // hand-picked file: trust it
    const words = mustMatchName ? nameWords(byId.get(id).name) : [];
    const wrongName = mustMatchName && !fileMatchesName(fileOf(h.src), words);
    if (!WRONG_GAME.test(h.src) && !GENERIC_FILE.test(fileOf(h.src)) && !wrongName) continue;
    // The lead picture is from another game, a generic icon, or of something else: look for a better one.
    const better = await gta5ImageFromPage(h.page, words).catch(() => null);
    if (better) found.set(id, better);
    else found.delete(id);
  }
  // Still missing: look inside the candidate pages (lead may be a video), then by file name.
  for (const it of items.filter((x) => !found.has(x.id))) {
    const words = mustMatchName ? nameWords(it.name) : [];
    for (const title of candidatesFor(it).slice(0, 3)) {
      const h = await gta5ImageFromPage(pageUrl(title), words).catch(() => null);
      if (h) {
        found.set(it.id, h);
        break;
      }
    }
    if (!found.has(it.id)) {
      const h = await byFilePrefix(it.name).catch(() => null);
      if (h) found.set(it.id, h);
    }
  }
  console.log(`${label}: ${found.size}/${items.length}`);
  const missing = items.filter((x) => !found.has(x.id)).map((x) => x.name);
  if (missing.length) console.log('  no image: ' + missing.join(', '));
  return found;
}

const strip = (s) => s.replace(/\s*\(.*?\)\s*/g, ' ').trim();
const images = {};

// Hand-picked hints (src/data/image-hints.json), keyed by "<category>/<id>".
const HINTS = Object.fromEntries(Object.entries(readJson('image-hints.json')).filter(([k]) => !k.startsWith('_')));
const hinted = (cat, items) => items.map((it) => ({ ...it, ...(HINTS[`${cat}/${it.id}`] ?? {}) }));
const put = (cat, map) => {
  for (const [id, h] of map) images[`${cat}/${id}`] = h;
};

const vehicles = hinted('vehicles', readJson('vehicles.json'));
const vehicleImages = await resolve(
  'vehicles',
  vehicles,
  (x) => [`${x.name} (HD Universe)`, x.name, strip(x.name), x.manufacturer ? `${x.manufacturer} ${x.name}` : null].filter(Boolean),
  (x) => [`${x.manufacturer ?? ''} ${strip(x.name)} GTA V`.trim(), strip(x.name).split(' ')[0]],
  { mustMatchName: true },
);
put('vehicles', vehicleImages);

const weapons = hinted('weapons', readJson('weapons.json'));
const weaponImages = await resolve(
  'weapons',
  weapons,
  (x) => [`${x.name} (HD Universe)`, x.name, `${x.name} (GTA V)`],
  (x) => [`${x.name} GTA V weapon`, strip(x.name).split(' ')[0]],
  { mustMatchName: true },
);
put('weapons', weaponImages);

put(
  'characters',
  await resolve('characters', readJson('characters.json'), (x) => [x.name, ...(x.aliases ?? [])], (x) => [`${x.name} GTA V`, x.name.split(' ')[0]]),
);

put(
  'missions',
  await resolve(
    'missions',
    hinted('missions', readJson('missions.json')),
    (x) => [x.name, `${x.name} (GTA V)`, `${x.name} (mission)`, `${x.name} (GTA V mission)`],
    (x) => [`${x.name} GTA V mission`, strip(x.name).split(' ')[0]],
  ),
);

put(
  'heists',
  await resolve(
    'heists',
    hinted('heists', readJson('heists.json')),
    (x) => [x.name, `${x.name} (GTA Online)`, x.name.replace(/^The /, '')],
    (x) => [`${x.name} GTA Online`, x.name.replace(/^The /, '').split(' ')[0]],
  ),
);

put(
  'businesses',
  await resolve(
    'businesses',
    hinted('businesses', readJson('businesses.json')),
    (x) => [x.name, `${x.name} (GTA Online)`, `${x.name}s`, `${x.name}s (GTA Online)`],
    (x) => [`${x.name} GTA Online`, strip(x.name).split(' ')[0]],
  ),
);

const collectibles = hinted('collectibles', [...readJson('collectibles.json'), ...readJson('online-collectibles.json')]);
put(
  'collectibles',
  await resolve(
    'collectibles',
    collectibles,
    (x) => [x.name, `${x.name} (GTA V)`, `${x.name} (GTA Online)`],
    (x) => [`${x.name} GTA V`, strip(x.name).split(' ')[0]],
  ),
);

put(
  'skills',
  await resolve('skills', readJson('skills.json'), (x) => [`${x.name} (skill)`, `${x.name} (GTA V)`], (x) => [`${x.name} skill GTA V`, x.name]),
);

// GTA Online missions: their own wiki picture when there is one, otherwise the contact's portrait.
const characters = readJson('characters.json');
const charByName = new Map();
for (const c of characters) for (const n of [c.name, ...(c.aliases ?? [])]) charByName.set(n.toLowerCase(), c.id);
const onlineMissions = hinted('online-missions', readJson('online-missions.json'));
const onlineMissionImages = await resolve(
  'online-missions',
  onlineMissions,
  (x) => [x.name, `${x.name} (GTA Online)`, `${x.name} (mission)`],
  null,
);
put('online-missions', onlineMissionImages);
let contactHits = 0;
for (const m of onlineMissions) {
  const key = `online-missions/${m.id}`;
  if (images[key] || !m.contact) continue;
  // "Lester Crest", "Lester", "Franklin Clinton / Imani" → first matching character
  const names = m.contact.split(/\s*[/&,]\s*|\s+and\s+/i);
  for (const n of names) {
    const lower = n.trim().toLowerCase();
    const id = charByName.get(lower) ?? [...charByName.entries()].find(([k]) => k.split(' ')[0] === lower.split(' ')[0])?.[1];
    if (id && images[`characters/${id}`]) {
      images[key] = images[`characters/${id}`];
      contactHits++;
      break;
    }
  }
}
console.log(`online-missions: +${contactHits} using the contact's portrait`);

// Last resort for online missions: a business or heist from the same update, else a default per mission type.
const fromSameUpdate = new Map();
for (const [cat, file] of [
  ['businesses', 'businesses.json'],
  ['heists', 'heists.json'],
]) {
  for (const it of readJson(file)) {
    if (it.dlc && images[`${cat}/${it.id}`] && !fromSameUpdate.has(it.dlc)) fromSameUpdate.set(it.dlc, images[`${cat}/${it.id}`]);
  }
}
const TYPE_DEFAULT = {
  'VIP/CEO Work': 'businesses/ob-ceo-office',
  'Business Mission': 'businesses/ob-ceo-office',
  'MC Contract': 'businesses/ob-mc-clubhouse',
  'Adversary Mode': 'heists/oh-the-fleeca-job',
  Other: 'characters/ch-lester-crest',
};
let fallbackHits = 0;
for (const m of onlineMissions) {
  const key = `online-missions/${m.id}`;
  if (images[key]) continue;
  const img = (m.dlc && fromSameUpdate.get(m.dlc)) || images[TYPE_DEFAULT[m.type] ?? 'characters/ch-lester-crest'];
  if (img) {
    images[key] = img;
    fallbackHits++;
  }
}
console.log(`online-missions: +${fallbackHits} using a picture from the same update or mission type`);

// Cheats that spawn a vehicle or weapon reuse that item's picture.
const cheats = readJson('cheats.json');
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const vehicleByName = new Map(vehicles.map((v) => [norm(strip(v.name)), v.id]));
let cheatHits = 0;
for (const c of cheats) {
  const text = norm(`${c.name} ${c.effect}`);
  const match = [...vehicleByName.keys()].filter((n) => n.length > 2 && ` ${text} `.includes(` ${n} `)).sort((a, b) => b.length - a.length)[0];
  const img = match && images[`vehicles/${vehicleByName.get(match)}`];
  if (img) {
    images[`cheats/${c.id}`] = img;
    cheatHits++;
  }
}
console.log(`cheats: ${cheatHits}/${cheats.length} (vehicle spawns reuse the vehicle picture)`);

// "imageFrom" hints reuse another item's picture; they always win because they were chosen by hand.
// Skills first, since some cheats borrow a skill's picture.
for (const it of readJson('skills.json')) {
  if (it.imageFrom && images[it.imageFrom]) images[`skills/${it.id}`] = images[it.imageFrom];
}
for (const [key, hint] of Object.entries(HINTS)) {
  if (hint.imageFrom && images[hint.imageFrom]) images[key] = images[hint.imageFrom];
}
// Direct image URLs (e.g. gtabase pictures for vehicles the wiki doesn't cover yet).
for (const [key, hint] of Object.entries(HINTS)) {
  if (hint.src) images[key] = { src: hint.src, page: null };
}

fs.writeFileSync(path.join(dataDir, 'images.json'), JSON.stringify(images, null, 1) + '\n');
console.log(`wrote ${Object.keys(images).length} images`);
