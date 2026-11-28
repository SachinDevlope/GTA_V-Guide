# LS Index — GTA V & GTA Online reference

An unofficial, searchable reference for GTA V and GTA Online: story missions, Online missions and heists, businesses, vehicles, weapons, characters, cheats, skills and collectibles — with ratings, best upgrades/attachments, upgrade prices and maps.

> Fan project. Not affiliated with or endorsed by Rockstar Games or Take-Two Interactive. Data and images courtesy of the GTA Wiki community (CC BY-SA) and gtabase.

## Features

- **One search box** for everything, with typo tolerance, live suggestions, top searches and recent searches (press `/` to focus).
- **Story / Online switch** that filters every list.
- **Categories**: 140 story missions, 468 Online missions, 33 heists, 38 businesses, 824 vehicles, 106 weapons, 49 characters, 36 cheats, 8 skills, 39 collectibles.
- **Ratings (1–5 stars) with pros & cons**, computed from the data:
  - vehicles — lap time within their class (falls back to top speed, then the in-game stat bars);
  - weapons — damage, fire rate, accuracy and range within their category (utility items such as the ball or flare aren't rated);
  - businesses and heists — community money-making tier.
- **Best upgrades** for vehicles (with Los Santos Customs and Hao's Special Works prices and the fully upgraded price) and **best attachments** for weapons (with prices).
- **Trade prices** for 181 vehicles: the discounted price, how much you save and exactly how to unlock it, plus a filter by unlock type and a "Biggest trade discount" sort.
- **Heists**: best approach, key choices and payout range.
- **Business income by upgrade level**: what each business earns with no upgrades, with each upgrade and fully upgraded (per real-world hour, supply cost and profit after supplies), plus a sortable **Business income** comparison page.
- **Daily & weekly challenges**: live countdowns to the daily (06:00 UTC) and weekly (Thursday 10:00 UTC) resets, this week's event and Weekly Challenge (from `src/data/weekly-event.json`, flagged when out of date), rewards, streak bonuses and the list of possible daily challenges.
- **Business locations & prices**: every purchasable location with its price, the best pick and why, pinned on the map.
- **Best of** page with leaderboards for businesses, heists, weapons per type and vehicles per class.
- **Mission map** of story mission start points, and **collectible maps** for 18 GTA Online sets (1,023 spots) with a "found" checklist saved in the browser.
- Light and dark theme; works on phones.

## Getting started

Requirements: Node.js 22 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build (pre-renders every page) |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npm run data:images` | Re-fetch item pictures from the GTA Wiki into `src/data/images.json` |

## Project structure

The app uses the Next.js App Router with a feature-based layout: each feature owns its data definition, logic and components; `shared/` holds generic building blocks.

```
src/
  app/                      Routes only (thin pages that compose features)
    [category]/             Category list page, e.g. /vehicles
    [category]/[id]/        Item detail page, e.g. /vehicles/v-pegassi-zentorno
    map/  search/  best/    Mission map, search results, Best of
    income/                 Business income comparison
    search-index.json/      Static JSON search index, loaded on demand
  features/
    catalog/                Category registry, cards, lists, filters, detail page parts
    search/                 Search engine, search bar, suggestions, recent searches
    mode/                   Story / Online switch
    ratings/                Star ratings, rankings, pros & cons
    map/                    Leaflet map, game-coordinate projection, mission geocoding
    best/                   Best-of leaderboards
    missions/ vehicles/ weapons/ characters/ cheats/ skills/ collectibles/ online/
                            One CategoryDefinition per category (+ category-specific helpers)
  shared/                   Generic UI (Select, ThemeToggle, layout) and helpers
  data/                     All content as JSON (see below)
public/
  map/san-andreas.webp      Map image used by every map
  vehicles/                 A few vehicle pictures stored locally
scripts/
  fetch-images.mjs          Picture lookup (GTA Wiki API) → src/data/images.json
  convert-legacy-data.mjs   One-off converter from the first static prototype
legacy/                     The first plain-HTML prototype (kept for reference)
```

### How categories work

Every category is a `CategoryDefinition` (see `src/features/catalog/types.ts`) that describes how to show and search its items: subtitle, chips, facts, lists, stats, filters, sorts, rating and recommendations. The registry in `src/features/catalog/registry.ts` lists them in order.

To add a category: create a JSON file in `src/data/`, a feature folder with a `category.ts` exporting a `CategoryDefinition`, and add it to the registry. Lists, detail pages, search, filters and the sidebar pick it up automatically.

## Data

All content lives in `src/data/*.json` and is bundled at build time — there is no database or API key.

| File | Contents |
|---|---|
| `missions.json`, `online-missions.json`, `heists.json` | Story missions, Online missions, heists (with best approach and payouts) |
| `businesses.json` | Online businesses and properties with earnings, tiers, pros/cons, upgrades and income per upgrade level |
| `challenges.json`, `weekly-event.json` | Challenge rewards and pool; the current weekly event (update after each Thursday reset) |
| `business-locations.json` | Every location of each business with price, best pick and map coordinates |
| `vehicles.json`, `weapons.json` | Vehicles and weapons with stats, upgrades, prices and recommendations |
| `characters.json`, `cheats.json`, `skills.json` | Characters, cheat codes, skills |
| `collectibles.json`, `online-collectibles.json` | Collectible sets |
| `collectible-locations.json` | In-game coordinates of every collectible spot |
| `places.json` | Map image info and place positions used to pin story missions |
| `images.json` | Picture for each item (generated by `npm run data:images`) |
| `image-hints.json` | Hand-picked picture fixes used by the image script |

Sources: GTA Wiki, gtabase, Rockstar Newswire / support pages and community guides; descriptions are written in our own words. Prices, payouts and ratings can change with game updates — verify anything important in-game.

## License note

The code is yours to use. Game names, images and data belong to their respective owners; GTA Wiki content is CC BY-SA, so keep the attribution in the footer if you publish the site.
