#!/usr/bin/env node
/**
 * Copy local pages from src/content/pages/ into src/content/docs/.
 * Run before dev/build so Starlight can resolve sidebar slugs.
 *
 * Layout:
 *   pages/index.mdx           → docs/index.mdx
 *   pages/{locale}/index.mdx  → docs/{locale}/index.mdx
 *   pages/about/{locale}.md   → docs/{locale}/about.md
 */
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const TARGET = join(ROOT, 'src/content/docs');
const LOCAL_PAGES = join(ROOT, 'src/content/pages');

const LOCALES = [
	'ar',
	'en',
	'es',
	'fa',
	'id',
	'ja',
	'ko-kr',
	'pt',
	'ru',
	'tr',
	'zh-cn',
	'zh-tw',
];

if (!existsSync(LOCAL_PAGES)) {
	console.log('No local pages to apply.');
	process.exit(0);
}

const indexSrc = join(LOCAL_PAGES, 'index.mdx');
if (existsSync(indexSrc)) {
	cpSync(indexSrc, join(TARGET, 'index.mdx'));
}

const localeFallback = join(LOCAL_PAGES, 'en', 'index.mdx');
for (const locale of LOCALES) {
	const src = join(LOCAL_PAGES, locale, 'index.mdx');
	const source = existsSync(src) ? src : localeFallback;
	if (!existsSync(source)) continue;
	const dest = join(TARGET, locale, 'index.mdx');
	mkdirSync(dirname(dest), { recursive: true });
	cpSync(source, dest);
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
