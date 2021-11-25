import { Browser } from 'puppeteer';

import { SyncedProductSerializer } from '@edit-trace/models';
import { BaseEngine } from '../base-engine';
import { WithBrowser } from '../decorators/with-browser';
import { BrowserFactory } from '../factories';
import { A025Service } from './A025.service';

export default class Engine implements BaseEngine {
  private service: A025Service;

  constructor() {
    this.service = new A025Service();
  }

  @WithBrowser({ headless: true })
  async product(url: string, browser: Browser): Promise<SyncedProductSerializer> {
    const page = await BrowserFactory.getPage(browser);
    return await this.service.product(url, page);
  }
}
