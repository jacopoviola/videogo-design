// Screenshots APPROVAL_BOARD.html to renders/APPROVAL_BOARD.png (1:1 CSS pixels; screens at native 1440px width).
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 3104, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(root, 'APPROVAL_BOARD.html')).href, { waitUntil: 'load' });
const broken = await page.$$eval('img', imgs => imgs.filter(i => !i.complete || !i.naturalWidth).map(i => i.src));
if (broken.length) throw new Error('Missing images: ' + broken.join(', '));
await page.screenshot({ path: path.join(root, 'renders/APPROVAL_BOARD.png'), fullPage: true });
const names = ['APPROVAL_A_TODAY', 'APPROVAL_B_STUDIO', 'APPROVAL_C_TITLE', 'APPROVAL_D_DETAILS', 'APPROVAL_E_TOKENS'];
const sections = page.locator('section');
if (await sections.count() !== names.length) throw new Error('Unexpected section count');
for (let i = 0; i < names.length; i++) await sections.nth(i).screenshot({ path: path.join(root, 'renders', `${names[i]}.png`) });
const size = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
await browser.close();
console.log('APPROVAL_BOARD.png', size.join('×'));
