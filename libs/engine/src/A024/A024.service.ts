import { Page } from 'puppeteer';
import { SyncedProductSerializer } from '@edit-trace/models';

export class A024Service {
  async product(url: string, page: Page) {
    await page.setCookie({
      name: 'currency',
      value: 'USD',
      url: 'https://www.bloomingdales.com',
    });
    const productId = new URL(url)?.searchParams.get('ID');
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const response = await page.evaluate(
      (id: string) => fetch(`https://www.bloomingdales.com/xapi/digital/v1/product/${id}`).then((res) => res?.json()),
      productId
    );

    const product = response?.product?.[0];
    if (!product) throw new Error('상품 정보 로드 실패');

    return new SyncedProductSerializer({
      timestamp: new Date().toString(),
      id: product.id,
      name: product.detail?.name,
      currency: 'USD',
      images: product?.imagery?.images?.map((image) => `${product?.urlTemplate?.product}${image?.filePath}`) || [],
      ...A024Service.parsePrice(product?.pricing),
    });
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

  private static parsePrice(pricing) {
    const [priceInfo, salePriceInfo] = pricing.price.tieredPrice;

    const price = priceInfo?.values?.[0]?.value;
    const salePrice = salePriceInfo?.values?.[0]?.value;

    return {
      price,
      salePrice: salePrice ?? price,
    };
  }
}
