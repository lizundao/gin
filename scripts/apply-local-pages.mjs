#!/usr/bin/env node
/**
 * Copy local pages from src/content/pages/ into src/content/docs/.
 * Run before dev/build so Starlight can resolve sidebar slugs.
 */
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const TARGET = join(ROOT, 'src/content/docs');
const LOCAL_PAGES = join(ROOT, 'src/content/pages');

if (!existsSync(LOCAL_PAGES)) {
	console.log('No local pages to apply.');
	process.exit(0);
}

const indexSrc = join(LOCAL_PAGES, 'index.mdx');
if (existsSync(indexSrc)) {
	cpSync(indexSrc, join(TARGET, 'index.mdx'));
}

const aboutDir = join(LOCAL_PAGES, 'about');
if (existsSync(aboutDir)) {
	for (const file of readdirSync(aboutDir)) {
		if (!file.endsWith('.md')) continue;
		const locale = file.replace(/\.md$/, '');
		const dest = join(TARGET, locale, 'about.md');
		mkdirSync(dirname(dest), { recursive: true });
		cpSync(join(aboutDir, file), dest);
	}
}

console.log('Local pages applied to src/content/docs/');
