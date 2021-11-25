import { Page } from 'puppeteer';

export class A025Service {
  async product(url: string, page: Page) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const bootstrap = await page.evaluate(() => window?.['__INITIAL_STATE__']?.['_PDP_BOOTSTRAP_DATA']);
    return JSON.parse(bootstrap)?.product;
  }
}