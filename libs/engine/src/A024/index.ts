import { A024Service } from './A024.service';
import { BaseEngine } from '../base-engine';
import { WithBrowser } from '../decorator/with-browser';

export default class Engine implements BaseEngine {
  private service: A024Service;

  constructor() {
    this.service = new A024Service();
  }

  @WithBrowser({
    test: true,
  })
  async product(): Promise<unknown> {
    console.log('product called');
    return Promise.resolve(undefined);
  }
}
