import { A024Service } from './A024.service';
import { BaseEngine } from '../base-engine';
import { WithBrowser } from '../decorator/with-browser';

export default class Engine implements BaseEngine {
  private service: A024Service;

  constructor() {
    this.service = new A024Service();
  }

  @WithBrowser({ headless: false })
  async product(targetUrl, options): Promise<unknown> {
    return await this.service.product(targetUrl);
  }
}
