import { Page } from 'puppeteer';
import { SyncedProductSerializer } from '@edit-trace/models';

export class A025Service {
  async product(url: string, page: Page) {
    await page.setCookie({
      name: 'currency',
      value: 'USD',
      url: 'https://www.macys.com',
    });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const bootstrap = await page.evaluate(() => window?.['__INITIAL_STATE__']?.['_PDP_BOOTSTRAP_DATA']);
    const product = JSON.parse(bootstrap)?.product;

    if (!product) throw new Error('상품 정보 로드 실패');

    return new SyncedProductSerializer({
      timestamp: new Date().toString(),
      id: product.id,
      name: product.detail?.name,
      currency: 'USD',
      images: product?.imagery?.images?.map((image) => `${product?.urlTemplate?.product}${image?.filePath}`) || [],
      ...A025Service.parsePrice(product?.pricing),
    });
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
