import { Page } from 'puppeteer';

export class A024Service {
  async product(url: string, page: Page) {
    const productId = new URL(url)?.searchParams.get('ID');

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const response = await page.evaluate(() =>
      fetch(`https://www.bloomingdales.com/xapi/digital/v1/product/${productId}`).then((res) => res?.json())
    );

    const product = response?.product?.[0];
    if (!product) throw new Error('상품 정보 로드 실패');

    return product;
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
