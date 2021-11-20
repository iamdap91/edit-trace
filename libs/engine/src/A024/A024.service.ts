import { Page } from 'puppeteer';

export class A024Service {
  async product(url: string, page: Page) {
    const interceptor = A024Service.interceptResponse(page);
    const pageMove = page.goto(url, { waitUntil: 'domcontentloaded' });
    const response = await interceptor;
    const pageRes = await pageMove;
    if (pageRes.status() === 404) throw new Error('삭제된 상품입니다');

    console.log(await pageRes.text());
    // console.log(await response.json());
  }

  private static async interceptResponse(page: Page) {
    let res;
    const reqs = [];
    try {
      await page.on('request', (req) => {
        reqs.push(req.url());
      });

      res = await page.waitForResponse(
        (response) => {
          if (response.url().includes('https://www.bloomingdales.com/xapi/digital/v1/product/')) return true;
        },
        { timeout: 5 * 1000 }
      );
    } catch (e) {
      console.log(e);
    }

    console.log(reqs);
    return res;
  }
}
