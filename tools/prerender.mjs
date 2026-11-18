// Local helper (not a deploy step): writes the English article into index.html
// so the page is complete without JavaScript. Run after editing content/en.json:
//   node tools/prerender.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderApp, footer, esc } from '../render.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const c = JSON.parse(await readFile(join(root, 'content/en.json'), 'utf8'));
let html = await readFile(join(root, 'index.html'), 'utf8');

const swap = (name, body) => {
  const re = new RegExp(`(<!--${name}:START-->)[\\s\\S]*?(<!--${name}:END-->)`);
  if (!re.test(html)) throw new Error(`Marker ${name} not found`);
  html = html.replace(re, `$1\n${body}\n  $2`);
};

swap('HEAD', `  <title>${esc(c.meta.title)}</title>
  <meta name="description" content="${esc(c.meta.description)}">
  <meta property="og:title" content="${esc(c.meta.ogTitle)}">
  <meta property="og:description" content="${esc(c.meta.ogDescription)}">
  <meta property="og:locale" content="en_GB">`);
swap('APP', renderApp(c));
swap('FOOTER', `    ${footer(c)}`);

await writeFile(join(root, 'index.html'), html);
console.log('index.html pre-rendered from content/en.json');
