import { Browser, Page } from 'puppeteer';
import UserAgent from 'user-agents';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { BrowserOptionInterface } from './interfaces';

export class BrowserFactory {
  static async createBrowser(options: BrowserOptionInterface): Promise<Browser> {
    return await puppeteer.use(StealthPlugin()).launch(options);
  }

  static async getPage(browser): Promise<Page> {
    const page = (await browser.pages())[0];
    await page.setUserAgent(new UserAgent().random().toString());

    return page;
  }
}
