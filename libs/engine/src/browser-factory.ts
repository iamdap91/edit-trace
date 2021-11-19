import { BrowserOptionInterface } from './interfaces';

export class BrowserFactory {
  static async createBrowser(options: BrowserOptionInterface) {
    console.log(options);
  }
}
