// One-off helper: converts the legacy browser data files (data/*.js or legacy/data/*.js,
// which assign to window.GTA_DATA) into the JSON files the Next.js app reads from src/data.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = [path.join(root, 'data'), path.join(root, 'legacy', 'data')].find((d) => fs.existsSync(d));
if (!srcDir) throw new Error('No legacy data folder found');

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of fs.readdirSync(srcDir).filter((f) => f.endsWith('.js'))) {
  vm.runInContext(fs.readFileSync(path.join(srcDir, f), 'utf8'), ctx, { filename: f });
}
const D = ctx.window.GTA_DATA;
const out = path.join(root, 'src', 'data');
fs.mkdirSync(out, { recursive: true });
const write = (name, value) => {
  if (value === undefined) return console.log(`skip ${name} (not found)`);
  fs.writeFileSync(path.join(out, name + '.json'), JSON.stringify(value, null, 2) + '\n');
  console.log(`${name}.json  ${Array.isArray(value) ? value.length + ' items' : Object.keys(value).length + ' keys'}`);
};
write('missions', D.missions);
write('vehicles', D.vehicles);
write('weapons', D.weapons);
write('characters', D.characters);
write('cheats', D.cheats);
write('skills', D.skills);
write('collectibles', D.collectibles);
write('heists', D.heists);
write('businesses', D.businesses);
write('online-collectibles', D.onlineCollectibles);
write('places', D.places && { mapImage: D.mapImage, offMap: D.offMap, places: D.places });
