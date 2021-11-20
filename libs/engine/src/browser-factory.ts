import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { BrowserOptionInterface } from './interfaces';

const defaultBrowserOptions = {};

export class BrowserFactory {
  static async createBrowser(options: BrowserOptionInterface) {
    const browserOptions = { ...defaultBrowserOptions, ...options };

    await puppeteer.use(StealthPlugin()).launch({ headless: false });
    // .then(async (browser) => {
    //   const page = await browser.newPage();
    //   await page.goto('https://bot.sannysoft.com');
    //   await page.waitForTimeout(5000);
    //   await page.screenshot({ path: 'stealth.png', fullPage: true });
    //   await browser.close();
    // });
  }
}
