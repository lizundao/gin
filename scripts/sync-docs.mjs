#!/usr/bin/env node
/**
 * Sync documentation from gin-gonic/website (docs only, not the full site).
 * Local pages in src/content/pages/ are preserved and re-applied after each sync.
 * Usage: node scripts/sync-docs.mjs
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const TMP = join(tmpdir(), 'gin-website-sync.tar.gz');
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

function applyLocalPages() {
	if (!existsSync(LOCAL_PAGES)) return;

	const indexSrc = join(LOCAL_PAGES, 'index.mdx');
	if (existsSync(indexSrc)) {
		cpSync(indexSrc, join(TARGET, 'index.mdx'));
		console.log('Restored local index.mdx');
	}

	const homeDir = join(LOCAL_PAGES, 'home');
	const homeFallback = join(homeDir, 'en.mdx');
	if (existsSync(homeDir)) {
		for (const locale of LOCALES) {
			const src = join(homeDir, `${locale}.mdx`);
			const source = existsSync(src) ? src : homeFallback;
			if (!existsSync(source)) continue;
			const dest = join(TARGET, locale, 'index.mdx');
			mkdirSync(dirname(dest), { recursive: true });
			cpSync(source, dest);
		}
		console.log('Restored local home pages');
	}

	const aboutDir = join(LOCAL_PAGES, 'about');
	if (!existsSync(aboutDir)) return;

	for (const file of readdirSync(aboutDir)) {
		if (!file.endsWith('.md')) continue;
		const locale = file.replace(/\.md$/, '');
		const dest = join(TARGET, locale, 'about.md');
		mkdirSync(dirname(dest), { recursive: true });
		cpSync(join(aboutDir, file), dest);
		console.log(`Restored local about page: ${locale}`);
	}
}

console.log('Downloading docs from gin-gonic/website...');
execSync(
	`curl -fsSL https://github.com/gin-gonic/website/archive/refs/heads/master.tar.gz -o "${TMP}"`,
	{ stdio: 'inherit' },
);

const extractDir = join(tmpdir(), 'gin-website-extract');
rmSync(extractDir, { recursive: true, force: true });
mkdirSync(extractDir, { recursive: true });

execSync(`tar xzf "${TMP}" -C "${extractDir}" website-master/src/content/docs/`, {
	stdio: 'inherit',
});

const src = join(extractDir, 'website-master/src/content/docs');
rmSync(TARGET, { recursive: true, force: true });
mkdirSync(TARGET, { recursive: true });
cpSync(src, TARGET, { recursive: true });

applyLocalPages();

execSync(
	`curl -fsSL https://raw.githubusercontent.com/gin-gonic/website/master/src/assets/gin.png -o "${join(ROOT, 'src/assets/gin.png')}"`,
	{ stdio: 'inherit' },
);
execSync(
	`curl -fsSL https://raw.githubusercontent.com/gin-gonic/website/master/public/favicon.ico -o "${join(ROOT, 'public/favicon.ico')}"`,
	{ stdio: 'inherit' },
);

rmSync(extractDir, { recursive: true, force: true });
rmSync(TMP, { force: true });

console.log('Done. Docs synced; local pages in src/content/pages/ were preserved.');
