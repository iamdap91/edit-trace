import { Browser } from 'puppeteer';

import { BaseEngine } from '../base-engine';
import { WithBrowser } from '../decorator/with-browser';
import { BrowserFactory } from '../browser-factory';
import { FormattedProductInterface } from '../interfaces';
import { A024Service } from './A024.service';

export default class Engine implements BaseEngine {
  private service: A024Service;

  constructor() {
    this.service = new A024Service();
  }

  @WithBrowser({ headless: true })
  async product(url: string, browser: Browser): Promise<FormattedProductInterface> {
    const page = await BrowserFactory.getPage(browser);
    return await this.service.product(url, page);
  }
}
