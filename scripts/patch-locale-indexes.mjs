#!/usr/bin/env node
/**
 * Patch official locale index pages for gin.wiki local overrides.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PAGES = join(new URL('..', import.meta.url).pathname, 'src/content/pages');

for (const locale of readdirSync(PAGES, { withFileTypes: true })) {
	if (!locale.isDirectory() || locale.name === 'about') continue;
	const file = join(PAGES, locale.name, 'index.mdx');
	if (!existsSync(file)) continue;

	let content = readFileSync(file, 'utf8');
	if (!content.includes('editUrl:')) {
		content = content.replace(/^---\n/, '---\neditUrl: false\n');
	}
	content = content.replace(
		new RegExp(`link: /${locale.name}/docs/\\s*$`, 'm'),
		`link: /${locale.name}/docs/introduction/`,
	);
	writeFileSync(file, content);
}

const rootIndex = join(PAGES, 'zh-cn', 'index.mdx');
const rootDest = join(PAGES, 'index.mdx');
if (existsSync(rootIndex)) {
	const content = readFileSync(rootIndex, 'utf8').replace(
		'../../../assets/gin.png',
		'../../assets/gin.png',
	);
	writeFileSync(rootDest, content);
}

console.log('Locale index pages patched.');
