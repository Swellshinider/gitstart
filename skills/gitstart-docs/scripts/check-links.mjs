#!/usr/bin/env node
// Usage: node check-links.mjs [root]  — exits 1 and lists file:line -> target for each broken relative link.
import fs from 'node:fs';
import path from 'node:path';

const skip = new Set(['.git', 'node_modules']);

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (skip.has(entry.name)) return [];
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

// ponytail: anchors (#section) are not validated; add GitHub slug matching if section links break often.
function brokenLinks(root) {
  const broken = [];
  for (const file of markdownFiles(root)) {
    let fence = null;
    fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((text, index) => {
      const marker = text.match(/^\s*(`{3,}|~{3,})/)?.[1];
      if (fence) {
        if (marker && marker[0] === fence[0] && marker.length >= fence.length) fence = null;
        return;
      }
      if (marker) { fence = marker; return; }
      const line = text.replace(/`[^`]*`/g, '');
      const targets = [
        ...[...line.matchAll(/\]\(\s*<?([^)\s>]+)/g)].map(match => match[1]),
        ...[...line.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)].map(match => match[1]),
      ];
      for (const raw of targets) {
        if (/^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(raw)) continue;
        const target = decodeURI(raw.split(/[#?]/)[0]);
        if (target && !fs.existsSync(path.resolve(path.dirname(file), target))) {
          broken.push(`${path.relative(root, file)}:${index + 1} -> ${raw}`);
        }
      }
    });
  }
  return broken;
}

const root = path.resolve(process.argv[2] ?? '.');
const broken = brokenLinks(root);
if (broken.length) {
  console.error(`Broken links:\n${broken.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('No broken relative links.');
}
