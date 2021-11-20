import { Page } from 'puppeteer';
import { flatMap } from 'lodash';
import { NativeProductAPIResponse } from './interfaces';

export class A024Service {
  async product(url: string, page: Page) {
    const pageMove = page.goto(url, { waitUntil: 'domcontentloaded' });
    const response = await A024Service.interceptResponse(page);
    const pageRes = await pageMove;
    if (pageRes.status() === 404) throw new Error('삭제된 상품입니다.');

    const apiResponse: NativeProductAPIResponse = await response.json();
    if (apiResponse?.review?.hasError) throw new Error('상품정보를 로드하는 중에 에러가 발생하였습니다.');

    return flatMap(apiResponse?.review?.includes?.products)?.[0];
  }

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
