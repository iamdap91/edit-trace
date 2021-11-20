import { Browser, Page } from 'puppeteer';
import UserAgent from 'user-agents';
import puppeteer, { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { BrowserOptionInterface } from './interfaces';

export class BrowserFactory {
  static async createBrowser(options: BrowserOptionInterface): Promise<Browser> {
    const browser = await puppeteer.use(StealthPlugin()).launch(options);

    console.log(puppeteer.pluginNames);
    return browser;
  }

  static async getPage(browser): Promise<Page> {
    const page = (await browser.pages())[0];
    await page.setUserAgent(new UserAgent().random().toString());

    return page;
  }
}
