(() => {
  'use strict';

  const RAW = window.GTA_DATA || {};
  const arr = (x) => (Array.isArray(x) ? x : []);
  const IMAGES = RAW.images || {};
  // An item may carry its own "image" URL; otherwise use the generated data/images.js map.
  const imageOf = (cat, item) => (item.image ? { src: item.image, page: item.imagePage || null } : IMAGES[cat + '/' + item.id] || null);
  const imgTag = (img, alt, cls) => img
    ? `<img class="${cls}" src="${esc(img.src)}" alt="${esc(alt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.classList.add('broken')">`
    : '';
  const has = (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
  const money = (n) => (typeof n === 'number' ? '$' + n.toLocaleString('en-US') : null);
  const list = (v) => (Array.isArray(v) ? v.join(', ') : v);
  const priceRange = (a, b) => {
    if (typeof a !== 'number') return money(b);
    if (typeof b !== 'number' || a === b) return money(a);
    return money(a) + ' – ' + money(b);
  };
  const modeOfAvailability = (a) => (a === 'Story' ? ['Story'] : a === 'Online' ? ['Online'] : ['Story', 'Online']);

  // ---------- Category definitions ----------
  // Each category says how to label an item, which facts to show, how to filter and sort.
  const CATS = {
    missions: {
      label: 'Story Missions', short: 'Missions',
      items: arr(RAW.missions),
      modes: () => ['Story'],
      sub: (m) => [m.type, list(m.protagonists)].filter(has).join(' · '),
      chips: (m) => [m.order != null && '#' + m.order, m.giver].filter(Boolean),
      facts: (m) => [
        ['Type', m.type], ['Story order', m.order], ['Play as', list(m.protagonists)],
        ['Mission giver', m.giver, 'link'], ['Location', m.location], ['Reward', m.reward],
      ],
      lists: (m) => [['Gold medal objectives', m.goldObjectives], ['Unlocks', m.unlocks, 'link']],
      filters: [
        { key: 'type', label: 'Type' },
        { key: 'protagonists', label: 'Character' },
      ],
      sorts: { 'Story order': (a, b) => (a.order ?? 1e9) - (b.order ?? 1e9), 'Name A–Z': byName },
      search: (m) => [[m.name, 10], [m.tags, 5], [m.giver, 4], [m.protagonists, 3], [m.location, 3], [m.type, 2], [m.unlocks, 1], [m.goldObjectives, 1], [m.description, 1]],
    },
    heists: {
      label: 'Online Heists', short: 'Heists',
      items: arr(RAW.heists),
      modes: () => ['Online'],
      sub: (h) => [h.dlc, h.players && h.players + ' players'].filter(has).join(' · '),
      chips: (h) => [h.year, h.contact].filter(Boolean),
      facts: (h) => [
        ['Update', h.dlc], ['Released', h.year], ['Players', h.players], ['Contact', h.contact, 'link'],
        ['Starts at', h.startLocation], ['Requirement', h.requirement], ['Finale', h.finale],
        ['Potential take', h.potentialTake], ['Elite Challenge', h.eliteChallenge],
      ],
      lists: (h) => [['Approaches', h.approaches], ['Setup / prep missions', h.setups]],
      filters: [{ key: 'dlc', label: 'Update' }, { key: 'players', label: 'Players' }],
      sorts: { 'Release year': (a, b) => (a.year ?? 1e9) - (b.year ?? 1e9), 'Name A–Z': byName },
      search: (h) => [[h.name, 10], [h.tags, 5], [h.dlc, 4], [h.contact, 3], [h.approaches, 2], [h.setups, 2], [h.requirement, 1], [h.description, 1]],
    },
    businesses: {
      label: 'Online Businesses & Properties', short: 'Businesses',
      items: arr(RAW.businesses),
      modes: () => ['Online'],
      sub: (b) => [b.type, b.dlc].filter(has).join(' · '),
      chips: (b) => [priceRange(b.priceMin, b.priceMax), b.buyFrom].filter(Boolean),
      money: true,
      facts: (b) => [
        ['Type', b.type], ['Update', b.dlc], ['Buy from', b.buyFrom], ['Price', priceRange(b.priceMin, b.priceMax)],
        ['Requires', b.requires], ['How it earns', b.income],
      ],
      lists: () => [],
      filters: [{ key: 'type', label: 'Type' }, { key: 'dlc', label: 'Update' }, { key: 'buyFrom', label: 'Buy from' }],
      sorts: {
        'Price: low to high': (a, b) => (a.priceMin ?? 1e12) - (b.priceMin ?? 1e12),
        'Price: high to low': (a, b) => (b.priceMax ?? b.priceMin ?? -1) - (a.priceMax ?? a.priceMin ?? -1),
        'Name A–Z': byName,
      },
      search: (b) => [[b.name, 10], [b.tags, 5], [b.type, 3], [b.dlc, 3], [b.buyFrom, 2], [b.requires, 1], [b.income, 1], [b.description, 1]],
    },
    vehicles: {
      label: 'Vehicles', short: 'Vehicles',
      items: arr(RAW.vehicles),
      modes: (v) => modeOfAvailability(v.availability),
      sub: (v) => [v.manufacturer, v.class].filter(has).join(' · '),
      chips: (v) => [money(v.price), v.topSpeedMph && v.topSpeedMph + ' mph', v.availability === 'Online' ? 'Online only' : v.availability === 'Story' ? 'Story only' : null].filter(Boolean),
      facts: (v) => [
        ['Manufacturer', v.manufacturer], ['Class', v.class], ['Price', money(v.price)], ['Sold at', v.seller],
        ['Top speed', v.topSpeedMph && v.topSpeedMph + ' mph'], ['Seats', v.seats], ['Drivetrain', v.drivetrain],
        ['Based on', v.basedOn], ['Available in', v.availability === 'Both' ? 'Story & Online' : v.availability], ['Added in', v.dlc],
      ],
      lists: () => [],
      filters: [
        { key: 'class', label: 'Class' }, { key: 'manufacturer', label: 'Manufacturer' },
        { key: 'seller', label: 'Sold at' }, { key: 'availability', label: 'Available in' },
      ],
      sorts: {
        'Name A–Z': byName,
        'Price: high to low': (a, b) => (b.price ?? -1) - (a.price ?? -1),
        'Price: low to high': (a, b) => (a.price ?? 1e12) - (b.price ?? 1e12),
        'Top speed': (a, b) => (b.topSpeedMph ?? -1) - (a.topSpeedMph ?? -1),
      },
      search: (v) => [[v.name, 10], [v.tags, 5], [v.manufacturer, 4], [v.basedOn, 3], [v.class, 3], [v.seller, 1], [v.dlc, 1], [v.description, 1]],
    },
    weapons: {
      label: 'Weapons', short: 'Weapons',
      items: arr(RAW.weapons),
      modes: (w) => modeOfAvailability(w.availability),
      sub: (w) => [w.category, w.mk2 && 'Mk II'].filter(has).join(' · '),
      chips: (w) => [money(w.price), w.availability === 'Online' ? 'Online only' : null].filter(Boolean),
      facts: (w) => [
        ['Category', w.category], ['Price', money(w.price)], ['Based on', w.basedOn],
        ['Available in', w.availability === 'Both' ? 'Story & Online' : w.availability], ['Added in', w.dlc], ['Mk II', w.mk2 ? 'Yes' : null],
      ],
      lists: () => [],
      filters: [{ key: 'category', label: 'Category' }, { key: 'availability', label: 'Available in' }],
      sorts: {
        'Name A–Z': byName,
        'Price: low to high': (a, b) => (a.price ?? 1e12) - (b.price ?? 1e12),
        'Price: high to low': (a, b) => (b.price ?? -1) - (a.price ?? -1),
      },
      search: (w) => [[w.name, 10], [w.tags, 5], [w.basedOn, 3], [w.category, 3], [w.dlc, 1], [w.description, 1]],
    },
    characters: {
      label: 'Characters', short: 'Characters',
      items: arr(RAW.characters),
      modes: () => ['Story', 'Online'],
      sub: (c) => [c.role, c.affiliation].filter(has).join(' · '),
      chips: (c) => [c.voiceActor && 'Voice: ' + c.voiceActor].filter(Boolean),
      facts: (c) => [
        ['Role', c.role], ['Also known as', list(c.aliases)], ['Voice actor', c.voiceActor],
        ['Affiliation', c.affiliation], ['Special ability', c.specialAbility],
      ],
      lists: () => [],
      filters: [{ key: 'role', label: 'Role' }],
      sorts: { 'Name A–Z': byName },
      search: (c) => [[c.name, 10], [c.aliases, 8], [c.tags, 5], [c.voiceActor, 3], [c.affiliation, 2], [c.role, 2], [c.description, 1]],
    },
    cheats: {
      label: 'Cheats', short: 'Cheats',
      items: arr(RAW.cheats),
      modes: () => ['Story'],
      sub: (c) => c.effect,
      chips: (c) => [c.pc && 'PC: ' + c.pc].filter(Boolean),
      facts: (c) => [['Effect', c.effect], ['Notes', c.notes]],
      codes: (c) => [['PC', c.pc], ['Phone', c.phone], ['PlayStation', c.playstation], ['Xbox', c.xbox]],
      lists: () => [],
      filters: [],
      sorts: { 'Name A–Z': byName },
      search: (c) => [[c.name, 10], [c.pc, 9], [c.tags, 5], [c.effect, 3], [c.phone, 2], [c.notes, 1]],
    },
    skills: {
      label: 'Skills & Stats', short: 'Skills',
      items: arr(RAW.skills),
      modes: () => ['Story'],
      sub: (s) => s.summary,
      chips: () => [],
      facts: () => [],
      lists: (s) => [['How to improve', s.howToImprove]],
      filters: [],
      sorts: { 'Default': () => 0, 'Name A–Z': byName },
      search: (s) => [[s.name, 10], [s.tags, 5], [s.summary, 3], [s.howToImprove, 2], [s.description, 1]],
    },
    collectibles: {
      label: 'Collectibles', short: 'Collectibles',
      items: [
        ...arr(RAW.collectibles).map((c) => ({ ...c, mode: 'Story' })),
        ...arr(RAW.onlineCollectibles).map((c) => ({ ...c, mode: 'Online' })),
      ],
      modes: (c) => [c.mode],
      sub: (c) => [c.mode, c.character && c.character !== 'Any' && c.character].filter(has).join(' · '),
      chips: (c) => [c.count && c.count + ' to find', c.reward && c.reward.length < 34 && c.reward].filter(Boolean),
      facts: (c) => [['Mode', c.mode], ['How many', c.count], ['Character', c.character], ['Given by', c.giver, 'link'], ['Reward', c.reward]],
      lists: () => [],
      filters: [{ key: 'mode', label: 'Mode' }],
      sorts: { 'Default': () => 0, 'Name A–Z': byName, 'Most to find': (a, b) => (b.count ?? -1) - (a.count ?? -1) },
      search: (c) => [[c.name, 10], [c.tags, 5], [c.giver, 3], [c.character, 2], [c.reward, 2], [c.mode, 1], [c.description, 1]],
    },
  };
  function byName(a, b) { return String(a.name).localeCompare(String(b.name)); }

  const CAT_KEYS = Object.keys(CATS);
  const ALL = [];
  for (const key of CAT_KEYS) {
    for (const item of CATS[key].items) {
      const modes = CATS[key].modes(item);
      ALL.push({ cat: key, item, modes, fields: indexFields([...CATS[key].search(item), [CATS[key].label, 1], [modes.join(' '), 1]]) });
    }
  }
  const BY_ID = new Map(ALL.map((e) => [e.cat + '/' + e.item.id, e]));
  const BY_NAME = new Map();
  for (const e of ALL) {
    const names = [e.item.name, ...(Array.isArray(e.item.aliases) ? e.item.aliases : [])];
    for (const n of names) if (n && !BY_NAME.has(norm(n))) BY_NAME.set(norm(n), e);
  }

  // ---------- Search ----------
  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\bmk\s*ii\b/g, 'mk2').replace(/[^a-z0-9$]+/g, ' ').trim();
  }
  function indexFields(pairs) {
    const out = [];
    for (const [val, w] of pairs) {
      if (!has(val)) continue;
      const vals = Array.isArray(val) ? val : [val];
      for (const v of vals) {
        if (!has(v)) continue;
        const n = norm(v);
        out.push({ n, words: n.split(' '), compact: n.replace(/ /g, ''), w });
      }
    }
    return out;
  }
  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let best = i;
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }
  function scoreEntry(entry, tokens, qCompact) {
    let total = 0;
    for (const t of tokens) {
      let best = 0;
      const maxEdits = t.length >= 7 ? 2 : t.length >= 4 ? 1 : 0;
      for (const f of entry.fields) {
        let s = 0;
        if (f.n === t) s = f.w * 4;
        else if (f.words.includes(t)) s = f.w * 3;
        else if (f.words.some((w) => w.startsWith(t))) s = f.w * 2;
        else if (f.n.includes(t) || f.compact.includes(t)) s = f.w * 1.2;
        else if (maxEdits && f.w >= 3) {
          for (const w of f.words) if (w.length >= 3 && lev(t, w, maxEdits) <= maxEdits) { s = f.w * 0.7; break; }
        }
        if (s > best) best = s;
      }
      if (!best) return 0; // every word must match something
      total += best;
    }
    const name = entry.fields[0];
    if (name && name.w === 10) {
      if (name.n === tokens.join(' ') || name.compact === qCompact) total += 60;
      else if (name.compact.startsWith(qCompact)) total += 25;
    }
    return total;
  }
  function search(q, candidates) {
    const nq = norm(q);
    const tokens = nq.split(' ').filter(Boolean);
    if (!tokens.length) return candidates.map((e) => ({ e, s: 0 }));
    const qCompact = nq.replace(/ /g, '');
    const out = [];
    for (const e of candidates) {
      const s = scoreEntry(e, tokens, qCompact);
      if (s > 0) out.push({ e, s });
    }
    return out.sort((a, b) => b.s - a.s);
  }

  // ---------- State ----------
  const state = { cat: 'all', mode: 'all', q: '', filters: {}, sort: null };
  const $ = (id) => document.getElementById(id);
  const els = { mapview: $('mapview'), q: $('q'), tabs: $('tabs'), modes: $('modes'), toolbar: $('toolbar'), status: $('status'), home: $('home'), results: $('results'), drawer: $('drawer'), backdrop: $('drawer-backdrop'), dBody: $('d-body'), dCat: $('d-cat') };

  try {
    const saved = localStorage.getItem('lsindex-theme');
    if (saved) document.documentElement.dataset.theme = saved;
    const savedMode = localStorage.getItem('lsindex-mode');
    if (savedMode) state.mode = savedMode;
  } catch (_) { /* storage blocked */ }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function highlight(text, tokens) {
    let html = esc(text);
    if (!tokens.length) return html;
    const parts = tokens.filter((t) => t.length > 1).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!parts.length) return html;
    return html.replace(new RegExp('(' + parts.join('|') + ')', 'gi'), '<mark>$1</mark>');
  }
  const inMode = (e) => state.mode === 'all' || e.modes.includes(state.mode);

  // ---------- Mission map ----------
  const PLACES = RAW.places || {};
  const OFF_MAP = arr(RAW.offMap);
  const MAP_IMG = RAW.mapImage || null;
  const PLACE_KEYS = Object.keys(PLACES).sort((a, b) => b.length - a.length);
  const placeNorm = (s) => ' ' + String(s).toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']+/g, ' ').trim() + ' ';
  const GEO = new Map();
  // Turn a mission's location text into a map position. The first "/"-separated part is where it starts.
  function geoOf(m) {
    if (GEO.has(m.id)) return GEO.get(m.id);
    let g = { xy: null };
    const text = String(m.location || '');
    const segs = [text.split('/')[0], text];
    if (OFF_MAP.some((p) => placeNorm(segs[0]).includes(' ' + p + ' '))) g = { xy: null, off: true };
    else {
      outer: for (const seg of segs) {
        const n = placeNorm(seg);
        for (const k of PLACE_KEYS) {
          if (n.includes(' ' + placeNorm(k).trim() + ' ')) {
            const v = PLACES[k];
            g = { xy: Array.isArray(v) ? v : v.at, area: !Array.isArray(v), place: k.replace(/\b\w/g, (c) => c.toUpperCase()) };
            break outer;
          }
        }
      }
    }
    GEO.set(m.id, g);
    return g;
  }
  const PIN_COLORS = { Michael: 'var(--p-michael)', Franklin: 'var(--p-franklin)', Trevor: 'var(--p-trevor)' };
  let map = null, pinLayer = null, pinsByPlace = new Map();
  function ensureMap() {
    if (map || !window.L || !MAP_IMG) return map;
    const S = MAP_IMG.size;
    map = L.map('map', { crs: L.CRS.Simple, minZoom: -1.5, maxZoom: 2.5, zoomSnap: 0.25, attributionControl: false });
    const bounds = [[-S, 0], [0, S]];
    L.imageOverlay(MAP_IMG.src, bounds).addTo(map);
    map.fitBounds([[-S * 0.92, S * 0.18], [-S * 0.08, S * 0.82]]);
    map.setMaxBounds([[-S * 1.1, -S * 0.1], [S * 0.1, S * 1.1]]);
    pinLayer = L.layerGroup().addTo(map);
    return map;
  }
  function renderMap(missions, searching) {
    if (!ensureMap()) {
      els.status.textContent = 'The map needs an internet connection (map library and image are loaded online).';
      return;
    }
    setTimeout(() => map.invalidateSize(), 0);
    pinLayer.clearLayers();
    pinsByPlace = new Map();
    const groups = new Map();
    let off = 0, unknown = 0;
    for (const e of missions) {
      const g = geoOf(e.item);
      if (!g.xy) { g.off ? off++ : unknown++; continue; }
      const key = g.xy.join(',');
      if (!groups.has(key)) groups.set(key, { g, list: [] });
      groups.get(key).list.push(e.item);
    }
    for (const [key, { g, list }] of groups) {
      const people = new Set(list.flatMap((m) => m.protagonists || []));
      const color = people.size === 1 ? (PIN_COLORS[[...people][0]] || 'var(--p-multi)') : 'var(--p-multi)';
      const icon = L.divIcon({
        className: 'pin-wrap',
        html: `<span class="pin ${g.area ? 'pin-area' : ''}" style="--pin:${color}">${list.length > 1 ? list.length : ''}</span>`,
        iconSize: [26, 26], iconAnchor: [13, 13],
      });
      const sorted = list.slice().sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9));
      const html = `<div class="pop"><div class="pop-place">${esc(g.place)}${g.area ? ' <span>(area)</span>' : ''}</div>${sorted.map((m) =>
        `<button class="pop-row" data-open="missions/${esc(m.id)}"><b>${esc(m.name)}</b><span>${esc([m.type, (m.protagonists || []).join(', ')].filter(Boolean).join(' · '))}</span></button>`).join('')}</div>`;
      const marker = L.marker([-g.xy[1], g.xy[0]], { icon, title: sorted.map((m) => m.name).join(', '), riseOnHover: true })
        .bindPopup(html, { maxWidth: 300, maxHeight: 280 })
        .addTo(pinLayer);
      for (const m of list) pinsByPlace.set(m.id, marker);
    }
    const pinned = missions.length - off - unknown;
    els.status.textContent = `${pinned} missions on the map${searching ? ` for “${state.q.trim()}”` : ''}` +
      (off ? ` · ${off} in North Yankton (off the map)` : '') + (unknown ? ` · ${unknown} with no fixed location` : '');
    if (searching && groups.size) {
      const pts = [...groups.values()].map(({ g }) => [-g.xy[1], g.xy[0]]);
      if (pts.length === 1) map.setView(pts[0], 1); else map.fitBounds(pts, { padding: [40, 40], maxZoom: 1 });
    }
  }
  function focusOnMap(id) {
    const marker = pinsByPlace.get(id);
    if (!marker || !map) return;
    map.setView(marker.getLatLng(), 1.25);
    marker.openPopup();
  }

  // ---------- Rendering ----------
  function renderModes() {
    const opts = [['all', 'Story + Online'], ['Story', 'Story mode'], ['Online', 'GTA Online']];
    els.modes.innerHTML = opts.map(([k, l]) =>
      `<button class="mode" data-mode="${k}" aria-pressed="${state.mode === k}">${l}</button>`).join('');
  }
  function renderTabs() {
    const counts = {};
    for (const e of ALL) if (inMode(e)) counts[e.cat] = (counts[e.cat] || 0) + 1;
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const pinned = state.mode === 'Online' ? 0 : ALL.filter((e) => e.cat === 'missions' && geoOf(e.item).xy).length;
    const tabs = [['all', 'All', total], ...(pinned ? [['map', 'Mission Map', pinned]] : []), ...CAT_KEYS.filter((k) => counts[k]).map((k) => [k, CATS[k].short, counts[k]])];
    els.tabs.innerHTML = tabs.map(([k, l, n]) =>
      `<button class="tab" data-cat="${k}" aria-pressed="${state.cat === k}" style="--cat:var(--c-${k === 'map' ? 'missions' : k})">${l}<span class="n">${n}</span></button>`).join('');
  }

  function renderToolbar(pool) {
    const def = state.cat === 'map' ? CATS.missions : CATS[state.cat];
    if (!def) { els.toolbar.hidden = true; return; }
    const html = [];
    for (const f of def.filters) {
      const values = new Set();
      for (const e of pool) {
        const v = e.item[f.key];
        (Array.isArray(v) ? v : [v]).forEach((x) => has(x) && values.add(String(x)));
      }
      if (values.size < 2) continue;
      const sorted = [...values].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      const cur = state.filters[f.key] || '';
      html.push(`<label>${f.label}<select data-filter="${f.key}"><option value="">All</option>${sorted.map((v) => `<option ${v === cur ? 'selected' : ''} value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label>`);
    }
    const sortNames = state.cat === 'map' ? [] : Object.keys(def.sorts);
    if (sortNames.length > 1) {
      const cur = state.sort || sortNames[0];
      html.push(`<label>Sort<select data-sort>${sortNames.map((s) => `<option ${s === cur ? 'selected' : ''}>${s}</option>`).join('')}</select></label>`);
    }
    if (Object.values(state.filters).some(Boolean)) html.push('<button class="reset" data-reset>Clear filters</button>');
    els.toolbar.innerHTML = html.join('');
    els.toolbar.hidden = html.length === 0;
  }

  function card(e, tokens) {
    const def = CATS[e.cat];
    const it = e.item;
    const chips = def.chips(it).map((c) => `<span class="chip ${/^\$/.test(c) ? 'money' : ''}">${esc(c)}</span>`).join('');
    const sub = def.sub(it);
    return `<button class="card" data-open="${e.cat}/${esc(it.id)}" style="--cat:var(--c-${e.cat})">
      ${imgTag(imageOf(e.cat, it), it.name, 'thumb thumb-' + e.cat)}
      <div class="card-top"><h3>${highlight(it.name, tokens)}</h3>${state.cat === 'all' ? `<span class="badge">${def.short}</span>` : ''}</div>
      ${sub ? `<div class="sub">${highlight(sub, tokens)}</div>` : ''}
      ${it.description ? `<div class="desc">${esc(it.description)}</div>` : ''}
      ${chips ? `<div class="chips">${chips}</div>` : ''}
    </button>`;
  }

  function renderHome() {
    const counts = {};
    for (const e of ALL) if (inMode(e)) counts[e.cat] = (counts[e.cat] || 0) + 1;
    const tiles = CAT_KEYS.filter((k) => counts[k]).map((k) =>
      `<button class="tile" data-cat="${k}" style="--cat:var(--c-${k})"><div class="num">${counts[k]}</div><div class="lbl">${CATS[k].label}</div></button>`).join('');
    const tries = ['Zentorno', 'Blitz Play', 'Cayo Perico', 'painkiller', 'Oppressor', 'Bunker', 'Lester', 'Stamina', 'spaceship parts', 'railgun', 'nightclub', 'Trevor missions'];
    els.home.innerHTML = `
      <div class="hero">
        <h1>Find anything in Los Santos.</h1>
        <p>Story missions, Online heists and businesses, vehicles, weapons, characters, cheats, skills and collectibles — one search box. Typos are fine.</p>
        <div class="try">${tries.map((t) => `<button data-try="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      </div>
      <h2>Browse</h2>
      <div class="tiles">${tiles || '<p class="status">No data files loaded yet. Check the data/ folder.</p>'}</div>
      <h2>Story missions in order</h2>`;
  }

  function render() {
    renderModes();
    renderTabs();
    const tokens = norm(state.q).split(' ').filter(Boolean);
    let pool = ALL.filter((e) => inMode(e) && (state.cat === 'all' || e.cat === state.cat || (state.cat === 'map' && e.cat === 'missions')));
    renderToolbar(pool);

    for (const [k, v] of Object.entries(state.filters)) {
      if (!v) continue;
      pool = pool.filter((e) => {
        const x = e.item[k];
        return Array.isArray(x) ? x.map(String).includes(v) : String(x) === v;
      });
    }

    const isMap = state.cat === 'map';
    els.mapview.hidden = !isMap;
    els.results.hidden = isMap;
    if (isMap) {
      els.home.hidden = true;
      const shownMap = tokens.length ? search(state.q, pool).map((r) => r.e) : pool;
      renderMap(shownMap, tokens.length > 0);
      return;
    }

    const showHome = state.cat === 'all' && !tokens.length;
    els.home.hidden = !showHome;
    let shown;
    if (showHome) {
      renderHome();
      shown = pool.filter((e) => e.cat === 'missions' && e.item.type !== 'Strangers and Freaks')
        .sort((a, b) => (a.item.order ?? 1e9) - (b.item.order ?? 1e9));
      if (!shown.length) els.home.lastElementChild.remove();
    } else if (tokens.length) {
      shown = search(state.q, pool).map((r) => r.e);
    } else {
      const def = CATS[state.cat];
      const sortFn = def.sorts[state.sort] || Object.values(def.sorts)[0];
      shown = pool.slice().sort((a, b) => sortFn(a.item, b.item));
    }

    const LIMIT = 300;
    const what = state.cat === 'all' ? 'results' : CATS[state.cat].label.toLowerCase();
    els.status.textContent = showHome ? '' :
      `${shown.length} ${what}${tokens.length ? ` for “${state.q.trim()}”` : ''}${shown.length > LIMIT ? ` — showing first ${LIMIT}` : ''}`;
    els.results.innerHTML = shown.length
      ? shown.slice(0, LIMIT).map((e) => card(e, tokens)).join('')
      : `<div class="empty"><strong>Nothing found.</strong>Try fewer words, another spelling, or switch to “All” / “Story + Online”.</div>`;
  }

  function factValue(val, kind) {
    if (kind === 'link') {
      const parts = Array.isArray(val) ? val : String(val).split(/\s*\/\s*/);
      return parts.map((p) => {
        const target = BY_NAME.get(norm(p));
        return target ? `<button class="link" data-open="${target.cat}/${esc(target.item.id)}">${esc(p)}</button>` : esc(p);
      }).join(Array.isArray(val) ? ', ' : ' / ');
    }
    return esc(val);
  }

  function openItem(key, push = true) {
    const e = BY_ID.get(key);
    if (!e) return;
    const def = CATS[e.cat];
    const it = e.item;
    const facts = def.facts(it).filter(([, v]) => has(v));
    const codes = def.codes ? def.codes(it).filter(([, v]) => has(v)) : [];
    const lists = def.lists(it).filter(([, v]) => has(v));
    els.dCat.textContent = def.label;
    els.dCat.style.setProperty('--cat', `var(--c-${e.cat})`);
    els.dBody.innerHTML = `
      ${(() => {
        const img = imageOf(e.cat, it);
        if (!img) return '';
        const credit = img.page ? `<a href="${esc(img.page)}" target="_blank" rel="noopener noreferrer">GTA Wiki</a>` : 'GTA Wiki';
        return `<figure class="hero-img hero-${e.cat}">${imgTag(img, it.name, '')}<figcaption>Image: ${credit}</figcaption></figure>`;
      })()}
      <h2 id="d-title">${esc(it.name)}</h2>
      ${def.sub(it) ? `<div class="sub">${esc(def.sub(it))}</div>` : ''}
      ${it.description ? `<p class="lead">${esc(it.description)}</p>` : ''}
      ${e.cat === 'missions' && geoOf(it).xy ? `<p><button class="map-btn" data-mapfocus="${esc(it.id)}">Show on map — ${esc(geoOf(it).place)}</button></p>` : ''}
      ${codes.length ? `<h4>Cheat codes</h4>${codes.map(([p, c]) => `<div class="code-row"><span class="plat">${p}</span><code>${esc(c)}</code><button class="copy" data-copy="${esc(c)}">Copy</button></div>`).join('')}` : ''}
      ${facts.length ? `<dl class="facts">${facts.map(([k, v, kind]) => `<dt>${k}</dt><dd>${factValue(v, kind)}</dd>`).join('')}</dl>` : ''}
      ${lists.map(([title, items, kind]) => `<h4>${title}</h4><ul>${items.map((x) => `<li>${kind === 'link' ? factValue(x, 'link') : esc(x)}</li>`).join('')}</ul>`).join('')}
      ${has(it.tags) ? `<h4>Keywords</h4><div class="chips">${it.tags.map((t) => `<button class="chip link-chip" data-try="${esc(t)}">${esc(t)}</button>`).join('')}</div>` : ''}`;
    els.backdrop.hidden = false;
    els.drawer.classList.add('open');
    els.drawer.setAttribute('aria-hidden', 'false');
    els.dBody.scrollTop = 0;
    if (push) { history.pushState(null, '', '#/' + key); remember({ key }); }
    setTimeout(() => $('d-close').focus(), 50);
  }
  function closeItem(push = true) {
    if (!els.drawer.classList.contains('open')) return;
    els.drawer.classList.remove('open');
    els.drawer.setAttribute('aria-hidden', 'true');
    els.backdrop.hidden = true;
    if (push) history.pushState(null, '', location.pathname + location.search);
  }

  // ---------- Search suggestions (autocomplete, popular, recent) ----------
  const POPULAR = [
    'Oppressor Mk II', 'The Cayo Perico Heist', 'Zentorno', 'The Diamond Casino Heist', 'Kosatka',
    'Invincibility', 'Blitz Play', 'The Big Score', 'Nightclub', 'Bunker', 'Deluxo', 'Railgun',
    'Armored Kuruma', 'Lester Crest', 'Spaceship Parts', 'Stamina',
  ];
  const sugg = { el: $('suggest'), rows: [], active: -1 };
  const loadRecent = () => { try { return JSON.parse(localStorage.getItem('lsindex-recent') || '[]'); } catch (_) { return []; } };
  function remember(entry) {
    const recent = loadRecent().filter((r) => (r.key || r.q) !== (entry.key || entry.q));
    recent.unshift(entry);
    try { localStorage.setItem('lsindex-recent', JSON.stringify(recent.slice(0, 6))); } catch (_) {}
  }
  function findByName(name) {
    const direct = BY_NAME.get(norm(name));
    if (direct) return direct;
    const r = search(name, ALL)[0];
    return r && r.s >= 60 ? r.e : null;
  }
  function itemRow(e, tokens) {
    const def = CATS[e.cat];
    const sub = def.sub(e.item) || '';
    return { kind: 'item', key: e.cat + '/' + e.item.id,
      html: `${imgTag(imageOf(e.cat, e.item), '', 's-img') || '<span class="s-img s-dot" style="--cat:var(--c-' + e.cat + ')"></span>'}<span class="s-name">${highlight(e.item.name, tokens)}</span><span class="s-sub">${esc(sub)}</span><span class="badge" style="--cat:var(--c-${e.cat})">${def.short}</span>` };
  }
  function buildSuggestions() {
    const q = els.q.value.trim();
    const tokens = norm(q).split(' ').filter(Boolean);
    const sections = [];
    if (!tokens.length) {
      const recent = loadRecent().map((r) => {
        if (r.key) { const e = BY_ID.get(r.key); return e && { ...itemRow(e, []), recent: true }; }
        return { kind: 'query', q: r.q, recent: true, html: `<span class="s-name">${esc(r.q)}</span><span class="s-sub">Recent search</span>` };
      }).filter(Boolean);
      if (recent.length) sections.push(['Recent', recent, true]);
      const seen = new Set(recent.map((r) => r.key));
      const popular = POPULAR.map(findByName).filter((e) => e && inMode(e))
        .map((e) => itemRow(e, [])).filter((r) => !seen.has(r.key)).slice(0, 8);
      if (popular.length) sections.push(['Top searches', popular]);
    } else {
      const pool = ALL.filter((e) => inMode(e) && (state.cat === 'all' || e.cat === state.cat));
      const results = search(q, pool);
      // Category shortcuts when the query names a category ("cheats", "heists", "super cars"…)
      const catHits = CAT_KEYS.filter((k) => CATS[k].items.length && (norm(CATS[k].label).split(' ').some((w) => w.startsWith(tokens[0]) && tokens[0].length >= 3)));
      const rows = results.slice(0, 7).map((r) => itemRow(r.e, tokens));
      sections.push([results.length ? 'Best matches' : 'No direct matches', rows]);
      const more = catHits.map((k) => ({ kind: 'cat', cat: k, html: `<span class="s-name">Browse all ${esc(CATS[k].label)}</span><span class="badge" style="--cat:var(--c-${k})">${CATS[k].items.length}</span>` }));
      more.push({ kind: 'query', q, html: `<span class="s-name">See all ${results.length} results for “${esc(q)}”</span><span class="s-sub">Enter</span>` });
      sections.push(['', more]);
    }
    sugg.rows = [];
    let html = '';
    for (const [title, rows, clearable] of sections) {
      if (!rows.length && !title) continue;
      html += `<div class="s-head">${esc(title)}${clearable ? '<button class="s-clear" data-sclear>Clear</button>' : ''}</div>`;
      for (const r of rows) {
        const i = sugg.rows.push(r) - 1;
        html += `<div class="s-row" role="option" id="s-${i}" data-sidx="${i}">${r.html}</div>`;
      }
    }
    sugg.el.innerHTML = html;
    sugg.active = -1;
    showSuggest(sugg.rows.length > 0);
  }
  function showSuggest(on) {
    sugg.el.hidden = !on;
    els.q.setAttribute('aria-expanded', String(on));
    if (!on) els.q.removeAttribute('aria-activedescendant');
  }
  function setActive(i) {
    const n = sugg.rows.length;
    if (!n) return;
    sugg.active = (i + n) % n;
    sugg.el.querySelectorAll('.s-row').forEach((r) => r.classList.toggle('active', Number(r.dataset.sidx) === sugg.active));
    const act = $('s-' + sugg.active);
    if (act) { act.scrollIntoView({ block: 'nearest' }); els.q.setAttribute('aria-activedescendant', act.id); }
  }
  function runQuery(q) {
    showSuggest(false);
    els.q.value = state.q = q;
    if (q.trim()) remember({ q: q.trim() });
    render();
  }
  function pick(row) {
    if (!row) return runQuery(els.q.value);
    showSuggest(false);
    if (row.kind === 'item') { remember({ key: row.key }); openItem(row.key); }
    else if (row.kind === 'cat') { state.cat = row.cat; state.filters = {}; state.sort = null; els.q.value = state.q = ''; render(); }
    else runQuery(row.q);
  }
  sugg.el.addEventListener('mousedown', (ev) => ev.preventDefault()); // keep focus in input
  sugg.el.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-sclear]')) {
      try { localStorage.removeItem('lsindex-recent'); } catch (_) {}
      buildSuggestions(); return;
    }
    const row = ev.target.closest('[data-sidx]');
    if (row) pick(sugg.rows[Number(row.dataset.sidx)]);
  });

  // ---------- Events ----------
  let t;
  els.q.addEventListener('input', () => {
    buildSuggestions();
    clearTimeout(t);
    t = setTimeout(() => { state.q = els.q.value; render(); }, 120);
  });
  els.q.addEventListener('focus', buildSuggestions);
  els.q.addEventListener('blur', () => setTimeout(() => showSuggest(false), 120));
  els.q.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); if (sugg.el.hidden) buildSuggestions(); setActive(sugg.active + 1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(sugg.active - 1); }
    else if (ev.key === 'Enter') { ev.preventDefault(); pick(sugg.active >= 0 ? sugg.rows[sugg.active] : null); }
    else if (ev.key === 'Escape' && !sugg.el.hidden) { ev.stopPropagation(); showSuggest(false); }
  });

  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-open],[data-mapfocus],[data-cat],[data-mode],[data-try],[data-copy],[data-reset]');
    if (!el) return;
    if (el.dataset.copy !== undefined) {
      navigator.clipboard?.writeText(el.dataset.copy).then(() => { el.textContent = 'Copied'; setTimeout(() => (el.textContent = 'Copy'), 1200); });
      return;
    }
    if (el.dataset.open) { openItem(el.dataset.open); return; }
    if (el.dataset.mapfocus) {
      closeItem();
      state.cat = 'map'; state.filters = {}; els.q.value = state.q = '';
      if (state.mode === 'Online') state.mode = 'all';
      render(); window.scrollTo(0, 0);
      focusOnMap(el.dataset.mapfocus);
      return;
    }
    if (el.dataset.try) {
      closeItem();
      state.cat = 'all'; state.filters = {};
      els.q.value = state.q = el.dataset.try;
      render(); window.scrollTo(0, 0); return;
    }
    if (el.dataset.mode) {
      state.mode = el.dataset.mode; state.filters = {};
      try { localStorage.setItem('lsindex-mode', state.mode); } catch (_) {}
      render(); return;
    }
    if (el.dataset.reset !== undefined) { state.filters = {}; render(); return; }
    if (el.dataset.cat) {
      state.cat = el.dataset.cat; state.filters = {}; state.sort = null;
      render(); window.scrollTo(0, 0);
    }
  });
  els.toolbar.addEventListener('change', (ev) => {
    const s = ev.target;
    if (s.dataset.filter) state.filters[s.dataset.filter] = s.value;
    if (s.hasAttribute('data-sort')) state.sort = s.value;
    render();
  });
  $('d-close').addEventListener('click', () => closeItem());
  els.backdrop.addEventListener('click', () => closeItem());
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeItem();
    if (ev.key === '/' && document.activeElement !== els.q) { ev.preventDefault(); els.q.focus(); els.q.select(); }
  });
  $('theme').addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('lsindex-theme', root.dataset.theme); } catch (_) {}
  });
  document.querySelector('.brand').addEventListener('click', (ev) => {
    ev.preventDefault();
    closeItem(); state.cat = 'all'; state.filters = {}; els.q.value = state.q = ''; render();
  });

  function fromHash(push) {
    const key = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    if (key && BY_ID.has(key)) openItem(key, push);
    else closeItem(false);
  }
  window.addEventListener('popstate', () => fromHash(false));

  render();
  fromHash(false);
})();
