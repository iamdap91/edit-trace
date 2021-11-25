import { Page } from 'puppeteer';

export class A024Service {
  async product(url: string, page: Page) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    return await page.evaluate(() =>
      fetch(`https://www.bloomingdales.com/xapi/digital/v1/product/139187`).then((res) => res?.json())
    );
  }

  // todo 나중에 기능 분리해서 다른데서 써먹자
  private static async interceptResponse(page: Page) {
    let res;
    try {
      res = await page.waitForResponse(
        (response) => {
          if (response.url().includes('https://www.bloomingdales.com/xapi/digital/v1/product/')) return true;
        },
        { timeout: 5 * 1000 }
      );
    } catch (e) {
      console.log(e);
    }
    return res;
  }
}
