import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await fs.readFile(path.join(root, 'festivals.json'), 'utf8'));
const outputRoot = path.join(root, 'festival');

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
})[character]);

await fs.mkdir(outputRoot, { recursive: true });
for (const festival of data.items ?? []) {
  if (!festival.slug || !festival.title || !festival.startDate || !festival.endDate) continue;
  const directory = path.join(outputRoot, festival.slug);
  await fs.mkdir(directory, { recursive: true });
  const canonical = `https://junhassss.github.io/korea-festival-calendar/festival/${encodeURIComponent(festival.slug)}/`;
  const document = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(festival.title)} | 전국축제달력</title><meta name="description" content="${escapeHtml(festival.description)}"><link rel="canonical" href="${canonical}"><meta http-equiv="refresh" content="0;url=../../?festival=${encodeURIComponent(festival.slug)}"></head><body><p><a href="../../?festival=${encodeURIComponent(festival.slug)}">${escapeHtml(festival.title)} 상세정보 보기</a></p></body></html>`;
  await fs.writeFile(path.join(directory, 'index.html'), document);
}

console.log(`Prepared ${(data.items ?? []).length} static festival routes.`);
