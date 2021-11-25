import { Browser } from 'puppeteer';

import { BaseEngine } from '../base-engine';
import { WithBrowser } from '../decorators/with-browser';
import { BrowserFactory } from '../factories';
import { FormattedProductInterface } from '../interfaces';
import { A025Service } from './A025.service';

export default class Engine implements BaseEngine {
  private service: A025Service;

  constructor() {
    this.service = new A025Service();
  }

  @WithBrowser({ headless: true })
  async product(url: string, browser: Browser): Promise<FormattedProductInterface> {
    const page = await BrowserFactory.getPage(browser);
    return await this.service.product(url, page);
  }
}
